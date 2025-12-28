<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- SEO Meta Tags -->
        <meta name="description" content="HardRock delivers data-driven digital marketing, AI solutions, and cutting-edge technology to elevate your brand. Expert services in Paid Ads, SEO, Social Media, Branding & PR in Amman, Jordan.">
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
        <meta property="og:description" content="Elevate your brand with performance marketing, AI-powered solutions, and strategic digital transformation. Based in Amman, serving globally.">
        <meta property="og:image" content="https://www.hardrock-co.com/images/og-image-2.webp">
        <meta property="og:site_name" content="HardRock">
        <meta property="og:locale" content="en_US">
        <meta property="og:locale:alternate" content="ar_AR">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="https://www.hardrock-co.com/">
        <meta property="twitter:title" content="HardRock | Data-Driven Digital Marketing & AI Solutions">
        <meta property="twitter:description" content="Elevate your brand with performance marketing, AI-powered solutions, and strategic digital transformation. Based in Amman, serving globally.">
        <meta property="twitter:image" content="https://www.hardrock-co.com/images/og-image-2.webp">

        <!-- Additional SEO -->
        <link rel="canonical" href="https://www.hardrock-co.com/">
        <meta name="theme-color" content="#8B5CF6">

        <!-- hreflang - single bilingual page -->
        <link rel="alternate" hreflang="x-default" href="https://www.hardrock-co.com/">

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon.png">

        <!-- Preload Critical Images -->
        <link rel="preload" as="image" href="/images/hero-icon.webp" fetchpriority="high">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/fonts/sfpro.css">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
        @inertiaHead

        <!-- Structured Data / JSON-LD Schema -->
        @include('partials.structured-data')

        <!-- Meta Pixel Code -->
        @if(config('services.facebook.pixel_id'))
        <script>
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{ config('services.facebook.pixel_id') }}');
            fbq('track', 'PageView');
        </script>
        <noscript>
            <img height="1" width="1" style="display:none"
                 src="https://www.facebook.com/tr?id={{ config('services.facebook.pixel_id') }}&ev=PageView&noscript=1"/>
        </noscript>
        @endif
        <!-- End Meta Pixel Code -->
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
