@php
    $path = request()->path();
    $baseUrl = 'https://www.hardrock-co.com';
    $currentUrl = $path === '/' ? $baseUrl . '/' : $baseUrl . '/' . $path;

    // Server-aware appearance (read from cookies; defaults match React initial state)
    $language = in_array(request()->cookie('language'), ['en', 'ar'], true)
        ? request()->cookie('language')
        : 'en';
    $theme = in_array(request()->cookie('theme'), ['light', 'dark'], true)
        ? request()->cookie('theme')
        : 'dark';
    $dir = $language === 'ar' ? 'rtl' : 'ltr';

    // Staff-facing surfaces. They are never indexed, and they never carry a
    // tracking tag: staff are not site traffic, and the consent banner does not
    // render there either (it is mounted per public page, not in a layout).
    $isAdminSurface = str_starts_with($path, 'admin') || str_starts_with($path, 'login')
        || str_starts_with($path, 'forgot-password') || str_starts_with($path, 'reset-password');
    $noIndex = $isAdminSurface;

    // Service-specific SEO data
    $serviceSeo = [
        'services/social-media' => [
            'title' => 'Social Media Management | HardRock - Digital Marketing Agency Jordan',
            'h1' => 'Social Media Management',
            'description' => 'Professional social media management services in Jordan. HardRock helps brands in Amman grow their online presence with strategic content and community management.',
            'ogTitle' => 'Social Media Marketing | HardRock',
            'ogImage' => $baseUrl . '/images/services/social-media-2.webp',
        ],
        'services/paid-ads' => [
            'title' => 'Meta & Google Ads Management | HardRock - Digital Marketing Agency Jordan',
            'h1' => 'Meta & Google Ads Management',
            'description' => 'Expert paid advertising services in Jordan. HardRock delivers high-ROI Meta and Google Ads campaigns for businesses in Amman and across the MENA region.',
            'ogTitle' => 'Paid Advertising | HardRock',
            'ogImage' => $baseUrl . '/images/services/paid-ads-2.webp',
        ],
        'services/seo' => [
            'title' => 'SEO Services in Jordan | HardRock - Digital Marketing Agency',
            'h1' => 'SEO (Search Engine Optimization)',
            'description' => 'Top SEO services in Jordan. HardRock helps businesses in Amman rank higher on Google with data-driven search engine optimization strategies.',
            'ogTitle' => 'SEO Services | HardRock',
            'ogImage' => $baseUrl . '/images/services/seo-2.webp',
        ],
        'services/pr-social-listening' => [
            'title' => 'PR & Social Listening | HardRock - Digital Marketing Agency Jordan',
            'h1' => 'PR & Social Listening',
            'description' => 'PR and social listening services in Jordan. Monitor your brand reputation and manage public relations with HardRock, Amman\'s leading digital marketing agency.',
            'ogTitle' => 'PR & Social Listening | HardRock',
            'ogImage' => $baseUrl . '/images/services/pr-2.webp',
        ],
        'services/branding' => [
            'title' => 'Branding Services in Jordan | HardRock - Digital Marketing Agency',
            'h1' => 'Branding',
            'description' => 'Professional branding services in Jordan. HardRock creates compelling brand identities for businesses in Amman looking to stand out in the market.',
            'ogTitle' => 'Branding Services | HardRock',
            'ogImage' => $baseUrl . '/images/services/branding-2.webp',
        ],
        'services/software-ai' => [
            'title' => 'Software & AI Solutions in Jordan | HardRock - Digital Marketing Agency',
            'h1' => 'Software & AI Solutions',
            'description' => 'AI solutions and software development in Jordan. HardRock builds custom AI-powered tools and software for businesses in Amman and the MENA region.',
            'ogTitle' => 'Software & AI Solutions | HardRock',
            'ogImage' => $baseUrl . '/images/services/ai-2.webp',
        ],
        // Not a service, but the same per-path map: SSR emits a second <title>
        // next to this one, so PAGE_TITLE in resources/js/pages/Privacy.tsx has
        // to mirror this entry exactly. Change both together.
        'privacy' => [
            'title' => 'Privacy & Cookie Policy | HardRock - Digital Marketing Agency Jordan',
            'h1' => 'Privacy and Cookie Policy',
            'description' => 'How HardRock collects, uses and protects the information you give us through hardrock-co.com, and how to control the cookies this site uses.',
            'ogTitle' => 'Privacy & Cookie Policy | HardRock',
            'ogImage' => $baseUrl . '/images/og-image-2.webp',
        ],
    ];

    $seo = $serviceSeo[$path] ?? null;
    $pageTitle = $seo['title'] ?? 'HardRock | Digital Marketing Agency & AI Solutions in Jordan';
    $metaDescription = $seo['description'] ?? 'Scale your brand with HardRock, Amman\'s leading digital marketing agency. Expert AI solutions, SEO, Paid Ads, and Branding designed for data-driven growth.';
    $ogTitle = $seo['ogTitle'] ?? 'HardRock | Data-Driven Digital Marketing & AI Solutions';
    $ogDescription = $seo ? $seo['description'] : 'Transform your brand with Amman\'s leading experts in AI solutions, SEO, and performance marketing. Scale your business with data-backed strategies that deliver ROI.';
    $ogImage = $seo['ogImage'] ?? $baseUrl . '/images/og-image-2.webp';
