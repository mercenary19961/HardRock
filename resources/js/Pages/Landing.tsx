import { Head } from '@inertiajs/react';
import Navbar from '@/Components/landing/Navbar';
import Hero from '@/Components/landing/Hero';
import Services from '@/Components/landing/Services';
import Testimonials from '@/Components/landing/Testimonials';
import About from '@/Components/landing/About';
import TechnicalCapabilities from '@/Components/landing/TechnicalCapabilities';
import Contact from '@/Components/landing/Contact';
import Footer from '@/Components/landing/Footer';
import SmoothScroll from '@/Components/SmoothScroll';

export default function Landing() {
    return (
        <>
            <Head>
                <title>Hard Rock - Intelligent Marketing Solutions</title>
                <meta name="description" content="Hard Rock combines creative storytelling with cutting-edge AI technology to deliver data-driven marketing strategies that scale." />
                <meta name="keywords" content="AI marketing, digital agency, marketing automation, growth hacking, data analytics, Hard Rock" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://hardrock.ai/" />
                <meta property="og:title" content="Hard Rock - Intelligent Marketing Solutions" />
                <meta property="og:description" content="We combine creative storytelling with cutting-edge AI technology to deliver data-driven marketing strategies that scale." />
                <meta property="og:image" content="https://hardrock.ai/og-image.jpg" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://hardrock.ai/" />
                <meta property="twitter:title" content="Hard Rock - Intelligent Marketing Solutions" />
                <meta property="twitter:description" content="We combine creative storytelling with cutting-edge AI technology to deliver data-driven marketing strategies that scale." />
                <meta property="twitter:image" content="https://hardrock.ai/og-image.jpg" />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "MarketingAgency",
                        "name": "Hard Rock",
                        "url": "https://hardrock.ai",
                        "logo": "https://hardrock.ai/logo.png",
                        "description": "Intelligent Marketing Solutions combining creativity and AI.",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "123 Innovation Drive",
                            "addressLocality": "Tech City",
                            "addressRegion": "TC",
                            "postalCode": "12345",
                            "addressCountry": "US"
                        },
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": "+1-555-0123",
                            "contactType": "customer service"
                        },
                        "sameAs": [
                            "https://twitter.com/hardrockai",
                            "https://linkedin.com/company/hardrockai"
                        ]
                    })}
                </script>
            </Head>
            
            <SmoothScroll>
                <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
                    <Navbar />
                    
                    <main>
                        <Hero />
                        <Services />
                        <Testimonials />
                        <About />
                        <TechnicalCapabilities />
                        <Contact />
                    </main>

                    <Footer />
                </div>
            </SmoothScroll>
        </>
    );
}
