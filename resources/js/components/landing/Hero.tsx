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
                <div className="absolute top-1/3 ltr:left-0 rtl:right-0 w-1/2 h-1/2 bg-gradient-to-r from-purple-600/30 to-transparent blur-[100px]" />
            </div>

            {/* Background Wave */}
            <div className="hidden lg:block absolute ltr:bottom-12 ltr:left-0 rtl:bottom-12 rtl:right-0 ltr:origin-bottom-left rtl:origin-bottom-right lg:w-[40%] opacity-30 dark:opacity-60">
                <img
                    src="/images/bg wave.webp"
                    alt="Background wave decoration"
                    title="Background wave decoration"
                    className="w-full h-auto object-contain ltr:-rotate-45 rtl:-rotate-[155deg] ltr:translate-x-[-50%] ltr:translate-y-[20%] rtl:translate-x-[50%] rtl:translate-y-[20%]"
                    fetchPriority="high"
                />
            </div>

            <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 xl:px-20 pt-36 pb-0 md:pt-24 md:pb-20">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Left Column - Text Content */}
                    <div
                        className="text-center animate-on-load fade-in-left"
                        style={{ animationDuration: '0.8s' }}
                    >
                        {isArabic ? (
                            <h1
                                className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-black dark:text-white text-center mb-6 font-tajawal animate-on-load fade-in-up"
                                style={{ lineHeight: '1.6', paddingTop: '8px', animationDelay: '0.2s', animationDuration: '0.8s' }}
                            >
                                {t('title.line1')}<br />
                                <span className="text-brand-purple md:bg-gradient-to-r md:from-brand-purple md:to-brand-red md:bg-clip-text md:text-transparent">
                                    {t('title.line2')}
                                </span><br />
                                {t('title.gradient')}
                            </h1>
                        ) : (
                            <h1
                                className="text-center font-sf-pro animate-on-load fade-in-up"
                                style={{ lineHeight: '1.5', animationDelay: '0.2s', animationDuration: '0.8s' }}
                            >
                                <span className="block text-xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-black dark:text-white mb-2" style={{ lineHeight: '1.5' }}>
                                    {t('title.line1')}<br />
                                    {t('title.line2')}
                                </span>
                                <span className="block text-4xl xs:text-5xl sm:text-6xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent mb-4" style={{ lineHeight: '1.5' }}>
                                    {t('title.gradient')}
                                </span>
                            </h1>
                        )}

                        <p
                            className={`text-gray-700 dark:text-gray-300 mx-auto text-center leading-relaxed animate-on-load fade-in-up ${
                                isArabic
                                    ? 'text-base md:text-lg lg:text-xl xl:text-2xl mb-12 max-w-[250px] md:max-w-xs font-tajawal font-light'
                                    : 'text-sm sm:text-md md:text-lg lg:text-1xl xl:text-2xl mb-10 max-w-[250px] sm:max-w-2xl md:max-w-xl font-sf-pro font-light'
                            }`}
                            style={{ animationDelay: '0.4s', animationDuration: '0.8s' }}
                        >
                            {t('subtitle')}
                        </p>

                        <div
                            className="animate-on-load fade-in-up"
                            style={{ animationDelay: '0.6s', animationDuration: '0.8s' }}
                        >
                            <button
                                onClick={scrollToContact}
                                className={`group relative bg-gradient-to-r from-brand-purple to-brand-red rounded-full text-md xs:text-lg sm:text-lg md:text-xl lg:text-2xl font-medium hover:shadow-2xl hover:shadow-brand-red/20 transition-all duration-300 hover:scale-105 tracking-wide overflow-hidden ${
                                    isArabic ? 'font-cairo py-2 md:py-4 px-4 sm:px-8 md:px-12 lg:px-12 xl:px-24' : 'font-sf-pro py-2 md:py-4 px-4 xs:px-16 sm:px-16 md:px-24'
                                }`}
                            >
                                <span className="text-white">
                                    {t('cta')}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Hero Image */}
                    <div
                        className="relative flex flex-col justify-center items-center animate-on-load fade-in-scale"
                        style={{ animationDelay: '0.3s', animationDuration: '1s' }}
                    >
                        <div className="relative w-full max-w-lg">
                            {/* Glow effect behind image - reduced on mobile */}
                            <div className="absolute inset-12 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-purple-600/10 blur-[40px] md:from-pink-500/30 md:via-purple-500/30 md:to-purple-600/30 md:blur-[85px] rounded-full" />

                            {/* Hero Icon */}
                            <img
                                src="/images/hero-icon.webp"
                                alt="Digital Solutions"
                                title="Digital Solutions"
                                className="relative z-10 w-full h-auto drop-shadow-2xl animate-float"
                                {...{ fetchpriority: "high" } as any}
                            />
                        </div>

                        {/* "Reach The Peak" text - Mobile only */}
                        <h2
                            className={`lg:hidden text-center mt-4 text-4xl xs:text-5xl sm:text-6xl font-bold animate-on-load fade-in-up ${
                                isArabic ? 'font-tajawal' : 'font-sf-pro'
                            }`}
                            style={isArabic ? {
                                lineHeight: '2',
                                overflow: 'visible',
                                animationDelay: '0.5s',
                                animationDuration: '0.8s'
                            } : { lineHeight: '1.5', animationDelay: '0.5s', animationDuration: '0.8s' }}
                        >
                            {isArabic ? (
                                <>
                                    <span className="text-black dark:text-white">نصل بـــــــك إلى</span>
                                    <br />
                                    <span className="text-brand-purple md:bg-gradient-to-r md:from-brand-purple md:to-brand-red md:bg-clip-text md:text-transparent">القمـــــــــــــــــــــــــــــــة</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-black dark:text-white">Reach The </span>
                                    <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">Peak</span>
                                </>
                            )}
                        </h2>
                    </div>
                </div>
            </div>
        </section>
    );
}
