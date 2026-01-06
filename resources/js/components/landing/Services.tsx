import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function Services() {
    const { t, i18n } = useTranslation('services');
    const isArabic = i18n.language === 'ar';

    const services = t('items', { returnObjects: true }) as Array<{
        id: string;
        name: string;
        description: string;
        image?: string;
        imageLight?: string;
        imageDark?: string;
        link: string;
    }>;

    const [selectedService, setSelectedService] = useState(services[0]);
    const serviceContentRef = useRef<HTMLDivElement>(null);

    // Handle service selection with scroll on mobile screens only
    const handleServiceClick = (service: typeof services[0]) => {
        setSelectedService(service);

        // Scroll to content on mobile screens only (< 768px)
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setTimeout(() => {
                if (serviceContentRef.current) {
                    serviceContentRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 200);
        }
    };

    // Reset selected service when language changes
    useEffect(() => {
        setSelectedService(services[0]);
    }, [i18n.language]);

    // Mobile order mapping for services (grid only, reverts to natural order on lg+ screens)
    const getMobileOrder = (serviceId: string): number | undefined => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            return undefined; // No custom order on large screens
        }
        const mobileOrderMap: { [key: string]: number } = {
            'paid-ads': 1,
            'social-media': 2,
            'software-ai': 3,
            'seo': 4,
            'pr-social-listening': 5,
            'branding': 6,
        };
        return mobileOrderMap[serviceId];
    };

    const getImageMargin = () => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            if (width >= 1280) {
                // xl screens and above
                return { left: '100px', right: '100px' };
            } else if (width >= 1024) {
                // lg screens
                return { left: '50px', right: '50px' };
            } else if (width >= 768) {
                // md screens
                return { left: '20px', right: '20px' };
            }
        }
        // Default for smaller screens
        return { left: '0px', right: '0px' };
    };

    const [imageMargin, setImageMargin] = useState(getImageMargin());

    // Update margin on window resize
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => setImageMargin(getImageMargin());
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Determine which image to use
    const getServiceImage = (service: typeof selectedService) => {
        if (service.imageLight && service.imageDark) {
            return {
                light: service.imageLight,
                dark: service.imageDark,
            };
        }
        return {
            light: service.image,
            dark: service.image,
        };
    };

    const currentImage = getServiceImage(selectedService);

    return (
        <section id="services" className="relative py-10 md:py-32 overflow-hidden bg-white dark:bg-black">
            {/* Background Blurs */}
            <div className="absolute top-20 ltr:left-20 rtl:right-20 w-40 h-40 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-40 ltr:right-20 rtl:left-20 w-48 h-48 bg-pink-500/20 dark:bg-pink-500/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 ltr:left-1/3 rtl:right-1/3 w-32 h-32 bg-red-500/15 dark:bg-red-500/25 rounded-full blur-3xl" />

            <div className="relative z-10 w-full  px-6 sm:px-12 lg:px-16 xl:px-20">
                <div className="flex flex-col lg:grid lg:grid-cols-2 items-start gap-4 lg:gap-8" dir="ltr">
                    {/* Title - Shows first on mobile, hidden on desktop (shown in Service Content section) */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className={`lg:hidden w-full mb-8 ${isArabic ? 'text-right' : 'text-left'}`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                    >
                        <h1 className={`text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-black ${
                            isArabic ? 'font-tajawal' : 'font-sf-pro'
                        }`} style={isArabic ? {
                            lineHeight: '2',
                            overflow: 'visible',
                            display: 'block'
                        } : { lineHeight: '1.2' }}>
                            {isArabic ? (
                                <>
                                    <span className="text-black dark:text-white">مـــــــــاذا </span>
                                    <span className="text-brand-purple md:bg-gradient-to-r md:from-brand-purple md:to-brand-red md:bg-clip-text md:text-transparent">نقـــــــــــــــدم</span>
                                    <span className="text-black dark:text-white">؟</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-black dark:text-white">We Help You </span>
                                    <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">With</span>
                                </>
                            )}
                        </h1>
                    </motion.div>

                    {/* Services List */}
                    <motion.div
                        initial={{ opacity: 0, x: isArabic ? 30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className={`w-full flex justify-center lg:justify-start mb-12 lg:mb-0 ${isArabic ? 'lg:order-2' : 'lg:order-1'}`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                    >
                        <div className="grid grid-cols-2 gap-4 md:gap-4 pl-0 2xl:pl-20 lg:flex lg:flex-col lg:space-y-6 lg:flex-1 max-w-2xl lg:max-w-none">
                            {services.map((service) => {
                                const isSelected = selectedService.id === service.id;

                                return (
                                    <button
                                            key={service.id}
                                            onClick={() => handleServiceClick(service)}
                                            style={{ order: getMobileOrder(service.id) }}
                                            className={`py-2 flex items-center justify-start ${
                                                getMobileOrder(service.id) && getMobileOrder(service.id)! % 2 === 0
                                                    ? 'pl-4 lg:pl-0'
                                                    : ''
                                            }`}
                                        >
                                            <span className={`px-2 md:px-6 py-2 md:py-0 rounded-full ${
                                                isSelected
                                                    ? 'bg-gradient-to-r from-brand-purple to-brand-red shadow-lg shadow-brand-purple/30'
                                                    : 'bg-transparent'
                                            } ${
                                                isArabic
                                                    ? isSelected
                                                        ? 'font-tajawal font-light text-white'
                                                        : 'font-tajawal font-extralight text-black dark:text-white'
                                                    : isSelected
                                                        ? 'font-poppins font-light text-white whitespace-nowrap'
                                                        : 'font-poppins font-extralight text-black dark:text-white whitespace-nowrap'
                                            } text-base md:text-lg lg:text-xl xl:text-2xl leading-tight`}>
                                                {service.name}
                                            </span>
                                        </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Service Content */}
                    <div ref={serviceContentRef} className={`w-full flex justify-center lg:justify-start ${isArabic ? 'lg:order-1' : 'lg:order-2'}`}>
                        <motion.div
                            initial={{ opacity: 0, x: isArabic ? -30 : -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className={`w-full max-w-2xl lg:max-w-none ${isArabic ? 'text-center lg:text-right' : 'text-center lg:text-left'}`}
                            dir={isArabic ? 'rtl' : 'ltr'}
                        >
                            <div className="block group pointer-events-none">
                            {/* Title - Hidden on mobile, shown on desktop */}
                            <h1 className={`hidden lg:block text-4xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-black mb-0 lg:mt-0 ${
                                isArabic ? 'font-tajawal' : 'font-sf-pro'
                            }`} style={isArabic ? {
                                overflow: 'visible'
                            } : { lineHeight: '1.2' }}>
                                {isArabic ? (
                                    <>
                                        <span className="text-black dark:text-white">مـــــــــاذا </span>
                                        <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">نقـــــــــــــــدم</span>
                                        <span className="text-black dark:text-white">؟</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-black dark:text-white">We Help You </span>
                                        <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">With</span>
                                    </>
                                )}
                            </h1>

                            {/* Service Image */}
                            <div
                                className="relative w-full max-w-sm mb-8 flex items-center justify-center mx-auto lg:mx-0"
                                style={{
                                    height: '280px',
                                    marginLeft: window.innerWidth >= 1024 ? imageMargin.left : 'auto',
                                    marginRight: window.innerWidth >= 1024 ? imageMargin.right : 'auto'
                                }}
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-red/20 rounded-full blur-2xl" />

                                {/* Light mode image */}
                                <img
                                    src={currentImage.light}
                                    alt={selectedService.name}
                                    loading="lazy"
                                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl dark:hidden"
                                />

                                {/* Dark mode image */}
                                <img
                                    src={currentImage.dark}
                                    alt={selectedService.name}
                                    loading="lazy"
                                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl hidden dark:block"
                                />
                            </div>

                            {/* Service Description */}
                            <div style={{ minHeight: '180px' }} className="max-w-2xl mx-auto lg:mx-0">
                                <p
                                    className={`text-gray-700 dark:text-gray-300 mb-6 ${
                                        isArabic
                                            ? 'text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl font-tajawal font-normal'
                                            : 'text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-poppins font-normal'
                                    }`}
                                    style={{ lineHeight: '1.8' }}
                                >
                                    {selectedService.description}
                                </p>
                            </div>
                        </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
