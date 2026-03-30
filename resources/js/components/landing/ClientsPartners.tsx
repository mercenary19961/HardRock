import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useInView } from '@/hooks/useInView';

const CLIENT_COUNT = 14;

export default function ClientsPartners() {
    const { t, i18n } = useTranslation('common');
    const isArabic = i18n.language === 'ar';
    const { theme } = useTheme();
    const [titleRef, titleInView] = useInView<HTMLDivElement>();
    const [gridRef, gridInView] = useInView<HTMLDivElement>();

    const folder = theme === 'dark' ? 'dark' : 'light';
    const clients = Array.from({ length: CLIENT_COUNT }, (_, i) => ({
        src: `/images/clients/${folder}/client-${i + 1}.png`,
        alt: `Client ${i + 1}`,
    }));

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

                {/* Logo Grid */}
                <div
                    ref={gridRef}
                    className={`grid grid-cols-3 sm:grid-cols-4 gap-8 md:gap-10 lg:gap-12 items-center justify-items-center animate-on-scroll animate-fade-in-up ${gridInView ? 'in-view' : ''}`}
                >
                    {clients.map((client, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center w-full h-16 sm:h-20 md:h-24"
                        >
                            <img
                                src={client.src}
                                alt={client.alt}
                                loading="lazy"
                                className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
