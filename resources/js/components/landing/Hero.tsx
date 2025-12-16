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
            <div className="hidden lg:block absolute ltr:bottom-12 ltr:left-0 rtl:bottom-12 rtl:right-0 ltr:origin-bottom-left rtl:origin-bottom-right lg:w-[40%] opacity-30 dark:opacity-60">
                <img
                    src="/images/bg wave.webp"
                    alt=""
                    className="w-full h-auto object-contain ltr:-rotate-45 rtl:-rotate-[155deg] ltr:translate-x-[-50%] ltr:translate-y-[20%] rtl:translate-x-[50%] rtl:translate-y-[20%]"
                />
            </div>

            <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 xl:px-20 pt-36 pb-0 md:pt-24 md:pb-20">
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
                                className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-black dark:text-white text-center mb-6 font-tajawal"
                                style={{ lineHeight: '1.6', paddingTop: '8px' }}
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
                                    className="text-xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-black dark:text-white text-center mb-2 font-sf-pro"
                                    style={{ lineHeight: '1.5' }}
                                >
                                    {t('title.line1')}<br />
                                    {t('title.line2')}
                                </motion.h2>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="text-4xl xs:text-5xl sm:text-6xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-center mb-4 font-sf-pro"
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
                                    ? 'text-base md:text-lg lg:text-xl xl:text-2xl mb-12 max-w-[250px] md:max-w-xs font-tajawal font-light'
                                    : 'text-sm sm:text-md md:text-lg lg:text-1xl xl:text-2xl mb-10 max-w-[250px] sm:max-w-2xl md:max-w-xl font-sf-pro font-light'
                            }`}
                        >
                            {t('subtitle')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <button onClick={scrollToContact} className={`group relative bg-gradient-to-r from-brand-purple to-brand-red rounded-full text-md xs:text-lg sm:text-lg md:text-xl lg:text-2xl font-medium hover:shadow-2xl hover:shadow-brand-red/20 transition-all duration-300 hover:scale-105 tracking-wide overflow-hidden ${
                                isArabic ? 'font-cairo py-2 md:py-4 px-4 sm:px-8 md:px-12 lg:px-12 xl:px-24' : 'font-sf-pro py-2 md:py-4 px-4 xs:px-16 sm:px-16 md:px-24'
                            }`}>
                                <span className="relative z-10 text-white transition-all duration-300">
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
                        className="relative flex flex-col justify-center items-center"
                    >
                        <div className="relative w-full max-w-lg">
                            {/* Glow effect behind image - reduced on mobile */}
                            <div className="absolute inset-12 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-purple-600/10 blur-[40px] md:from-pink-500/30 md:via-purple-500/30 md:to-purple-600/30 md:blur-[85px] rounded-full" />

                            {/* Hero Icon */}
                            <img
                                src="/images/hero-icon.webp"
                                alt="Digital Solutions"
                                className="relative z-10 w-full h-auto drop-shadow-2xl animate-float"
                            />
                        </div>

                        {/* "Reach The Peak" text - Mobile only */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className={`lg:hidden text-center mt-4 text-4xl xs:text-5xl sm:text-6xl font-bold ${
                                isArabic ? 'font-tajawal' : 'font-sf-pro'
                            }`}
                            style={isArabic ? {
                                lineHeight: '2',
                                overflow: 'visible'
                            } : { lineHeight: '1.5' }}
                        >
                            {isArabic ? (
                                <>
                                    <span className="text-black dark:text-white">نصل بـــــــك إلى</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">القمـــــــــــــــــــــــــــــــة</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-black dark:text-white">Reach The </span>
                                    <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">Peak</span>
                                </>
                            )}
                        </motion.h2>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
