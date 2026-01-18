import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import SmoothScroll from '@/components/SmoothScroll';

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
}

const SERVICE_SLUGS = [
    'social-media',
    'paid-ads',
    'seo',
    'pr-social-listening',
    'branding',
    'software-ai',
] as const;

export default function Services({ serviceSlug }: ServicesProps) {
    const { t, i18n } = useTranslation('serviceDetail');
    const isArabic = i18n.language === 'ar';

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
            <Head title={serviceData?.hero?.title || 'Services'}>
                <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                <meta httpEquiv="Pragma" content="no-cache" />
                <meta httpEquiv="Expires" content="0" />
            </Head>

            <SmoothScroll>
                <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-primary/20 selection:text-primary">
                    <Navbar />

                    <main className="pt-20 relative">
                        {/* Background with purple glow spots - positioned absolutely on page */}
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

                        {/* Service Selector */}
                        <ServiceSelector
                            currentSlug={serviceSlug}
                            onServiceChange={handleServiceChange}
                            isArabic={isArabic}
                        />

                        {/* Flowchart Section */}
                        <FlowchartSection
                            title={serviceData?.hero?.title}
                            sections={sections}
                            serviceSlug={serviceSlug}
                            isArabic={isArabic}
                        />

                        {/* CTA Section */}
                        <CTASection
                            title={serviceData?.cta?.title}
                            description={serviceData?.cta?.description}
                            buttonText={serviceData?.cta?.buttonText}
                            onButtonClick={scrollToContact}
                            isArabic={isArabic}
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
}

function ServiceSelector({ currentSlug, onServiceChange, isArabic }: ServiceSelectorProps) {
    const { t } = useTranslation('serviceDetail');

    return (
        <section className="relative z-10 py-6 md:py-8 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                    {SERVICE_SLUGS.map((slug) => {
                        const serviceName = t(`${slug}.name`);
                        const isActive = slug === currentSlug;

                        return (
                            <button
                                key={slug}
                                onClick={() => onServiceChange(slug)}
                                className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm md:text-base transition-all duration-300 ${
                                    isArabic ? 'font-tajawal' : 'font-poppins'
                                } ${
                                    isActive
                                        ? 'bg-gradient-to-r from-brand-purple to-brand-red text-white shadow-lg shadow-brand-purple/25'
                                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                                }`}
                            >
                                {serviceName}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// Flowchart Section Component
interface FlowchartSectionProps {
    title: string;
    sections: ServiceSection[];
    serviceSlug: string;
    isArabic: boolean;
}

function FlowchartSection({ title, sections, serviceSlug, isArabic }: FlowchartSectionProps) {
    return (
        <section className="relative z-10 py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Service Title with gradient and starting circle */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative flex items-center justify-center gap-4 mb-8"
                >
                    <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center ${
                        isArabic ? 'font-tajawal' : 'font-sf-pro'
                    }`}>
                        <span className="text-white">{title?.split(' ').slice(0, -1).join(' ')} </span>
                        <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">
                            {title?.split(' ').slice(-1)}
                        </span>
                    </h1>
                    {/* Starting white dot */}
                    <div className="w-6 h-6 rounded-full bg-white shadow-lg shadow-white/30" />
                </motion.div>

                {/* Gradient line from title to first image */}
                <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative flex justify-center mb-8"
                    style={{ transformOrigin: 'top' }}
                >
                    <svg
                        width="200"
                        height="120"
                        viewBox="0 0 200 120"
                        fill="none"
                        className={`${isArabic ? 'scale-x-[-1]' : ''}`}
                    >
                        <defs>
                            <linearGradient id="title-line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#704399" />
                                <stop offset="100%" stopColor="#C93727" />
                            </linearGradient>
                        </defs>
                        {/* Curved line from center going down and to the left */}
                        <path
                            d="M 100 0 Q 100 60 20 120"
                            stroke="url(#title-line-gradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                        />
                    </svg>
                </motion.div>

                {/* Flow Items */}
                <div className="relative">
                    {sections.map((section, index) => (
                        <FlowItem
                            key={index}
                            section={section}
                            index={index}
                            totalItems={sections.length}
                            serviceSlug={serviceSlug}
                            isArabic={isArabic}
                            isEven={index % 2 === 0}
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
    index: number;
    totalItems: number;
    serviceSlug: string;
    isArabic: boolean;
    isEven: boolean;
}

function FlowItem({ section, index, totalItems, serviceSlug, isArabic, isEven }: FlowItemProps) {
    const imageNumber = index + 1;
    const imagePath = `/images/services/${serviceSlug}/${imageNumber}.webp`;
    const isLast = index === totalItems - 1;

    return (
        <div className="relative">
            {/* Curved Arrow Path - SVG */}
            {!isLast && (
                <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={`absolute w-full h-32 md:h-40 bottom-0 translate-y-1/2 ${
                        isEven ? '' : 'scale-x-[-1]'
                    }`}
                    viewBox="0 0 400 100"
                    preserveAspectRatio="none"
                    fill="none"
                >
                    <defs>
                        <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#704399" />
                            <stop offset="100%" stopColor="#C93727" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        d={isEven
                            ? "M 50 10 Q 200 10 200 50 Q 200 90 350 90"
                            : "M 350 10 Q 200 10 200 50 Q 200 90 50 90"
                        }
                        stroke={`url(#gradient-${index})`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                    />
                    {/* Arrow head */}
                    <motion.circle
                        cx={isEven ? "350" : "50"}
                        cy="90"
                        r="6"
                        fill={`url(#gradient-${index})`}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 1.5 }}
                    />
                </motion.svg>
            )}

            {/* Content Row */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-24 md:mb-32 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
            >
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex-shrink-0 w-full md:w-[280px] lg:w-[320px]"
                >
                    <div className="relative">
                        <img
                            src={imagePath}
                            alt={section.subtitle}
                            className="w-full h-auto"
                            loading="lazy"
                        />
                        {/* Connection dot */}
                        <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-brand-purple to-brand-red shadow-lg shadow-brand-purple/50 ${
                            isEven ? '-right-2' : '-left-2'
                        }`} />
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`flex-1 ${isEven ? 'md:text-left' : 'md:text-right'} text-center`}
                >
                    <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 ${
                        isArabic ? 'font-tajawal' : 'font-sf-pro'
                    }`}>
                        {section.subtitle}
                    </h3>

                    <p className={`text-gray-400 leading-relaxed max-w-lg ${
                        isEven ? 'md:mr-auto' : 'md:ml-auto'
                    } mx-auto md:mx-0 ${
                        isArabic ? 'font-tajawal text-base md:text-lg' : 'font-poppins text-sm md:text-base'
                    }`}>
                        {section.description}
                    </p>
                </motion.div>
            </motion.div>
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
}

function CTASection({ title, description, buttonText, onButtonClick, isArabic }: CTASectionProps) {
    return (
        <section className="relative z-10 py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-brand-purple/20 to-brand-red/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16"
                >
                    <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 ${
                        isArabic ? 'font-tajawal' : 'font-sf-pro'
                    }`}>
                        {title}
                    </h2>

                    <p className={`text-gray-400 mb-8 max-w-2xl mx-auto ${
                        isArabic ? 'font-tajawal text-lg' : 'font-poppins text-base md:text-lg'
                    }`}>
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
