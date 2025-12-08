import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Hero() {
    const { t } = useTranslation('hero');

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-black">
            {/* Purple Glow Background - Dark Mode */}
            <div className="absolute inset-0 overflow-hidden dark:block hidden">
                <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-purple-900/40 via-purple-600/20 to-transparent blur-3xl" />
                <div className="absolute top-1/3 ltr:left-0 rtl:right-0 w-1/2 h-1/2 bg-gradient-to-r from-purple-600/30 to-transparent blur-[100px]" />
            </div>

            {/* Light Mode Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 dark:hidden" />

            {/* Background Wave */}
            <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-[60%] h-auto opacity-30 dark:opacity-40">
                <img
                    src="/images/bg wave.png"
                    alt=""
                    className="w-full h-auto object-contain"
                />
            </div>

            <div className="relative z-10 w-full px-8 sm:px-12 lg:px-20 xl:px-32 pt-32 pb-20">
                <div className="grid lg:grid-cols-2 gap-0 items-center">
                    {/* Left Column - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-left rtl:text-right"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4 leading-tight"
                        >
                            {t('title.line1')} {t('title.line2')}
                        </motion.h2>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                        >
                            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                                {t('title.gradient')}
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg mx-auto ltr:text-center rtl:text-center"
                        >
                            {t('subtitle')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <button className="group bg-white dark:bg-white text-black border-2 border-gray-300 dark:border-transparent px-10 py-4 rounded-full text-base font-medium hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 tracking-wide">
                                {t('cta')}
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
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-purple-600/30 blur-[80px] rounded-full" />

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
