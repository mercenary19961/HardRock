<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Cookie consent and the privacy policy it links to.
 *
 * The consent decision itself is client side (a cookie plus a Consent Mode
 * update), so what is testable from here is the part that has to be right before
 * a single tag fires: the DENIED defaults ship on every public page and ship
 * BEFORE the loaders, staff surfaces carry no tag at all, nothing fires for a
 * visitor who cannot answer the banner, and the "Learn more" destination is a
 * real, crawlable page rather than a dead link.
 */
class CookieConsentTest extends TestCase
{
    // ---------------------------------------------------------------
    // Privacy policy page
    // ---------------------------------------------------------------

    public function test_privacy_page_loads_successfully(): void
    {
        $this->get('/privacy')->assertStatus(200);
    }

    public function test_privacy_page_renders_correct_inertia_component(): void
    {
        $this->get('/privacy')
            ->assertInertia(fn (Assert $page) => $page->component('Privacy'));
    }

    public function test_privacy_page_is_listed_in_the_sitemap(): void
    {
        // The banner's "Learn more" link is only meaningful if the policy is
        // reachable and indexable; a policy nobody can find is not a policy.
        $sitemap = file_get_contents(public_path('sitemap.xml'));

        $this->assertStringContainsString('https://www.hardrock-co.com/privacy', $sitemap);
    }

    public function test_robots_txt_does_not_block_the_privacy_page(): void
    {
        $robots = file_get_contents(public_path('robots.txt'));

        $this->assertStringNotContainsString('Disallow: /privacy', $robots);
    }

    public function test_privacy_page_is_indexable_and_titled_the_same_in_blade_and_ssr(): void
    {
        // Two <title> tags ship per page (Blade + Inertia SSR). PAGE_TITLE in
        // resources/js/pages/Privacy.tsx mirrors the Blade entry asserted here;
        // if they diverge, Google picks whichever it likes.
        $this->get('/privacy')
            ->assertSee('Privacy &amp; Cookie Policy | HardRock - Digital Marketing Agency Jordan', false)
            ->assertSee('content="index, follow"', false);
    }

    // ---------------------------------------------------------------
    // Consent Mode defaults
    // ---------------------------------------------------------------

    public function test_public_pages_deny_every_non_essential_signal_by_default(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee("gtag('consent', 'default'", false);

        // Each of these must start denied. Granting any one of them here would let
        // a tag write its cookie on first paint, before the visitor has chosen.
        foreach (['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage', 'personalization_storage'] as $signal) {
            $response->assertSee("{$signal}: 'denied'", false);
        }
    }

    public function test_consent_mode_block_reads_the_same_cookie_the_client_writes(): void
    {
        // resources/js/lib/consent.ts writes `hardrock_consent`. If these two ever
        // drift, a repeat visitor's tags stay denied until React hydrates and
        // nothing visibly breaks, which is exactly why it is pinned here.
        $this->get('/')->assertSee('hardrock_consent=', false);
    }

    public function test_consent_defaults_precede_every_tag_loader(): void
    {
        // The ordering is the whole point: defaults must be in place before GTM
        // and the Ads tag can run, or the first tag fires ungated.
        $html = $this->get('/')->getContent();

        $defaultsAt = strpos($html, "gtag('consent', 'default'");
        $gtmAt = strpos($html, 'googletagmanager.com/gtm.js');
        $adsAt = strpos($html, 'googletagmanager.com/gtag/js');

        $this->assertNotFalse($defaultsAt);
        $this->assertNotFalse($gtmAt);
        $this->assertNotFalse($adsAt);
        $this->assertLessThan($gtmAt, $defaultsAt, 'Consent defaults must precede the GTM loader.');
        $this->assertLessThan($adsAt, $defaultsAt, 'Consent defaults must precede the Google Ads tag.');
    }

    public function test_the_consent_gate_covers_the_service_pages_too(): void
    {
        $this->get('/services/seo')
            ->assertStatus(200)
            ->assertSee("gtag('consent', 'default'", false);
    }

    // ---------------------------------------------------------------
    // What must NOT be on the page
    // ---------------------------------------------------------------

    public function test_the_cookieyes_cmp_is_gone(): void
    {
        // Replaced by the self-hosted banner. Two consent managers on one page
        // would each believe they own the decision.
        $this->get('/')->assertDontSee('cookieyes', false);
    }

    public function test_no_tracking_pixel_fires_for_a_visitor_who_cannot_answer_the_banner(): void
    {
        // The Meta and LinkedIn <noscript> pixels fired on load with no way for a
        // no-JS visitor to accept or refuse first.
        $response = $this->get('/');

        $response->assertDontSee('facebook.com/tr?id=', false);
        $response->assertDontSee('px.ads.linkedin.com/collect', false);
    }

    public function test_admin_surfaces_do_not_ship_the_consent_block_or_any_tag(): void
    {
        // Staff are not site traffic, and the banner never renders there.
        $response = $this->get('/login');

        $response->assertStatus(200);
        $response->assertDontSee("gtag('consent'", false);
        $response->assertDontSee('googletagmanager.com', false);
    }
}
