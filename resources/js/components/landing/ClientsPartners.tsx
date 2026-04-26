import { useEffect, useState } from 'react';
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
    { file: 'client-15', alt: 'Baladi' },
];

const PARTNER_FILES = [
    { file: 'partner-1', alt: 'AgentSouq' },
    { file: 'partner-2', alt: 'Breez' },
    { file: 'partner-3', alt: 'The Business Hub' },
    { file: 'partner-4', alt: 'Migrate' },
    { file: 'partner-5', alt: 'Mujeeb' },
    { file: 'partner-6', alt: 'Retab Dates' },
];

interface LogoItem {
    file: string;
    alt: string;
}

function MarqueeBelt({ items, folder, direction }: { items: LogoItem[]; folder: string; direction: 'left' | 'right' }) {
    const doubled = [...items, ...items];
    const [paused, setPaused] = useState(false);

    return (
        <div className="overflow-hidden relative" dir="ltr">
            <div
                className={`flex items-center w-max ${
                    direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
                }`}
                style={{ animationPlayState: paused ? 'paused' : 'running' }}
            >
                {doubled.map((item, index) => (
                    <div
                        key={`${item.file}-${index}`}
                        className="flex items-center justify-center h-20 sm:h-28 md:h-32 lg:h-36 w-40 sm:w-48 md:w-56 lg:w-64 flex-shrink-0 mr-16 md:mr-20 lg:mr-28"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                    >
                        <img
                            src={`/images/clients/${folder}/${item.file}.png`}
                            alt={item.alt}
                            title={item.alt}
                            className="max-h-full max-w-full object-contain opacity-40 hover:opacity-100 transition-opacity duration-300"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ClientsPartners() {
    const { t, i18n } = useTranslation('common');
    const { theme } = useTheme();
    const [sectionRef, sectionInView] = useInView<HTMLDivElement>();

    const folder = theme === 'dark' ? 'dark' : 'light';

    // Preload logos after initial page render so they're cached before scrolling
    useEffect(() => {
        const timer = setTimeout(() => {
            [...CLIENT_FILES, ...PARTNER_FILES].forEach((item) => {
                const img = new Image();
                img.src = `/images/clients/${folder}/${item.file}.png`;
            });
        }, 1000);
        return () => clearTimeout(timer);
    }, [folder]);

    return (
        <section className="relative py-10 md:py-14 lg:py-20 bg-[#06060f] overflow-hidden">
            <div
                ref={sectionRef}
                className={`space-y-20 md:space-y-24 animate-on-scroll animate-fade-in-up ${sectionInView ? 'in-view' : ''}`}
            >
                {/* Clients belt - moves left to right */}
                <div>
                    <h3 className={`text-2xl md:text-3xl lg:text-4xl font-medium mb-8 md:mb-10 bg-gradient-to-r from-brand-red to-brand-purple bg-clip-text text-transparent text-center uppercase ${
                        i18n.language === 'ar' ? 'font-tajawal' : 'font-sf-pro'
                    }`}>
                        {t('clients.clients')}
                    </h3>
                    <MarqueeBelt items={CLIENT_FILES} folder={folder} direction="right" />
                </div>

                {/* Partners belt - moves right to left */}
                <div>
                    <h3 className={`text-2xl md:text-3xl lg:text-4xl font-medium mb-8 md:mb-10 bg-gradient-to-r from-brand-red to-brand-purple bg-clip-text text-transparent text-center uppercase ${
                        i18n.language === 'ar' ? 'font-tajawal' : 'font-sf-pro'
                    }`}>
                        {t('clients.partners')}
                    </h3>
                    <MarqueeBelt items={PARTNER_FILES} folder={folder} direction="left" />
                </div>
            </div>
        </section>
    );
}
