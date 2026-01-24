import { Head } from '@inertiajs/react';
import { lazy, Suspense, useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import SmoothScroll from '@/components/SmoothScroll';

// Lazy-load below-the-fold sections
const WhyHardRock = lazy(() => import('@/components/landing/WhyHardRock'));
const Services = lazy(() => import('@/components/landing/Services'));
const ContactUs = lazy(() => import('@/components/landing/ContactUs'));
const LocationMap = lazy(() => import('@/components/landing/LocationMap'));
const Footer = lazy(() => import('@/components/landing/Footer'));
const WhatsAppButton = lazy(() => import('@/components/landing/WhatsAppButton'));

export default function Landing() {
    // Defer analytics scripts until after page is interactive
    useEffect(() => {
        const loadAnalytics = () => {
            // GTM
            const gtmScript = document.createElement('script');
            gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-TJTKSH9J');`;
            document.head.appendChild(gtmScript);

            // GA4
            const ga4Script = document.createElement('script');
            ga4Script.async = true;
            ga4Script.src = 'https://www.googletagmanager.com/gtag/js?id=G-TFQFC7Q08R';
            document.head.appendChild(ga4Script);

            const ga4Config = document.createElement('script');
            ga4Config.innerHTML = `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-TFQFC7Q08R');`;
            document.head.appendChild(ga4Config);
        };

        // Load after the page is idle, or after 3.5s as fallback
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadAnalytics);
        } else {
            setTimeout(loadAnalytics, 3500);
        }
    }, []);

    return (
        <>
            <Head title="Home" />

            <SmoothScroll>
                <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
                    <noscript>
                        <iframe
                            src="https://www.googletagmanager.com/ns.html?id=GTM-TJTKSH9J"
                            height="0"
                            width="0"
                            style={{ display: 'none', visibility: 'hidden' }}
                        />
                    </noscript>
                    <Navbar />
                    
                    <main>
                        <Hero />
                        <Suspense fallback={null}>
                            <WhyHardRock />
                            <Services />
                            <ContactUs />
                            <LocationMap />
                        </Suspense>
                    </main>

                    <Suspense fallback={null}>
                        <Footer />
                        <WhatsAppButton />
                    </Suspense>
                </div>
            </SmoothScroll>
        </>
    );
}
