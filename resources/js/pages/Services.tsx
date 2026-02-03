import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import SmoothScroll from '@/components/SmoothScroll';
import ExpandableServiceSelector from '@/components/ui/expandable-service-selector';
import { useTheme } from '@/contexts/ThemeContext';

interface ServiceSection {
    subtitle: string;
    description: string;
}

interface ServiceData {
    name: string;
    hero: {
        title: string;
        subtitle: string;
    };
    sections: ServiceSection[];
    cta: {
        title: string;
        description: string;
        buttonText: string;
    };
}

interface ServicesProps {
    serviceSlug: string;
    fromNav?: boolean;
}

const SERVICE_SLUGS = [
    'social-media',
    'paid-ads',
    'seo',
    'pr-social-listening',
    'branding',
    'software-ai',
] as const;

// SEO meta descriptions for each service (for local SEO targeting "marketing agency jordan")
const SERVICE_META_DESCRIPTIONS: Record<string, string> = {
    'social-media': 'Professional social media management services in Jordan. HardRock helps brands in Amman grow their online presence with strategic content and community management.',
    'paid-ads': 'Expert paid advertising services in Jordan. HardRock delivers high-ROI Meta and Google Ads campaigns for businesses in Amman and across the MENA region.',
    'seo': 'Top SEO services in Jordan. HardRock helps businesses in Amman rank higher on Google with data-driven search engine optimization strategies.',
    'pr-social-listening': 'PR and social listening services in Jordan. Monitor your brand reputation and manage public relations with HardRock, Amman\'s leading digital marketing agency.',
    'branding': 'Professional branding services in Jordan. HardRock creates compelling brand identities for businesses in Amman looking to stand out in the market.',
    'software-ai': 'AI solutions and software development in Jordan. HardRock builds custom AI-powered tools and software for businesses in Amman and the MENA region.',
};

export default function Services({ serviceSlug, fromNav = false }: ServicesProps) {
    const { t, i18n } = useTranslation('serviceDetail');
    const { theme } = useTheme();
    const isArabic = i18n.language === 'ar';
    const isLightMode = theme === 'light';

    const serviceData = t(serviceSlug, { returnObjects: true }) as ServiceData;
    const sections = serviceData?.sections || [];

    const handleServiceChange = (slug: string) => {
        router.visit(`/services/${slug}`, { preserveScroll: false });
    };

    const scrollToContact = () => {
        router.visit('/#contact-us');
    };

    return (
        <>
            <Head title={`${serviceData?.hero?.title || 'Services'} | HardRock - Digital Marketing Agency Jordan`}>
                <meta name="description" content={SERVICE_META_DESCRIPTIONS[serviceSlug] || 'Professional digital marketing services in Jordan. HardRock helps businesses in Amman grow with data-driven marketing strategies.'} />
                <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                <meta httpEquiv="Pragma" content="no-cache" />
                <meta httpEquiv="Expires" content="0" />
            </Head>

            <SmoothScroll>
                <div className={`min-h-screen font-sans antialiased selection:bg-primary/20 selection:text-primary ${
                    isLightMode ? 'bg-white text-gray-900' : 'bg-black text-white'
                }`}>
                    <Navbar />

                    <main className="pt-20 relative">
                        {/* Background with purple glow spots - positioned absolutely on page (hidden in light mode) */}
                        {!isLightMode && (
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute top-[100px] ltr:left-[10%] rtl:right-[10%] w-[400px] h-[400px] bg-brand-purple/40 rounded-full blur-[100px]" />
                                <div className="absolute top-[400px] ltr:right-[5%] rtl:left-[5%] w-[350px] h-[350px] bg-brand-purple/35 rounded-full blur-[130px]" />
                                <div className="absolute top-[800px] ltr:left-0 rtl:right-0 w-[500px] h-[500px] bg-brand-red/30 rounded-full blur-[160px]" />
                                <div className="absolute top-[1200px] ltr:right-[15%] rtl:left-[15%] w-[300px] h-[300px] bg-brand-purple/40 rounded-full blur-[100px]" />
                                <div className="absolute top-[1600px] ltr:left-[20%] rtl:right-[20%] w-[450px] h-[450px] bg-brand-purple/35 rounded-full blur-[140px]" />
                                <div className="absolute top-[2000px] ltr:right-0 rtl:left-0 w-[400px] h-[400px] bg-brand-purple/40 rounded-full blur-[120px]" />
                                <div className="absolute top-[2400px] ltr:left-[30%] rtl:right-[30%] w-[350px] h-[350px] bg-brand-red/30 rounded-full blur-[130px]" />
                                <div className="absolute top-[2800px] ltr:right-[10%] rtl:left-[10%] w-[400px] h-[400px] bg-brand-purple/40 rounded-full blur-[150px]" />
                                <div className="absolute top-[3200px] ltr:left-[5%] rtl:right-[5%] w-[450px] h-[450px] bg-brand-purple/35 rounded-full blur-[140px]" />
                                <div className="absolute top-[3600px] ltr:right-[20%] rtl:left-[20%] w-[350px] h-[350px] bg-brand-red/30 rounded-full blur-[120px]" />
                            </div>
                        )}

                        {/* Service Selector */}
                        <ServiceSelector
                            currentSlug={serviceSlug}
                            onServiceChange={handleServiceChange}
                            isArabic={isArabic}
                            isLightMode={isLightMode}
                            showImmediately={fromNav}
                        />

                        {/* Flowchart Section */}
                        <FlowchartSection
                            title={serviceData?.hero?.title}
                            sections={sections}
                            serviceSlug={serviceSlug}
                            isArabic={isArabic}
                            isLightMode={isLightMode}
                        />

                        {/* CTA Section */}
                        <CTASection
                            title={serviceData?.cta?.title}
                            description={serviceData?.cta?.description}
                            buttonText={serviceData?.cta?.buttonText}
                            onButtonClick={scrollToContact}
                            isArabic={isArabic}
                            isLightMode={isLightMode}
                        />
                    </main>

                    <Footer />
                    <WhatsAppButton />
                </div>
            </SmoothScroll>
        </>
    );
}

