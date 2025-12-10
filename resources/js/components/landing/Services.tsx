import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';

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

    // Reset selected service when language changes
    useEffect(() => {
        setSelectedService(services[0]);
    }, [i18n.language]);

    // Get responsive margin based on screen width
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
        <section id="services" className="relative py-20 md:py-32 overflow-hidden bg-white dark:bg-black">
            {/* Background Blurs */}
            <div className="absolute top-20 ltr:left-20 rtl:right-20 w-40 h-40 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-40 ltr:right-20 rtl:left-20 w-48 h-48 bg-pink-500/20 dark:bg-pink-500/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 ltr:left-1/3 rtl:right-1/3 w-32 h-32 bg-red-500/15 dark:bg-red-500/25 rounded-full blur-3xl" />

            <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 xl:px-20">
                <div className="grid lg:grid-cols-2  items-start" dir="ltr">
                    {/* Services List - Left for English, Right for Arabic */}
                    <motion.div
                        initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className={`space-y-6 flex flex-col ${isArabic ? 'lg:order-2 items-start lg:pr-36' : 'lg:order-1 items-start lg:ml-20'}`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                    >
                        {services.map((service) => {
                            const isSelected = selectedService.id === service.id;

                            return (
                                <button
                                        key={service.id}
                                        onClick={() => setSelectedService(service)}
                                        className={`px-8 py-6 rounded-full transition-all duration-300 ${
                                            isSelected
                                                ? 'bg-gradient-to-r from-brand-purple to-brand-red shadow-lg shadow-brand-purple/30'
                                                : 'bg-transparent hover:bg-gray-100 dark:hover:bg-white/5'
                                        } ${
                                            isArabic
                                                ? isSelected
                                                    ? 'font-tajawal font-light text-white text-right'
                                                    : 'font-tajawal font-extralight text-black dark:text-white text-right'
                                                : isSelected
                                                    ? 'font-poppins font-light text-white text-left'
                                                    : 'font-poppins font-extralight text-black dark:text-white text-left'
                                        } text-lg md:text-xl lg:text-2xl xl:text-3xl`}
                                    >
                                        {service.name}
                                    </button>
                            );
                        })}
                    </motion.div>

                    {/* Service Content - Right for English, Left for Arabic */}
                    <motion.div
                        initial={{ opacity: 0, x: isArabic ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className={`${isArabic ? 'lg:order-1 text-right' : 'lg:order-2 text-left'}`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                    >
                        <Link href={selectedService.link} className="block cursor-pointer group">
                            {/* Title */}
                            <h1 className={`text-4xl md:text-5xl lg:text-5xl xl:text-7xl font-black mb-10 md:mb-12 ${
                                isArabic ? 'font-tajawal' : 'font-sf-pro'
                            }`}>
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
                                        <span className="text-black dark:text-white">.</span>
                                    </>
                                )}
                            </h1>

                            {/* Service Image with Animation */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedService.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative w-full max-w-sm mb-8 flex items-center justify-center"
                                    style={{
                                        height: '280px',
                                        marginLeft: imageMargin.left,
                                        marginRight: imageMargin.right
                                    }}
                                >
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-red/20 rounded-full blur-2xl" />

                                    {/* Light mode image */}
                                    <img
                                        src={currentImage.light}
                                        alt={selectedService.name}
                                        className="relative z-10 w-full h-full object-contain drop-shadow-2xl dark:hidden transition-transform duration-300 group-hover:scale-105"
                                    />

                                    {/* Dark mode image */}
                                    <img
                                        src={currentImage.dark}
                                        alt={selectedService.name}
                                        className="relative z-10 w-full h-full object-contain drop-shadow-2xl hidden dark:block transition-transform duration-300 group-hover:scale-105"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Service Description with Animation */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedService.id + '-text'}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ minHeight: '180px' }}
                                    className="max-w-2xl"
                                >
                                    <p
                                        className={`text-gray-700 dark:text-gray-300 mb-6 ${
                                            isArabic
                                                ? 'text-lg md:text-xl lg:text-2xl xl:text-3xl font-tajawal font-normal'
                                                : 'text-base md:text-lg lg:text-xl xl:text-2xl font-poppins font-normal'
                                        }`}
                                        style={{ lineHeight: '1.8' }}
                                    >
                                        {selectedService.description}
                                    </p>

                                    <span
                                        className={`inline-block text-brand-purple group-hover:text-brand-red transition-colors duration-300 ${
                                            isArabic
                                                ? 'text-lg md:text-xl font-tajawal font-medium'
                                                : 'text-base md:text-lg font-poppins font-medium'
                                        }`}
                                    >
                                        {t('learnMore')} {isArabic ? '←' : '→'}
                                    </span>
                                </motion.div>
                            </AnimatePresence>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