@endphp
<!DOCTYPE html>
<html lang="{{ $language }}" dir="{{ $dir }}" class="{{ $theme }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ $pageTitle }}</title>

        <!-- SEO Meta Tags -->
        <meta name="description" content="{{ $metaDescription }}">
        <meta name="keywords" content="digital marketing agency jordan, paid ads meta google, social media management amman, SEO services jordan, branding agency, AI solutions, software development jordan, PR agency, digital transformation, performance marketing, growth marketing, marketing automation, jordan tech company">
        <meta name="author" content="HardRock">
        <meta name="robots" content="{{ $noIndex ? 'noindex, nofollow' : 'index, follow' }}">
        <meta name="language" content="English, Arabic">
        <meta name="geo.region" content="JO-AM">
        <meta name="geo.placename" content="Amman, Jordan">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ $currentUrl }}">
        <meta property="og:title" content="{{ $ogTitle }}">
        <meta property="og:description" content="{{ $ogDescription }}">
        <meta property="og:image" content="{{ $ogImage }}">
        <meta property="og:site_name" content="HardRock">
        <meta property="og:locale" content="{{ $language === 'ar' ? 'ar_AR' : 'en_US' }}">
        <meta property="og:locale:alternate" content="{{ $language === 'ar' ? 'en_US' : 'ar_AR' }}">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ $currentUrl }}">
        <meta property="twitter:title" content="{{ $ogTitle }}">
        <meta property="twitter:description" content="{{ $ogDescription }}">
        <meta property="twitter:image" content="{{ $ogImage }}">

        <!-- Additional SEO -->
        <link rel="canonical" href="{{ $currentUrl }}">
        <meta name="theme-color" content="#8B5CF6">

        <!-- hreflang - bilingual support (same URL serves both languages via client-side toggle) -->
        <link rel="alternate" hreflang="en" href="{{ $currentUrl }}">
        <link rel="alternate" hreflang="ar" href="{{ $currentUrl }}">
        <link rel="alternate" hreflang="x-default" href="{{ $currentUrl }}">

        <!-- Favicon (all sizes for maximum compatibility) -->
        <link rel="icon" href="/images/favicon-16x16.png" sizes="16x16" type="image/png">
        <link rel="icon" href="/images/favicon-32x32.png" sizes="32x32" type="image/png">
        <link rel="icon" href="/images/favicon-48x48.png" sizes="48x48" type="image/png">
        <link rel="icon" href="/images/favicon-96x96.png" sizes="96x96" type="image/png">
        <link rel="icon" href="/images/favicon-192x192.png" sizes="192x192" type="image/png">
        <link rel="apple-touch-icon" sizes="192x192" href="/images/favicon-192x192.png">
        <!-- Fallback for legacy browsers -->
        <link rel="shortcut icon" href="/favicon.ico">

        <!-- Preload LCP images -->
        <link rel="preload" as="image" href="/images/hero-icon.webp" type="image/webp" fetchpriority="high">
        <link rel="preload" as="image" href="/images/bg%20wave.webp" type="image/webp" fetchpriority="high">

        <!-- Fonts (non-render-blocking) -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Tajawal:wght@200;300;400;700;800&family=Cairo:wght@400&family=Poppins:wght@200;300;400;500;700&display=swap">
        <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Tajawal:wght@200;300;400;700;800&family=Cairo:wght@400&family=Poppins:wght@200;300;400;500;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
        <noscript><link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Tajawal:wght@200;300;400;700;800&family=Cairo:wght@400&family=Poppins:wght@200;300;400;500;700&display=swap" rel="stylesheet"></noscript>
        <link rel="preload" as="style" href="/fonts/sfpro.css">
        <link href="/fonts/sfpro.css" rel="stylesheet" media="print" onload="this.media='all'">
        <noscript><link rel="stylesheet" href="/fonts/sfpro.css"></noscript>

        {{-- Google Consent Mode v2. Everything non-essential starts DENIED before
             any tag can read consent state, so nothing tracks without a choice.
             The banner (resources/js/components/CookieConsent.tsx) sends the
             'update' when the visitor decides; repeat visitors are re-granted
             here from the cookie so their tags work on first paint instead of
             waiting for React to hydrate.

             INLINE and BEFORE the two loaders below, on purpose: a deferred Vite
             bundle cannot guarantee it runs first, and a tag that reads consent
             state before the defaults exist fires ungated.

             ⚠️ The cookie name and the payload keys mirror
             resources/js/lib/consent.ts. Change one and you must change the other. --}}
        @unless ($isAdminSurface)
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                functionality_storage: 'granted',
                personalization_storage: 'denied',
                security_storage: 'granted',
                wait_for_update: 500
            });
            try {
                var m = document.cookie.match(/(?:^|;\s*)hardrock_consent=([^;]*)/);
                if (m) {
                    var v = JSON.parse(decodeURIComponent(m[1]));
                    gtag('consent', 'update', {
                        ad_storage: v.marketing ? 'granted' : 'denied',
                        ad_user_data: v.marketing ? 'granted' : 'denied',
                        ad_personalization: v.marketing ? 'granted' : 'denied',
                        analytics_storage: v.analytics ? 'granted' : 'denied',
                        personalization_storage: v.marketing ? 'granted' : 'denied'
                    });
                }
            } catch (e) { /* malformed cookie: stay denied */ }
        </script>

        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TJTKSH9J');</script>

        <!-- Google Ads -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17900618489"></script>
        <script>
            gtag('js', new Date());
            gtag('config', 'AW-17900618489');
        </script>
        @endunless

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
        @inertiaHead

        <!-- Structured Data / JSON-LD Schema -->
        @include('partials.structured-data')

        <!-- Analytics IDs (scripts deferred to Landing.tsx) -->
        <script>
            window.__ANALYTICS_IDS__ = {
                fbPixelId: "{{ config('services.facebook.pixel_id') }}",
                linkedinPartnerId: "{{ config('services.linkedin.partner_id') }}"
            };
        </script>
        {{-- The Meta and LinkedIn <noscript> pixel fallbacks that used to sit here
             were removed with the consent gate: they are the tracking pixel
             itself, fired on page load with no way for a visitor who has JS
             switched off to accept or refuse first. Anything that cannot be
             gated does not ship. --}}
    </head>
    <body class="font-sans antialiased">
        <!-- Google Tag Manager (noscript) -->
        {{-- Kept, unlike the Meta and LinkedIn noscript pixels: this is the
             container, not a tag, and only tags explicitly configured for the
             no-JS path can fire through it. Keep it that way when adding tags. --}}
        @unless ($isAdminSurface)
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TJTKSH9J"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        @endunless

        @if($seo)
        <noscript>
            <h1>{{ $seo['h1'] }}</h1>
            <p>{{ $seo['description'] }}</p>
        </noscript>
        @endif

        @inertia
    </body>
</html>
