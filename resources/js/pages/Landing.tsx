import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import WhyHardRock from '@/components/landing/WhyHardRock';
import Services from '@/components/landing/Services';
import ContactUs from '@/components/landing/ContactUs';
import LocationMap from '@/components/landing/LocationMap';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import SmoothScroll from '@/components/SmoothScroll';

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
                        <WhyHardRock />
                        <Services />
                        <ContactUs />
                        <LocationMap />
                    </main>

                    <Footer />
                    <WhatsAppButton />
                </div>
            </SmoothScroll>
        </>
    );
}
