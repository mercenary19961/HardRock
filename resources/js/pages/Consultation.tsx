import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';

const CALENDAR_URL = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0X_n1AtDC009VDNQB6txHDy-wLxk049MbL1rMPW1R7qidpo4bPTYgGQxWcUPH49txIF8z2W2WT';

export default function Consultation() {
    const { t, i18n } = useTranslation('consultation');
    const isArabic = i18n.language === 'ar';

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
            ),
            title: t('features.strategy.title'),
            description: t('features.strategy.description'),
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            ),
            title: t('features.audit.title'),
            description: t('features.audit.description'),
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
            ),
            title: t('features.roadmap.title'),
            description: t('features.roadmap.description'),
        },
    ];

    return (
        <>
            <Head>
                <title>{t('meta.title')}</title>
                <meta name="description" content={t('meta.description')} />
                <meta property="og:title" content={t('meta.title')} />
                <meta property="og:description" content={t('meta.description')} />
                <meta property="og:url" content="https://www.hardrock-co.com/consultation" />
            </Head>

            <div className="min-h-screen bg-white dark:bg-black text-foreground font-sans antialiased">
                <Navbar />

                <main>
                    {/* Hero Section */}
                    <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-20">
                        {/* Purple Glow Background */}
                        <div className="absolute inset-0 overflow-hidden dark:block hidden">
                            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/20 via-brand-purple/10 to-transparent blur-[120px] rounded-full" />
                        </div>
                        <div className="absolute inset-0 overflow-hidden dark:hidden">
                            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-200/40 via-pink-100/20 to-transparent blur-[120px] rounded-full" />
                        </div>

                        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 xl:px-20">
                            <div className="max-w-4xl mx-auto text-center">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple px-4 py-1.5 rounded-full text-sm font-medium mb-8">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    {t('noObligation')}
                                </div>

                                {/* Title */}
                                <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white mb-6 leading-tight ${
                                    isArabic ? 'font-tajawal' : 'font-sf-pro'
                                }`}>
                                    {t('title')}
                                </h1>

                                {/* Subtitle */}
                                <p className={`text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${
                                    isArabic ? 'font-tajawal font-light' : 'font-poppins font-light'
                                }`}>
                                    {t('subtitle')}
                                </p>

                                {/* CTA Button */}
                                <a
                                    href={CALENDAR_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group inline-flex items-center gap-3 bg-gradient-to-r from-brand-purple to-brand-red text-white rounded-full text-lg sm:text-xl font-medium px-10 sm:px-14 py-4 sm:py-5 hover:shadow-2xl hover:shadow-brand-red/30 transition-all duration-300 hover:scale-105 ${
                                        isArabic ? 'font-cairo' : 'font-sf-pro'
                                    }`}
                                >
                                    <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                    {t('cta')}
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-20 sm:py-28 px-6 sm:px-12 lg:px-16 xl:px-20">
                        <div className="max-w-5xl mx-auto">
                            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white text-center mb-16 ${
                                isArabic ? 'font-tajawal' : 'font-sf-pro'
                            }`}>
                                {t('features.title')}
                            </h2>

                            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="group text-center p-8 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-brand-purple/30 transition-all duration-300"
                                    >
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple/10 to-brand-red/10 text-brand-purple mb-6 group-hover:scale-110 transition-transform duration-300">
                                            {feature.icon}
                                        </div>
                                        <h3 className={`text-xl font-bold text-black dark:text-white mb-3 ${
                                            isArabic ? 'font-tajawal' : 'font-poppins'
                                        }`}>
                                            {feature.title}
                                        </h3>
                                        <p className={`text-gray-600 dark:text-gray-400 leading-relaxed ${
                                            isArabic ? 'font-tajawal font-light' : 'font-poppins font-light'
                                        }`}>
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </section>
                </main>

                <Footer />
                <WhatsAppButton />
            </div>
        </>
    );
}
