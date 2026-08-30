import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Cookie, ShieldCheck, BarChart3, Megaphone } from 'lucide-react';
import {
    applyConsent,
    choiceForAction,
    currentChoice,
    needsConsent,
    OPEN_CONSENT_EVENT,
    type ConsentAction,
    type ConsentChoice,
} from '@/lib/consent';

/**
 * Self-hosted cookie-consent banner, replacing the CookieYes CMP.
 *
 * One mechanism (Google Consent Mode v2) gates every tag inside GTM, so GA4,
 * Google Ads and anything else added to the container later is covered without
 * touching this component. The Meta Pixel and the LinkedIn Insight Tag are
 * injected by our own code in Landing.tsx and are gated there off the same
 * cookie, because Consent Mode does not reach them.
 *
 * The DENIED defaults and the repeat-visit re-grant live inline in
 * resources/views/app.blade.php, before GTM loads. This component only records
 * the visitor's choice and sends the 'update'.
 *
 * Mounted per public page rather than in a layout: this codebase has no shared
 * public layout, and the banner must not follow staff into /admin.
 */
export default function CookieConsent() {
    const { t, i18n } = useTranslation('consent');
    const isArabic = i18n.language === 'ar';
    const [visible, setVisible] = useState(false);
    const [entered, setEntered] = useState(false); // drives the slide-up
    const [panelOpen, setPanelOpen] = useState(false);
    const [custom, setCustom] = useState<ConsentChoice>({ analytics: false, marketing: false });

    const open = useCallback(() => {
        // Re-opening from the footer should show what is currently on file, not a
        // blank pair of toggles, otherwise "Save choices" silently revokes.
        if (typeof document !== 'undefined') {
            const existing = currentChoice(document.cookie);
            if (existing) setCustom(existing);
        }
        setVisible(true);
        // Next frame, so the transition runs from the off-screen state.
        requestAnimationFrame(() => setEntered(true));
    }, []);

    // Decide AFTER mount: the server has no document, and SSR markup must match.
    useEffect(() => {
        if (typeof document !== 'undefined' && needsConsent(document.cookie)) {
            open();
        }
    }, [open]);

    // Let a "Cookie settings" control anywhere re-open the banner.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handler = () => {
            setPanelOpen(false);
            open();
        };
        window.addEventListener(OPEN_CONSENT_EVENT, handler);

        return () => window.removeEventListener(OPEN_CONSENT_EVENT, handler);
    }, [open]);

    const submit = (action: ConsentAction) => {
        applyConsent(choiceForAction(action, custom));
        setEntered(false);
        window.setTimeout(() => setVisible(false), 450); // let the slide-down finish
    };

    if (!visible) return null;

    const headingFont = isArabic ? 'font-tajawal font-bold' : 'font-poppins font-semibold';
    const bodyFont = isArabic ? 'font-tajawal font-medium' : 'font-poppins font-light';
    const buttonFont = isArabic ? 'font-tajawal font-bold' : 'font-poppins font-medium';

    return (
        /* pointer-events-none on the full-width strip so the WhatsApp bubble
           (fixed bottom-right, z-50) stays clickable through the transparent
           gutter beside the card; the card itself takes events back. The bottom
           pad clears that bubble until the viewport is wide enough for the
           centred card to leave it a gutter of its own. */
        <div
            role="dialog"
            aria-live="polite"
            aria-label={t('title')}
            className={`pointer-events-none fixed inset-x-0 bottom-0 z-[60] px-4 pb-20 xl:pb-6 transition-transform duration-500 ease-out motion-reduce:transition-none ${
                entered ? 'translate-y-0' : 'translate-y-[130%]'
            }`}
        >
            {/* Hairline brand gradient around the card, the same treatment the
                contact form's success card uses. */}
            <div className="pointer-events-auto mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-brand-purple to-brand-red p-px shadow-2xl">
                <div className="rounded-2xl bg-white dark:bg-black p-5 sm:p-6">
                    {/* Capped so a short viewport with the panel expanded still
                        reaches the buttons. */}
                    <div className="max-h-[75vh] overflow-y-auto">
                        <div className="flex items-start gap-4">
                            <span className="mt-0.5 shrink-0 rounded-full bg-gradient-to-r from-brand-purple to-brand-red p-2.5 text-white">
                                <Cookie size={20} />
                            </span>
                            <div className="min-w-0">
                                <p className={`mb-1 text-[11px] uppercase tracking-widest bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent ${headingFont}`}>
                                    {t('label')}
                                </p>
                                <h2 className={`text-lg sm:text-xl leading-tight text-black dark:text-white ${headingFont}`}>
                                    {t('title')}
                                </h2>
                                <p className={`mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400 ${bodyFont}`}>
                                    {t('body')}
                                </p>
                                <Link
                                    href="/privacy"
                                    className={`mt-2 inline-block text-sm text-brand-purple dark:text-brand-red underline underline-offset-4 transition-colors hover:text-brand-red dark:hover:text-brand-purple ${buttonFont}`}
                                >
                                    {t('privacyLink')}
                                </Link>
                            </div>
                        </div>

                        {panelOpen && (
                            <div className="mt-5 space-y-2 border-t border-gray-200 dark:border-white/10 pt-5">
                                <CategoryRow
                                    icon={<ShieldCheck size={15} />}
                                    label={t('categories.necessary.label')}
                                    description={t('categories.necessary.description')}
                                    lockedLabel={t('categories.necessary.always')}
                                    headingFont={headingFont}
                                    bodyFont={bodyFont}
                                />
                                <CategoryRow
                                    icon={<BarChart3 size={15} />}
                                    label={t('categories.analytics.label')}
                                    description={t('categories.analytics.description')}
                                    checked={custom.analytics}
                                    onChange={(v) => setCustom((c) => ({ ...c, analytics: v }))}
                                    headingFont={headingFont}
                                    bodyFont={bodyFont}
                                />
                                <CategoryRow
                                    icon={<Megaphone size={15} />}
                                    label={t('categories.marketing.label')}
                                    description={t('categories.marketing.description')}
                                    checked={custom.marketing}
                                    onChange={(v) => setCustom((c) => ({ ...c, marketing: v }))}
                                    headingFont={headingFont}
                                    bodyFont={bodyFont}
                                />
                            </div>
                        )}

                        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setPanelOpen((o) => !o)}
                                className={`cursor-pointer rounded-full px-6 py-2.5 text-sm text-gray-600 dark:text-gray-300 transition-colors hover:text-black dark:hover:text-white ${buttonFont}`}
                            >
                                {panelOpen ? t('back') : t('customise')}
                            </button>

                            {/* Reject carries the same weight as Accept on purpose: making
                                refusal harder than acceptance is the dark pattern regulators
                                cite first. */}
                            <button
                                type="button"
                                onClick={() => submit('reject_all')}
                                className={`cursor-pointer rounded-full border border-gray-300 dark:border-white/20 px-6 py-2.5 text-sm text-black dark:text-white transition-colors hover:border-black dark:hover:border-white ${buttonFont}`}
                            >
                                {t('rejectAll')}
                            </button>

                            <button
                                type="button"
                                onClick={() => submit(panelOpen ? 'custom' : 'accept_all')}
                                className={`cursor-pointer rounded-full bg-gradient-to-r from-brand-purple to-brand-red px-6 py-2.5 text-sm text-white transition-all duration-300 hover:shadow-lg hover:shadow-brand-red/30 ${buttonFont}`}
                            >
                                {panelOpen ? t('save') : t('acceptAll')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface CategoryRowProps {
    label: string;
    description: string;
    headingFont: string;
    bodyFont: string;
    icon?: ReactNode;
    checked?: boolean;
    onChange?: (value: boolean) => void;
    lockedLabel?: string;
}

function CategoryRow({ label, description, headingFont, bodyFont, icon, checked, onChange, lockedLabel }: CategoryRowProps) {
    const locked = onChange === undefined;

    return (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3">
            <div className="min-w-0">
                <span className={`flex items-center gap-2 text-sm text-black dark:text-white ${headingFont}`}>
                    <span className="text-brand-purple dark:text-brand-red">{icon}</span>
                    {label}
                </span>
                <p className={`mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400 ${bodyFont}`}>
                    {description}
                </p>
            </div>

            {locked ? (
                <span className={`shrink-0 whitespace-nowrap rounded-full bg-gradient-to-r from-brand-purple to-brand-red px-2.5 py-1 text-[11px] text-white ${bodyFont}`}>
                    {lockedLabel}
                </span>
            ) : (
                <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-label={label}
                    onClick={() => onChange(!checked)}
                    className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                        checked
                            ? 'bg-gradient-to-r from-brand-purple to-brand-red'
                            : 'bg-gray-300 dark:bg-white/15'
                    }`}
                >
                    {/* The knob travels on the inline axis so it reads correctly in RTL. */}
                    <span
                        className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${
                            checked ? 'start-[1.375rem]' : 'start-0.5'
                        }`}
                    />
                </button>
            )}
        </div>
    );
}
