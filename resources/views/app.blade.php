<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>HardRock | Digital Marketing Agency & AI Solutions in Jordan</title>

        <!-- SEO Meta Tags -->
        <meta name="description" content="Scale your brand with HardRock, Amman's leading digital marketing agency. Expert AI solutions, SEO, Paid Ads, and Branding designed for data-driven growth.">
        <meta name="keywords" content="digital marketing agency jordan, paid ads meta google, social media management amman, SEO services jordan, branding agency, AI solutions, software development jordan, PR agency, digital transformation, performance marketing, growth marketing, marketing automation, jordan tech company">
        <meta name="author" content="HardRock">
        <meta name="robots" content="index, follow">
        <meta name="language" content="English, Arabic">
        <meta name="geo.region" content="JO-AM">
        <meta name="geo.placename" content="Amman, Jordan">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://www.hardrock-co.com/">
        <meta property="og:title" content="HardRock | Data-Driven Digital Marketing & AI Solutions">
        <meta property="og:description" content="Transform your brand with Amman's leading experts in AI solutions, SEO, and performance marketing. Scale your business with data-backed strategies that deliver ROI.">
        <meta property="og:image" content="https://www.hardrock-co.com/images/og-image-2.webp">
        <meta property="og:site_name" content="HardRock">
        <meta property="og:locale" content="en_US">
        <meta property="og:locale:alternate" content="ar_AR">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="https://www.hardrock-co.com/">
        <meta property="twitter:title" content="HardRock | Amman’s Leading AI & Digital Marketing Agency">
        <meta property="twitter:description" content="Scale your business with HardRock. From AI-driven SEO to high-performance Paid Ads, we deliver data-backed growth for brands in Amman and beyond. ROI starts here.">
        <meta property="twitter:image" content="https://www.hardrock-co.com/images/og-image-2.webp">

        <!-- Additional SEO -->
        <link rel="canonical" href="https://www.hardrock-co.com/">
        <meta name="theme-color" content="#8B5CF6">

        <!-- hreflang - bilingual support (same URL serves both languages via client-side toggle) -->
        <link rel="alternate" hreflang="en" href="https://www.hardrock-co.com/">
        <link rel="alternate" hreflang="ar" href="https://www.hardrock-co.com/">
        <link rel="alternate" hreflang="x-default" href="https://www.hardrock-co.com/">

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
        <!-- Noscript fallbacks for tracking pixels -->
        @if(config('services.facebook.pixel_id'))
        <noscript>
            <img height="1" width="1" style="display:none"
                 src="https://www.facebook.com/tr?id={{ config('services.facebook.pixel_id') }}&ev=PageView&noscript=1"/>
        </noscript>
        @endif
        @if(config('services.linkedin.partner_id'))
        <noscript>
            <img height="1" width="1" style="display:none;" alt=""
                 src="https://px.ads.linkedin.com/collect/?pid={{ config('services.linkedin.partner_id') }}&fmt=gif" />
        </noscript>
        @endif
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
