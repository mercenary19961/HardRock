import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useInView } from '@/hooks/useInView';

const CLIENT_FILES = [
    { file: 'client-6', alt: 'AYSU' },
    { file: 'client-7', alt: 'Cady Cake' },
    { file: 'client-8', alt: 'Sahel' },
    { file: 'client-9', alt: 'Tkiyet Um Ali' },
    { file: 'client-10', alt: 'Flowmat' },
    { file: 'client-11', alt: 'Drivejo' },
    { file: 'client-12', alt: 'Nour Steel' },
    { file: 'client-14', alt: 'Sky Amman' },
];

const PARTNER_FILES = [
    { file: 'partner-1', alt: 'AgentSouq' },
    { file: 'partner-2', alt: 'Breez' },
    { file: 'partner-3', alt: 'The Business Hub' },
    { file: 'partner-4', alt: 'Migrate' },
    { file: 'partner-5', alt: 'Mujeeb' },
    { file: 'partner-6', alt: 'Retab Dates' },
];

export default function ClientsPartners() {
    const { t, i18n } = useTranslation('common');
    const isArabic = i18n.language === 'ar';
    const { theme } = useTheme();
    const [titleRef, titleInView] = useInView<HTMLDivElement>();
    const [clientsRef, clientsInView] = useInView<HTMLDivElement>();
    const [partnersRef, partnersInView] = useInView<HTMLDivElement>();

    const folder = theme === 'dark' ? 'dark' : 'light';

    return (
        <section className="relative py-16 md:py-24 lg:py-32 bg-white dark:bg-black overflow-hidden">
            <div className="relative z-10 w-full px-12 sm:px-16 lg:px-24 xl:px-32">
                {/* Title */}
                <div
                    ref={titleRef}
                    className={`mb-12 md:mb-16 lg:mb-20 animate-on-scroll animate-fade-in-up ${titleInView ? 'in-view' : ''}`}
                >
                    <h2
                        className={`text-4xl xs:text-5xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black ${
                            isArabic ? 'text-right font-tajawal' : 'text-left font-sf-pro'
                        }`}
                        style={isArabic ? { lineHeight: '1.6', paddingTop: '8px' } : {}}
                    >
                        <span className="text-black dark:text-white">
                            {t('clients.title.line1')}
                        </span>
                        <br />
                        <span
                            className={
                                isArabic
                                    ? 'text-brand-purple md:bg-gradient-to-r md:from-brand-purple md:to-brand-red md:bg-clip-text md:text-transparent'
                                    : 'bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent'
                            }
                        >
                            {t('clients.title.line2')}
                        </span>
                    </h2>
                </div>

                {/* Clients Grid */}
                <div
                    ref={clientsRef}
                    className={`mb-12 md:mb-16 lg:mb-20 animate-on-scroll animate-fade-in-up ${clientsInView ? 'in-view' : ''}`}
                >
                    <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-8 md:mb-10 text-black dark:text-white ${
                        isArabic ? 'text-right font-tajawal' : 'text-left font-sf-pro'
                    }`}>
                        {t('clients.clients')}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-8 md:gap-10 lg:gap-12 items-center justify-items-center">
                        {CLIENT_FILES.map((client) => (
                            <div
                                key={client.file}
                                className="flex items-center justify-center w-full h-16 sm:h-20 md:h-24"
                            >
                                <img
                                    src={`/images/clients/${folder}/${client.file}.png`}
                                    alt={client.alt}
                                    title={client.alt}
                                    loading="lazy"
                                    className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Partners Grid */}
                <div
                    ref={partnersRef}
                    className={`animate-on-scroll animate-fade-in-up ${partnersInView ? 'in-view' : ''}`}
                >
                    <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-8 md:mb-10 text-black dark:text-white ${
                        isArabic ? 'text-right font-tajawal' : 'text-left font-sf-pro'
                    }`}>
                        {t('clients.partners')}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-8 md:gap-10 lg:gap-12 items-center justify-items-center">
                        {PARTNER_FILES.map((partner) => (
                            <div
                                key={partner.file}
                                className="flex items-center justify-center w-full h-16 sm:h-20 md:h-24"
                            >
                                <img
                                    src={`/images/clients/${folder}/${partner.file}.png`}
                                    alt={partner.alt}
                                    title={partner.alt}
                                    loading="lazy"
                                    className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
