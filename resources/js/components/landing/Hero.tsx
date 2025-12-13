import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Hero() {
    const { t, i18n } = useTranslation('hero');
    const isArabic = i18n.language === 'ar';

    // Scroll to contact section
    const scrollToContact = () => {
        const contactSection = document.getElementById('contact-us');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-black">
            {/* Purple Glow Background - Dark Mode */}
            <div className="absolute inset-0 overflow-hidden dark:block hidden">
                {/* <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-purple-900/40 via-purple-600/20 to-transparent blur-3xl" /> */}
                <div className="absolute top-1/3 ltr:left-0 rtl:right-0 w-1/2 h-1/2 bg-gradient-to-r from-purple-600/30 to-transparent blur-[100px]" />
            </div>

            {/* Light Mode Background */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 dark:hidden" /> */}

            {/* Background Wave */}
            <div className="absolute ltr:bottom-12 ltr:left-0 rtl:bottom-0 rtl:right-0 ltr:origin-bottom-left rtl:origin-bottom-right w-[80%] lg:w-[60%] opacity-15 dark:opacity-40">
                <img
                    src="/images/bg wave.png"
                    alt=""
                    className="w-full h-auto object-contain ltr:-rotate-45 rtl:rotate-45 ltr:translate-x-[-50%] ltr:translate-y-[20%] rtl:translate-x-[20%] rtl:translate-y-[20%]"
                />
            </div>

            <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 xl:px-20 pt-24 pb-20">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Left Column - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        {isArabic ? (
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-2xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black dark:text-white text-center mb-6 font-tajawal"
                                style={{ lineHeight: '1.5' }}
                            >
                                {t('title.line1')}<br />
                                <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">
                                    {t('title.line2')}
                                </span><br />
                                {t('title.gradient')}
                            </motion.h1>
                        ) : (
                            <>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-4xl font-bold text-black dark:text-white text-center mb-2 font-sf-pro"
                                    style={{ lineHeight: '1.5' }}
                                >
                                    {t('title.line1')}<br />
                                    {t('title.line2')}
                                </motion.h2>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="text-4xl xs:text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-center mb-4 font-sf-pro"
                                    style={{ lineHeight: '1.5' }}
                                >
                                    <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">
                                        {t('title.gradient')}
                                    </span>
                                </motion.h1>
                            </>
                        )}

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className={`text-gray-700 dark:text-gray-300 mx-auto text-center leading-relaxed ${
                                isArabic
                                    ? 'text-base md:text-lg lg:text-xl xl:text-2xl mb-12 max-w-md font-tajawal font-extralight'
                                    : 'text-sm md:text-lg lg:text-1xl xl:text-2xl mb-10 max-w-xl font-sf-pro font-thin'
                            }`}
                        >
                            {t('subtitle')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <button onClick={scrollToContact} className={`group relative bg-white dark:bg-white border-2 border-brand-purple dark:border-brand-purple px-10 py-4 sm:px-16 md:px-24 rounded-full text-xl md:text-2xl font-light hover:shadow-2xl hover:shadow-brand-red/20 transition-all duration-300 hover:scale-105 tracking-wide hover:border-transparent dark:hover:border-transparent overflow-hidden ${
                                isArabic ? 'font-cairo' : 'font-sf-pro'
                            }`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-red opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                                <span className="relative z-10 bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent group-hover:text-white transition-all duration-300">
                                    {t('cta')}
                                </span>
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="relative flex justify-center items-center"
                    >
                        <div className="relative w-full max-w-lg">
                            {/* Glow effect behind image */}
                            <div className="absolute inset-12 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-purple-600/30 blur-[85px] rounded-full" />

                            {/* Hero Icon */}
                            <img
                                src="/images/hero-icon.webp"
                                alt="Digital Solutions"
                                className="relative z-10 w-full h-auto drop-shadow-2xl animate-float"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
