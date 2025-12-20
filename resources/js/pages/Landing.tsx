import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import Snowfall from 'react-snowfall';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import WhyHardRock from '@/components/landing/WhyHardRock';
import Services from '@/components/landing/Services';
import ContactUs from '@/components/landing/ContactUs';
import Footer from '@/components/landing/Footer';
import SmoothScroll from '@/components/SmoothScroll';

export default function Landing() {
    const snowflake1 = useMemo(() => {
        const img = new Image();
        img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTEyIDJsMS41IDQuNUwxOCA3bC00LjUgMS41TDEyIDEzTDEwLjUgOC41IDYgN0w5LjUgNS41TDEyIDJ6Ii8+PC9zdmc+';
        return img;
    }, []);

    return (
        <>
            <Head title="Home">
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
                    <Snowfall
                        snowflakeCount={150}
                        color="#ffffff"
                        radius={[8.0, 16.0]}
                        speed={[0.5, 2.0]}
                        wind={[-0.5, 1.0]}
                        rotationSpeed={[-1.0, 1.0]}
                        images={[snowflake1]}
                        style={{
                            position: 'fixed',
                            width: '100vw',
                            height: '100vh',
                            zIndex: 50
                        }}
                    />
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
                </div>
            </SmoothScroll>
        </>
    );
}
