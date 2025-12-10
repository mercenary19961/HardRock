import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
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
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Services List - Left for English, Right for Arabic */}
                    <motion.div
                        initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className={`space-y-4 ${isArabic ? 'lg:order-2' : 'lg:order-1'}`}
                    >
                        {services.map((service) => {
                            const isSelected = selectedService.id === service.id;

                            return (
                                <button
                                    key={service.id}
                                    onClick={() => setSelectedService(service)}
                                    className={`w-full text-left rtl:text-right px-6 py-4 rounded-2xl transition-all duration-300 ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-brand-purple to-brand-red shadow-lg shadow-brand-purple/30'
                                            : 'bg-transparent border-2 border-gray-300 dark:border-white/20 hover:border-brand-purple dark:hover:border-brand-purple'
                                    } ${
                                        isArabic
                                            ? isSelected
                                                ? 'font-tajawal font-light text-white'
                                                : 'font-tajawal font-extralight text-black dark:text-white'
                                            : isSelected
                                                ? 'font-poppins font-light text-white'
                                                : 'font-poppins font-extralight text-black dark:text-white'
                                    } text-lg md:text-xl lg:text-2xl`}
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
                    >
                        {/* Title */}
                        <h1 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-8 md:mb-12 ${
                            isArabic ? 'font-tajawal' : 'font-sf-pro'
                        }`}>
                            <span className="text-black dark:text-white">
                                {t('title').split('.')[0].split('؟')[0]}
                            </span>
                            <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">
                                {t('title').includes('.') ? '.' : '؟'}
                            </span>
                        </h1>

                        {/* Service Image with Animation */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedService.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                className="relative w-full max-w-md mx-auto lg:mx-0 rtl:lg:ml-auto mb-8"
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-red/20 rounded-full blur-2xl" />

                                {/* Light mode image */}
                                <img
                                    src={currentImage.light}
                                    alt={selectedService.name}
                                    className="relative z-10 w-full h-auto drop-shadow-2xl dark:hidden"
                                />

                                {/* Dark mode image */}
                                <img
                                    src={currentImage.dark}
                                    alt={selectedService.name}
                                    className="relative z-10 w-full h-auto drop-shadow-2xl hidden dark:block"
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
                            >
                                <p className={`text-gray-700 dark:text-gray-300 mb-6 leading-relaxed ${
                                    isArabic
                                        ? 'text-lg md:text-xl lg:text-2xl font-tajawal font-normal'
                                        : 'text-base md:text-lg lg:text-xl font-poppins font-normal'
                                }`}>
                                    {selectedService.description}
                                </p>

                                <Link
                                    href={selectedService.link}
                                    className={`inline-block text-brand-red hover:text-brand-purple transition-colors duration-300 ${
                                        isArabic
                                            ? 'text-lg md:text-xl font-tajawal font-medium'
                                            : 'text-base md:text-lg font-poppins font-medium'
                                    }`}
                                >
                                    {t('learnMore')} →
                                </Link>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
