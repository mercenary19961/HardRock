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
    // Check if navigated directly to contact section (e.g., from services page CTA)
    const isDirectToContact = typeof window !== 'undefined' && window.location.hash === '#contact-us';

    // Defer analytics scripts until after page is interactive
    useEffect(() => {
        // Skip if analytics already loaded (prevents duplicates on re-mount)
        if ((window as any).__ANALYTICS_LOADED__) return;

        const loadAnalytics = () => {
            // Double-check in case of race condition
            if ((window as any).__ANALYTICS_LOADED__) return;
            (window as any).__ANALYTICS_LOADED__ = true;

            const ids = (window as any).__ANALYTICS_IDS__ || {};

            // GTM
            if (!(window as any).google_tag_manager) {
                const gtmScript = document.createElement('script');
                gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-TJTKSH9J');`;
                document.head.appendChild(gtmScript);
            }

            // GA4
            if (!(window as any).gtag) {
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
            }

            // Facebook Pixel
            if (ids.fbPixelId && !(window as any).fbq) {
                const fbScript = document.createElement('script');
                fbScript.innerHTML = `!function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window,document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init','${ids.fbPixelId}');
                    fbq('track','PageView');`;
                document.head.appendChild(fbScript);
            }

            // LinkedIn Insight Tag
            if (ids.linkedinPartnerId && !(window as any)._linkedin_partner_id) {
                const liScript = document.createElement('script');
                liScript.innerHTML = `_linkedin_partner_id="${ids.linkedinPartnerId}";
                    window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];
                    window._linkedin_data_partner_ids.push(_linkedin_partner_id);`;
                document.head.appendChild(liScript);

                const liTrackScript = document.createElement('script');
                liTrackScript.async = true;
                liTrackScript.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
                document.head.appendChild(liTrackScript);
            }
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
                        <div className="content-auto">
                            <WhyHardRock />
                        </div>
                        <div className="content-auto">
                            <Services />
                        </div>
                        <div className={isDirectToContact ? '' : 'content-auto'}>
                            <ContactUs skipAnimation={isDirectToContact} />
                        </div>
                        <div className="content-auto">
                            <LocationMap />
                        </div>
                    </main>

                    <Footer />
                    <WhatsAppButton />
                </div>
            </SmoothScroll>
        </>
    );
}