// Service Selector Component
interface ServiceSelectorProps {
    currentSlug: string;
    onServiceChange: (slug: string) => void;
    isArabic: boolean;
    isLightMode: boolean;
    showImmediately?: boolean;
}

function ServiceSelector({ currentSlug, onServiceChange, isArabic, isLightMode, showImmediately = false }: ServiceSelectorProps) {
    const { t } = useTranslation('serviceDetail');
    const [isVisible, setIsVisible] = useState(showImmediately);
    const hasScrolledDown = useRef(false);
    const lastScrollY = useRef(0);
    const scrollThreshold = 50; // Minimum scroll down before we start tracking scroll up

    useEffect(() => {
        // If showImmediately is true, selector is already visible, no need for scroll logic
        if (showImmediately) {
            setIsVisible(true);
            return;
        }

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Once visible, stay visible permanently (until page refresh)
            if (isVisible) {
                lastScrollY.current = currentScrollY;
                return;
            }

            // Track if user has scrolled down enough
            if (currentScrollY > scrollThreshold) {
                hasScrolledDown.current = true;
            }

            // Show permanently when user scrolls up after having scrolled down
            if (hasScrolledDown.current && currentScrollY < lastScrollY.current) {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isVisible, showImmediately]);

    const services = SERVICE_SLUGS.map((slug) => ({
        slug,
        name: t(`${slug}.name`),
    }));

    return (
        <motion.section
            className="relative z-10 py-4 md:py-6"
            initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
            animate={{
                height: isVisible ? 'auto' : 0,
                opacity: isVisible ? 1 : 0,
                overflow: isVisible ? 'visible' : 'hidden'
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ExpandableServiceSelector
                    services={services}
                    currentSlug={currentSlug}
                    onServiceChange={onServiceChange}
                    isArabic={isArabic}
                    isLightMode={isLightMode}
                />
            </div>
        </motion.section>
    );
}

// Flowchart Section Component
interface FlowchartSectionProps {
    title: string;
    sections: ServiceSection[];
    serviceSlug: string;
    isArabic: boolean;
    isLightMode: boolean;
}

function FlowchartSection({ title, sections, serviceSlug, isArabic, isLightMode }: FlowchartSectionProps) {
    return (
        <section className="relative z-10 pt-12 pb-16 md:py-20">
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Service Title with gradient */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative flex items-center justify-center gap-2 mb-10 md:mb-16 z-10"
                >
                    <h1 className={`text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center ${
                        isArabic ? 'font-tajawal' : 'font-sf-pro'
                    }`}>
                        <span className={isLightMode ? 'text-gray-900' : 'text-white'}>{title?.split(' ').slice(0, -1).join(' ')} </span>
                        <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">
                            {title?.split(' ').slice(-1)}
                        </span>
                    </h1>
                </motion.div>

                {/* Flow Items Container */}
                <div className="relative z-10">
                    {/* Center line - hidden on mobile, fades in on scroll */}
                    <motion.div
                        initial={{ opacity: 0, scaleY: 0 }}
                        whileInView={{ opacity: 1, scaleY: 1 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                        className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-brand-red origin-top"
                    />

                    {sections.map((section, index) => (
                        <FlowItem
                            key={index}
                            section={section}
                            serviceSlug={serviceSlug}
                            isArabic={isArabic}
                            isEven={index % 2 === 0}
                            isLightMode={isLightMode}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

// Flow Item Component
interface FlowItemProps {
    section: ServiceSection;
    serviceSlug: string;
    isArabic: boolean;
    isEven: boolean;
    isLightMode: boolean;
}

// Map of subtitles that have light mode images available
const LIGHT_MODE_IMAGES: Record<string, string[]> = {
    'social-media': [
        'Content Strategy & Editorial Calendar',
        'Performance Insights & Reporting',
    ],
    'seo': [
        'SEO Strategy & Market Analysis',
        'On-Page & Content Optimization',
        'Continuous Monitoring, Optimization & Reporting',
    ],
    'pr-social-listening': [
        'PR Strategy & Brand Positioning',
        'Influencer & KOL PR',
    ],
};

// Map subtitles to image filenames (only for cases where they differ)
const IMAGE_FILENAME_MAP: Record<string, Record<string, string>> = {
    'branding': {
        'Logo & Visual Identity Design': 'logo design',
        'Tagline / Slogan Development': 'Tagline  Slogan Development',
    },
    'seo': {
        'Local SEO (If Applicable)': 'local seo',
    },
    'social-media': {
        'Strategic Planning & Market Intelligence': 'strategic planning',
    },
};

// Helper function to get image filename from subtitle
function getImageFilename(serviceSlug: string, subtitle: string): string {
    return IMAGE_FILENAME_MAP[serviceSlug]?.[subtitle] || subtitle;
}

function FlowItem({ section, serviceSlug, isArabic, isEven, isLightMode }: FlowItemProps) {
    const imageFilename = getImageFilename(serviceSlug, section.subtitle);
    const darkImagePath = `/images/services/${serviceSlug}/${imageFilename}.webp`;

    // Check if this subtitle has a light mode image
    const hasLightModeImage = LIGHT_MODE_IMAGES[serviceSlug]?.includes(section.subtitle) ?? false;
    const lightImagePath = `/images/services/${serviceSlug}/${imageFilename}-light mode.webp`;

    const imagePath = isLightMode && hasLightModeImage ? lightImagePath : darkImagePath;

    const imageContent = (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`flex ${isEven ? 'justify-end' : 'justify-start'}`}
        >
            <img
                src={imagePath}
                alt={section.subtitle}
                title={section.subtitle}
                className="w-full max-w-[250px] md:max-w-[450px] h-auto]"
                loading="lazy"
            />
        </motion.div>
    );

    const textContent = (
        <motion.div
            initial={{ opacity: 0, x: isEven ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`flex flex-col justify-center text-center items-center ${
                isArabic ? 'md:text-right md:items-end' : 'md:text-left md:items-start'
            }`}
        >
            <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-4 w-full ${
                isLightMode ? 'text-gray-900' : 'text-white'
            } ${isArabic ? 'font-tajawal md:text-right' : 'font-sf-pro md:text-left'}`}>
                {section.subtitle}
            </h3>

            <p className={`leading-relaxed max-w-lg ${
                isLightMode ? 'text-gray-600' : 'text-gray-400'
            } ${isArabic ? 'font-tajawal text-lg md:text-xl md:text-right' : 'font-poppins text-base md:text-lg lg:text-xl md:text-left'}`}>
                {section.description}
            </p>
        </motion.div>
    );

    return (
        <div className="relative mb-24 md:mb-24">
            {/* Mobile: Stack layout */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-3 md:hidden"
            >
                {imageContent}
                {textContent}
            </motion.div>

            {/* Desktop: Two-column grid with centered gap */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="hidden md:grid md:grid-cols-2 md:gap-10 lg:gap-16 items-center"
            >
                {isEven ? (
                    <>
                        {imageContent}
                        {textContent}
                    </>
                ) : (
                    <>
                        {textContent}
                        {imageContent}
                    </>
                )}
            </motion.div>

            {/* Circle on the center line - hidden on mobile */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className={`hidden md:block absolute top-1/2 -translate-y-1/2 z-10 w-3 h-3 rounded-full shadow-lg ${
                    isLightMode ? 'bg-brand-red shadow-brand-red/40' : 'bg-white shadow-white/40'
                }`}
                style={{ left: 'calc(50% - 6px)' }}
            />
        </div>
    );
}

// CTA Section Component
interface CTASectionProps {
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
    isArabic: boolean;
    isLightMode: boolean;
}

function CTASection({ title, description, buttonText, onButtonClick, isArabic, isLightMode }: CTASectionProps) {
    return (
        <section className="relative z-10 py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={`backdrop-blur-sm rounded-3xl p-8 md:p-12 lg:p-16 ${
                        isLightMode
                            ? 'bg-gradient-to-r from-brand-purple/10 to-brand-red/10 border border-gray-200'
                            : 'bg-gradient-to-r from-brand-purple/20 to-brand-red/20 border border-white/10'
                    }`}
                >
                    <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${
                        isLightMode ? 'text-gray-900' : 'text-white'
                    } ${isArabic ? 'font-tajawal' : 'font-sf-pro'}`}>
                        {title}
                    </h2>

                    <p className={`mb-8 max-w-2xl mx-auto ${
                        isLightMode ? 'text-gray-600' : 'text-gray-400'
                    } ${isArabic ? 'font-tajawal text-lg' : 'font-poppins text-base md:text-lg'}`}>
                        {description}
                    </p>

                    <button
                        onClick={onButtonClick}
                        className={`bg-gradient-to-r from-brand-purple to-brand-red text-white px-8 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:shadow-xl hover:shadow-brand-red/30 transition-all duration-300 hover:scale-105 ${
                            isArabic ? 'font-cairo' : 'font-sf-pro'
                        }`}
                    >
                        {buttonText}
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
