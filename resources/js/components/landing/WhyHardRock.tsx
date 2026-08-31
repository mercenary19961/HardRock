import { useTranslation } from 'react-i18next';

import { useInView } from '@/hooks/useInView';

import NeuralCore from './NeuralCore';

export default function WhyHardRock() {
    const { t, i18n } = useTranslation('whyHardRock');
    const isArabic = i18n.language === 'ar';

    const [coreRef, coreInView] = useInView<HTMLDivElement>();
    const [textRef, textInView] = useInView<HTMLDivElement>();

    return (
        <section
            id="why-hardrock"
            className="relative overflow-hidden bg-white pt-15 pb-16 md:pt-20 md:pb-24 lg:pb-40 dark:bg-black"
        >
            {/* The original blooming circles, unchanged. They are the section's
                signature, and they read as bloom rather than as a wash. Two large
                aurora fields were tried in their place and are gone again: a soft
                gradient over the same area cancels the bloom and leaves haze. */}
            <div className="hidden lg:block absolute top-10 ltr:right-20 rtl:left-20 w-32 h-32 bg-purple-500/30 dark:bg-purple-500/40 rounded-full blur-3xl" />
            <div className="hidden lg:block absolute top-40 ltr:right-60 rtl:left-60 w-24 h-24 bg-pink-500/25 dark:bg-pink-500/35 rounded-full blur-2xl" />
            <div className="hidden lg:block absolute bottom-20 ltr:left-10 rtl:right-10 w-40 h-40 bg-pink-500/30 dark:bg-pink-500/40 rounded-full blur-3xl" />
            <div className="hidden lg:block absolute bottom-60 ltr:left-40 rtl:right-40 w-28 h-28 bg-purple-500/25 dark:bg-purple-500/35 rounded-full blur-2xl" />
            <div className="hidden lg:block absolute top-1/2 ltr:right-32 rtl:left-32 w-36 h-36 bg-red-500/20 dark:bg-red-500/30 rounded-full blur-3xl" />

            {/* Substrate: a fine engineering grid, dissolved by a radial mask so it
                never draws a hard rectangle across the page. It is declared AFTER the
                blooms so it lies over them, which keeps the blooms from washing the
                grid out into a flat haze. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-40"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, rgba(120,120,140,0.16) 1px, transparent 1px),' +
                        'linear-gradient(to bottom, rgba(120,120,140,0.16) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                    maskImage:
                        'radial-gradient(ellipse 80% 65% at 50% 50%, black 20%, transparent 75%)',
                    WebkitMaskImage:
                        'radial-gradient(ellipse 80% 65% at 50% 50%, black 20%, transparent 75%)',
                }}
            />

            <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 xl:px-20">
                {/* RTL needs no order override here: the first grid child is the
                    right-hand column under `dir="rtl"`, which mirrors the layout
                    correctly on its own. That is the opposite of the hero, where the
                    copy has to be forced into column two or it lands on the character. */}
                <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
                    <div
                        ref={coreRef}
                        className={`animate-on-scroll animate-scale-in lg:col-span-5 ${
                            coreInView ? 'in-view' : ''
                        }`}
                    >
                        <NeuralCore />
                    </div>

                    <div
                        ref={textRef}
                        className={`animate-on-scroll text-start lg:col-span-7 ${
                            isArabic ? 'animate-fade-in-right' : 'animate-fade-in-left'
                        } ${textInView ? 'in-view' : ''}`}
                    >
                        <h2
                            className={`mb-8 text-4xl font-black xs:text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl ${
                                isArabic ? 'font-tajawal' : 'font-sf-pro'
                            }`}
                            style={isArabic ? { lineHeight: '1.6', paddingTop: '8px' } : undefined}
                        >
                            <span className="text-black dark:text-white">{t('title.line1')}</span>
                            <br />
                            <span className="inline-block bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text pb-[0.15em] text-transparent">
                                {t('title.line2')}
                            </span>
                        </h2>

                        <div
                            className={`max-w-2xl space-y-6 font-normal leading-relaxed text-gray-700 dark:text-gray-300 ${
                                isArabic
                                    ? 'font-tajawal text-lg md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl'
                                    : 'font-poppins text-lg md:text-xl lg:text-2xl'
                            }`}
                        >
                            <p>{t('paragraph1')}</p>

                            <p>
                                {t('paragraph2.part1')}
                                <span className="font-black">{t('paragraph2.bold')}</span>
                                {t('paragraph2.part2')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
