import { useTranslation } from 'react-i18next';
import { useInView } from '@/hooks/useInView';

export default function WhyHardRock() {
    const { t, i18n } = useTranslation('whyHardRock');
    const isArabic = i18n.language === 'ar';
    const [imageRef, imageInView] = useInView<HTMLDivElement>();
    const [textRef, textInView] = useInView<HTMLDivElement>();

    return (
        <section id="why-hardrock" className="relative pt-15 pb-10 md:pb-20 md:pt-20 lg:pb-64 overflow-hidden bg-white dark:bg-black">
            {/* Background Blurs - Small Circles */}
            <div className="hidden lg:block absolute top-10 ltr:right-20 rtl:left-20 w-32 h-32 bg-purple-500/30 dark:bg-purple-500/40 rounded-full blur-3xl" />
            <div className="hidden lg:block absolute top-40 ltr:right-60 rtl:left-60 w-24 h-24 bg-pink-500/25 dark:bg-pink-500/35 rounded-full blur-2xl" />
            <div className="hidden lg:block absolute bottom-20 ltr:left-10 rtl:right-10 w-40 h-40 bg-pink-500/30 dark:bg-pink-500/40 rounded-full blur-3xl" />
            <div className="hidden lg:block absolute bottom-60 ltr:left-40 rtl:right-40 w-28 h-28 bg-purple-500/25 dark:bg-purple-500/35 rounded-full blur-2xl" />
            <div className="hidden lg:block absolute top-1/2 ltr:right-32 rtl:left-32 w-36 h-36 bg-red-500/20 dark:bg-red-500/30 rounded-full blur-3xl" />

            <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 xl:px-20">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                    {/* Image Column */}
                    <div
                        ref={imageRef}
                        className={`relative ${isArabic ? 'lg:order-1' : 'lg:order-1'} animate-on-scroll animate-scale-in ${imageInView ? 'in-view' : ''}`}
                    >
                        <div className="relative w-full max-w-md mx-auto">
                            {/* Gradient Circle Background */}
                            <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-brand-purple to-brand-red rounded-full blur-2xl opacity-30" />

                            {/* AI Head Image */}
                            <img
                                src="/images/why-hardrock.webp"
                                alt="Why HardRock"
                                title="Why HardRock"
                                loading="lazy"
                                className="relative z-10 w-full h-auto drop-shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Text Column */}
                    <div
                        ref={textRef}
                        className={`${isArabic ? 'lg:order-2 text-right' : 'lg:order-2 text-left'} animate-on-scroll ${isArabic ? 'animate-fade-in-right' : 'animate-fade-in-left'} ${textInView ? 'in-view' : ''}`}
                    >
                        <h2 className={`text-4xl xs:text-5xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black mb-8 ${isArabic ? 'font-tajawal' : 'font-sf-pro'}`} style={isArabic ? { lineHeight: '1.6', paddingTop: '8px' } : {}}>
                            <span className="text-black dark:text-white">
                                {t('title.line1')}
                            </span>
                            <br />
                            <span className={isArabic ? "text-brand-purple md:bg-gradient-to-r md:from-brand-purple md:to-brand-red md:bg-clip-text md:text-transparent" : "bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent"}>
                                {t('title.line2')}
                            </span>
                        </h2>

                        <div className={`space-y-6 text-gray-700 dark:text-gray-300 max-w-2xl ${
                            isArabic
                                ? 'text-lg md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl leading-relaxed font-tajawal font-normal'
                                : 'text-lg md:text-xl lg:text-2xl leading-relaxed font-poppins font-normal'
                        }`}>
                            <p>
                                {t('paragraph1')}
                            </p>

                            <p>
                                {t('paragraph2.part1')}
                                <span className="font-black">
                                    {t('paragraph2.bold')}
                                </span>
                                {t('paragraph2.part2')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
