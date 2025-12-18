import { Head } from '@inertiajs/react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import WhyHardRock from '@/components/landing/WhyHardRock';
import Services from '@/components/landing/Services';
import ContactUs from '@/components/landing/ContactUs';
import Footer from '@/components/landing/Footer';
import SmoothScroll from '@/components/SmoothScroll';

export default function Landing() {
    return (
        <>
            <Head title="Home">
            </Head>
            
            <SmoothScroll>
                <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
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
