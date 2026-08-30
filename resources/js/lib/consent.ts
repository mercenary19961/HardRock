/**
 * Cookie-consent state helpers (ported from nuor-steel).
 *
 * The pure functions live here rather than inside the banner so the two things
 * most likely to break silently — the "should the banner show?" decision and the
 * Google Consent Mode v2 payload shape — stay trivial to reason about, and so the
 * privacy page and the marketing-pixel loader can reuse them without importing
 * the component.
 *
 * ⚠️ CONSENT_COOKIE and the payload keys must stay in lockstep with the inline
 * Consent Mode block in resources/views/app.blade.php. That block runs before GTM
 * and the Google Ads tag can read consent state; this file only sends the
 * 'update' once the visitor chooses.
 */

declare global {
    interface Window {
        dataLayer?: unknown[];
        /** Defined by the inline Consent Mode block in resources/views/app.blade.php. */
        gtag?: (...args: unknown[]) => void;
    }
}

export const CONSENT_COOKIE = 'hardrock_consent';

/**
 * Bump when the policy wording changes materially — a mismatch re-prompts every
 * visitor, because consent to *different* wording is not consent to *this*
 * wording. Move it together with `privacy.updated` in the locale files.
 */
export const POLICY_VERSION = '1';

/** Dispatched on window after a choice is recorded, so tag loaders can react. */
export const CONSENT_CHANGED_EVENT = 'hardrock:consent-changed';

/** Fire this event (footer link, privacy page button) to re-open the banner. */
export const OPEN_CONSENT_EVENT = 'hardrock:open-consent';

export interface ConsentChoice {
    analytics: boolean;
    marketing: boolean;
}

/** What we persist: the choice plus the policy version it was given under. */
export interface StoredConsent extends ConsentChoice {
    v: string;
}

export type ConsentAction = 'accept_all' | 'reject_all' | 'custom';

/**
 * Parse the consent cookie value. Returns null for anything unusable — absent,
 * malformed, or recorded under an older policy version — which re-prompts.
 */
export function parseConsent(raw: string | null | undefined): StoredConsent | null {
    if (!raw) return null;

    try {
        const parsed: unknown = JSON.parse(decodeURIComponent(raw));
        if (typeof parsed !== 'object' || parsed === null) return null;

        const { analytics, marketing, v } = parsed as Record<string, unknown>;
        if (typeof analytics !== 'boolean' || typeof marketing !== 'boolean') return null;
        if (v !== POLICY_VERSION) return null;

        return { analytics, marketing, v };
    } catch {
        return null;
    }
}

/**
 * Read a cookie by name from a raw document.cookie string.
 *
 * Split rather than a regex on purpose: `document.cookie` is a `name=value; ...`
 * list, and the separator is always "; ". A template-literal regex is the
 * obvious alternative and it is a trap — `\s` is not an escape sequence in a
 * template literal, so `(?:^|;\s*)` silently compiles to `(?:^|;s*)` and then
 * only ever matches a cookie that happens to be FIRST in the string.
 */
export function readCookie(cookieString: string, name: string): string | null {
    for (const part of cookieString.split(';')) {
        const eq = part.indexOf('=');
        if (eq === -1) continue;
        if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
    }

    return null;
}

/** The banner shows only when there is no valid, current-version decision on file. */
export function needsConsent(cookieString: string): boolean {
    return parseConsent(readCookie(cookieString, CONSENT_COOKIE)) === null;
}

/** The decision currently on file, or null on a first visit. */
export function currentChoice(cookieString: string): ConsentChoice | null {
    const stored = parseConsent(readCookie(cookieString, CONSENT_COOKIE));

    return stored ? { analytics: stored.analytics, marketing: stored.marketing } : null;
}

/** Whether marketing tags (Meta Pixel, LinkedIn Insight) may load right now. */
export function marketingAllowed(): boolean {
    if (typeof document === 'undefined') return false;

    return currentChoice(document.cookie)?.marketing === true;
}

/** Map a button press to the categories it implies. */
export function choiceForAction(action: ConsentAction, custom?: ConsentChoice): ConsentChoice {
    if (action === 'accept_all') return { analytics: true, marketing: true };
    if (action === 'reject_all') return { analytics: false, marketing: false };

    return custom ?? { analytics: false, marketing: false };
}

/**
 * Google Consent Mode v2 update payload. Marketing drives the three ad_* signals
 * plus personalization; analytics drives analytics_storage. Keep aligned with the
 * defaults block in app.blade.php.
 */
export function consentModePayload(choice: ConsentChoice): Record<string, 'granted' | 'denied'> {
    const ad = choice.marketing ? 'granted' : 'denied';
    const analytics = choice.analytics ? 'granted' : 'denied';

    return {
        ad_storage: ad,
        ad_user_data: ad,
        ad_personalization: ad,
        analytics_storage: analytics,
        personalization_storage: ad,
    };
}

/** Persist the choice to the versioned cookie (1 year) and signal Consent Mode. */
export function applyConsent(choice: ConsentChoice): void {
    if (typeof document === 'undefined') return;

    const payload = consentModePayload(choice);

    // Prefer the real gtag() shim from app.blade.php: it pushes the `arguments`
    // object, which is the shape Google's consent API is specified against. The
    // array push is only a fallback for the case where the inline block did not
    // run (an admin surface, where this banner never renders anyway).
    if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', payload);
    } else {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(['consent', 'update', payload]);
    }

    const oneYear = 60 * 60 * 24 * 365;
    const value = encodeURIComponent(JSON.stringify({ ...choice, v: POLICY_VERSION }));
    const secure = window.location.protocol === 'https:' ? ';Secure' : '';
    document.cookie = `${CONSENT_COOKIE}=${value};path=/;max-age=${oneYear};SameSite=Lax${secure}`;

    // Consent Mode covers everything inside GTM and the Google Ads tag, but the
    // Meta Pixel and the LinkedIn Insight Tag are injected by our own code and
    // have to be told separately. Listeners load them on the spot rather than
    // waiting for the next page load.
    window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_CHANGED_EVENT, { detail: choice }));
}
