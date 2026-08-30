import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import WhyHardRock from '@/components/landing/WhyHardRock';
import Services from '@/components/landing/Services';
import ClientsPartners from '@/components/landing/ClientsPartners';
import ContactUs from '@/components/landing/ContactUs';
import LocationMap from '@/components/landing/LocationMap';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import SmoothScroll from '@/components/SmoothScroll';
import CookieConsent from '@/components/CookieConsent';
import { CONSENT_CHANGED_EVENT, marketingAllowed } from '@/lib/consent';

export default function Landing() {
    // Server and first client render both default to false to keep markup identical;
    // after mount we read the hash and trigger the scroll-to-contact behavior.
    const [isDirectToContact, setIsDirectToContact] = useState(false);

    useEffect(() => {
        if (window.location.hash !== '#contact-us') return;
        setIsDirectToContact(true);

        const timer = setTimeout(() => {
            const el = document.getElementById('contact-us');
            if (el) {
                el.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
            history.replaceState(null, '', window.location.pathname);
        }, 150);

        return () => clearTimeout(timer);
    }, []);

    // Marketing pixels, deferred until the page is interactive AND the visitor has
    // allowed marketing cookies.
    //
    // 🔴 Consent Mode does NOT reach these two. It gates everything Google (GTM,
    // GA4, the Ads tag in app.blade.php), but the Meta Pixel and the LinkedIn
    // Insight Tag are injected here by our own code, so the cookie is the only
    // thing standing between a first-time visitor and a PageView. Anything else
    // added to this effect needs the same gate.
    useEffect(() => {
        const loadAnalytics = () => {
            // Double-check in case of race condition
            if ((window as any).__ANALYTICS_LOADED__) return;
            (window as any).__ANALYTICS_LOADED__ = true;

            const ids = (window as any).__ANALYTICS_IDS__ || {};

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

        const loadIfAllowed = () => {
            if (!marketingAllowed()) {
                // A script already in the document cannot be recalled, but the Meta
                // Pixel has its own switch, so a visitor who revokes stops being
                // tracked without waiting for a reload. LinkedIn has no equivalent;
                // its tag simply does not come back on the next load.
                (window as any).fbq?.('consent', 'revoke');

                return;
            }

            // Load after the page is idle, or after 3.5s as fallback
            if ('requestIdleCallback' in window) {
                requestIdleCallback(loadAnalytics);
            } else {
                setTimeout(loadAnalytics, 3500);
            }
        };

        loadIfAllowed();

        // Accepting in the banner loads them on the spot rather than on the next
        // page load, which is what makes "Accept" feel like it did something.
        window.addEventListener(CONSENT_CHANGED_EVENT, loadIfAllowed);

        return () => window.removeEventListener(CONSENT_CHANGED_EVENT, loadIfAllowed);
    }, []);

    return (
        <>
            {/* Must match the default $pageTitle in app.blade.php — see SERVICE_TITLES note in Services.tsx */}
            <Head title="HardRock | Digital Marketing Agency & AI Solutions in Jordan" />

            <SmoothScroll>
                <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
                    <Navbar />
                    
                    <main>
                        <Hero />
                        <div className={isDirectToContact ? '' : 'content-auto'}>
                            <WhyHardRock />
                        </div>
                        <div className={isDirectToContact ? '' : 'content-auto'}>
                            <Services />
                        </div>
                        <div className={isDirectToContact ? '' : 'content-auto'}>
                            <ClientsPartners />
                        </div>
                        <div className={isDirectToContact ? '' : 'content-auto'}>
                            <ContactUs skipAnimation={isDirectToContact} />
                        </div>
                        <div className={isDirectToContact ? '' : 'content-auto'}>
                            <LocationMap />
                        </div>
                    </main>

                    <Footer />
                    <WhatsAppButton />
                    <CookieConsent />
                </div>
            </SmoothScroll>
        </>
    );
}
