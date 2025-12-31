import { Head } from '@inertiajs/react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import WhyHardRock from '@/components/landing/WhyHardRock';
import Services from '@/components/landing/Services';
import ContactUs from '@/components/landing/ContactUs';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import SmoothScroll from '@/components/SmoothScroll';

export default function Landing() {
    return (
        <>
            <Head title="Home">
                <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                <meta httpEquiv="Pragma" content="no-cache" />
                <meta httpEquiv="Expires" content="0" />

                {/* Preload critical resources */}
                <link rel="preload" href="/images/hero-icon.webp" as="image" type="image/webp" />

                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-TJTKSH9J');`
                    }}
                />
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-TFQFC7Q08R" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-TFQFC7Q08R');`
                    }}
                />
            </Head>

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
                    </main>

                    <Footer />
                    <WhatsAppButton />
                </div>
            </SmoothScroll>
        </>
    );
}
