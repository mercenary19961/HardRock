import { Link } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';

interface ServiceItem {
    id: string;
    name: string;
    sidebarName: string;
    displayTitle: string[];
    description: string;
    image: string;
    imageLight?: string;
    link: string;
}

// Per-service title sizing: short names get larger, long names get smaller
const SERVICE_TITLE_SIZE: Record<string, string> = {
    'paid-ads': 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] 3xl:text-[11rem]',
    'social-media': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-[10rem]',
    'seo': 'text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] 2xl:text-[14rem] 3xl:text-[16rem]',
    'branding': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-9xl 3xl:text-[12rem]',
    'software-ai': 'text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-8xl 3xl:text-[10rem]',
    'pr-social-listening': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[5.5rem] 3xl:text-[8rem]',
};

const SERVICE_TITLE_SIZE_AR: Record<string, string> = {
    'paid-ads': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl',
    'social-media': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl',
    'seo': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl',
    'branding': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl',
    'software-ai': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl',
    'pr-social-listening': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl',
};

// Per-service gradient highlight: [before, gradient, after] per display title line
const SERVICE_TITLE_HIGHLIGHT: Record<string, [string, string, string][]> = {
    'paid-ads': [['PAID ', 'ADS', '']],
    'social-media': [['SOCIAL ', 'MEDIA', '']],
    'branding': [['BRAND', 'ING', '']],
    'software-ai': [['SOFTWARE ', '&', ' AI']],
    'pr-social-listening': [['PUBLIC ', 'RELATIONS', '']],
};

export default function Services() {
    const { t, i18n } = useTranslation('services');
    const { theme } = useTheme();
    const isArabic = i18n.language === 'ar';
    const isLightMode = theme === 'light';

    const services = t('items', { returnObjects: true }) as ServiceItem[];

    const [activeIndex, setActiveIndex] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const [autoResetTrigger, setAutoResetTrigger] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isProgrammaticScroll = useRef(false);
    const programmaticScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const justEnteredView = useRef(false);
    const entryGraceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const totalServices = services.length;

    // Helper: scroll the page to a specific service index without triggering the scroll handler
    const scrollToServiceIndex = useCallback((index: number) => {
        const section = sectionRef.current;
        if (!section) return;

        isProgrammaticScroll.current = true;
        if (programmaticScrollTimer.current) clearTimeout(programmaticScrollTimer.current);

        const scrollableHeight = section.offsetHeight - window.innerHeight;
        const targetProgress = index / totalServices;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const targetScroll = sectionTop + targetProgress * scrollableHeight;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });

        // Re-enable scroll handler after smooth scroll finishes (~600ms)
        programmaticScrollTimer.current = setTimeout(() => {
            isProgrammaticScroll.current = false;
        }, 700);
    }, [totalServices]);

    // Scroll-driven active index
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const handleScroll = () => {
            const rect = section.getBoundingClientRect();

            // Always track visibility
            const inView = rect.top <= 0 && rect.bottom >= window.innerHeight;
            setIsInView((wasInView) => {
                // When section first enters view, set a grace period so the
                // scroll that brought it into view doesn't count as interaction
                if (!wasInView && inView) {
                    justEnteredView.current = true;
                    if (entryGraceTimer.current) clearTimeout(entryGraceTimer.current);
                    entryGraceTimer.current = setTimeout(() => {
                        justEnteredView.current = false;
                    }, 500);
                }
                return inView;
            });

            // Skip index calculation during programmatic scrolls
            if (isProgrammaticScroll.current) return;

            const sectionTop = -rect.top;
            const scrollableHeight = section.offsetHeight - window.innerHeight;

            if (sectionTop < 0 || scrollableHeight <= 0) return;

            const progress = Math.min(Math.max(sectionTop / scrollableHeight, 0), 1);
            const index = Math.min(Math.floor(progress * totalServices), totalServices - 1);

            setActiveIndex(index);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [totalServices]);

    // Auto-rotate every 5 seconds (resets when autoResetTrigger changes)
    useEffect(() => {
        if (!isInView) return;

        autoTimerRef.current = setInterval(() => {
            setActiveIndex((prev) => {
                const next = prev + 1;
                if (next >= totalServices) return prev;
                scrollToServiceIndex(next);
                return next;
            });
        }, 5000);

        return () => {
            if (autoTimerRef.current) clearInterval(autoTimerRef.current);
        };
    }, [isInView, autoResetTrigger, totalServices, scrollToServiceIndex]);

    // Handle manual service click
    const handleServiceClick = useCallback((index: number) => {
        setActiveIndex(index);
        scrollToServiceIndex(index);
        // Reset the 5s auto-rotate timer
        setAutoResetTrigger((c) => c + 1);
    }, [scrollToServiceIndex]);

    // Pause auto-rotate on user scroll (only when actively scrolling within the section)
    useEffect(() => {
        const handleWheel = () => {
            // Reset the 5s auto-rotate timer when user scrolls within the section
            if (isInView && !isProgrammaticScroll.current && !justEnteredView.current) {
                setAutoResetTrigger((c) => c + 1);
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchmove', handleWheel, { passive: true });
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchmove', handleWheel);
        };
    }, [isInView]);

    // Cleanup timers
    useEffect(() => {
        return () => {
            if (autoTimerRef.current) clearInterval(autoTimerRef.current);
            if (programmaticScrollTimer.current) clearTimeout(programmaticScrollTimer.current);
            if (entryGraceTimer.current) clearTimeout(entryGraceTimer.current);
        };
    }, []);

    const activeService = services[activeIndex];

    return (
        <section
            ref={sectionRef}
            id="services"
            className="relative bg-white dark:bg-black"
            style={{ height: `${(totalServices + 1) * 100}vh` }}
        >
            {/* Sticky container */}
            <div
                ref={stickyRef}
                className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
            >
                {/* Background Blurs */}
                <div className="absolute top-20 ltr:left-20 rtl:right-20 w-40 h-40 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-40 ltr:right-20 rtl:left-20 w-48 h-48 bg-pink-500/20 dark:bg-pink-500/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 ltr:left-1/3 rtl:right-1/3 w-32 h-32 bg-red-500/15 dark:bg-red-500/25 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 w-full h-full flex" dir={isArabic ? 'rtl' : 'ltr'}>
                    {/* Sidebar — vertical service names */}
                    <div className="hidden lg:flex flex-col justify-center items-center w-16 xl:w-20 flex-shrink-0">
                        <div className="flex flex-col gap-2">
                            {services.map((service, index) => (
                                <button
                                    key={service.id}
                                    onClick={() => handleServiceClick(index)}
                                    className="relative group"
                                >
                                    <span
                                        className={`block text-[11px] xl:text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-500 ${
                                            isArabic ? 'font-tajawal' : 'font-poppins'
                                        } ${
                                            index === activeIndex
                                                ? isLightMode ? 'text-gray-900 font-medium' : 'text-white font-medium'
                                                : isLightMode ? 'text-gray-400 hover:text-gray-600' : 'text-gray-600 hover:text-gray-400'
                                        }`}
                                        style={{
                                            writingMode: 'vertical-lr',
                                            textOrientation: 'mixed',
                                            transform: isArabic ? 'rotate(180deg)' : 'none',
                                        }}
                                    >
                                        {service.sidebarName || service.name}
                                    </span>

                                    {/* Bracket corners for active service */}
                                    {index === activeIndex && (
                                        <div className="absolute -inset-x-1 -inset-y-1">
                                            {/* Top-left corner */}
                                            <span className={`absolute top-0 ${isArabic ? 'right-0' : 'left-0'} w-2 h-2 ${isLightMode ? 'border-gray-900' : 'border-white'} ${isArabic ? 'border-t border-r' : 'border-t border-l'}`} />
                                            {/* Top-right corner */}
                                            <span className={`absolute top-0 ${isArabic ? 'left-0' : 'right-0'} w-2 h-2 ${isLightMode ? 'border-gray-900' : 'border-white'} ${isArabic ? 'border-t border-l' : 'border-t border-r'}`} />
                                            {/* Bottom-left corner */}
                                            <span className={`absolute bottom-0 ${isArabic ? 'right-0' : 'left-0'} w-2 h-2 ${isLightMode ? 'border-gray-900' : 'border-white'} ${isArabic ? 'border-b border-r' : 'border-b border-l'}`} />
                                            {/* Bottom-right corner */}
                                            <span className={`absolute bottom-0 ${isArabic ? 'left-0' : 'right-0'} w-2 h-2 ${isLightMode ? 'border-gray-900' : 'border-white'} ${isArabic ? 'border-b border-l' : 'border-b border-r'}`} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 sm:px-12 lg:px-8 xl:px-16 gap-8 lg:gap-4 pt-16 lg:pt-0">
                        {/* Text content — left side */}
                        <div className={`flex-[3] min-w-0 flex flex-col justify-center ${isArabic ? 'text-right' : 'text-left'}`}>
                            {/* Display title — large bold text */}
                            <h2
                                key={activeService.id}
                                className={`leading-[1.1] tracking-tight mb-6 lg:mb-8 animate-service-title ${
                                    isArabic ? 'font-tajawal' : 'font-sf-pro'
                                }`}
                            >
                                {(activeService.displayTitle || [activeService.name]).map((line, i, arr) => {
                                    const sizeMap = isArabic ? SERVICE_TITLE_SIZE_AR : SERVICE_TITLE_SIZE;
                                    const sizeClass = sizeMap[activeService.id] || 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl';
                                    const highlight = !isArabic ? SERVICE_TITLE_HIGHLIGHT[activeService.id]?.[i] : null;
                                    const isArabicGradientLine = isArabic && arr.length > 1 && i === 1;
                                    const baseClass = `${sizeClass} font-[950] uppercase`;
                                    const plainColor = isLightMode ? 'text-gray-900' : 'text-white';
                                    const gradientStyle = 'bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent pb-[0.3em] px-[0.15em] -mx-[0.15em]';

                                    if (highlight) {
                                        return (
                                            <span key={i} className="block whitespace-nowrap overflow-visible">
                                                <span className={`${baseClass} inline-block ${plainColor}`}>{highlight[0].trimEnd()}</span>
                                                {highlight[0].endsWith(' ') && <span className={`${baseClass} inline-block`}>&nbsp;</span>}
                                                <span className={`${baseClass} inline-block ${gradientStyle}`}>{highlight[1]}</span>
                                                {highlight[2]?.startsWith(' ') && <span className={`${baseClass} inline-block`}>&nbsp;</span>}
                                                {highlight[2] && <span className={`${baseClass} inline-block ${plainColor}`}>{highlight[2].trimStart()}</span>}
                                            </span>
                                        );
                                    }

                                    if (isArabicGradientLine) {
                                        return (
                                            <span key={i} className="block whitespace-nowrap overflow-visible">
                                                <span className={`${baseClass} inline-block ${gradientStyle}`}>{line}</span>
                                            </span>
                                        );
                                    }

                                    return (
                                        <span key={i} className="block whitespace-nowrap">
                                            <span className={`${baseClass} inline-block ${plainColor}`}>{line}</span>
                                        </span>
                                    );
                                })}
                            </h2>

                            {/* Description with accent bar */}
                            <div className={`flex gap-4 items-start max-w-xl ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <div className="w-1 flex-shrink-0 rounded-full bg-gradient-to-b from-brand-purple to-brand-red self-stretch min-h-[60px]" />
                                <p
                                    key={`desc-${activeService.id}`}
                                    className={`animate-service-desc ${
                                        isLightMode ? 'text-gray-600' : 'text-gray-400'
                                    } ${
                                        isArabic
                                            ? 'text-base sm:text-lg lg:text-xl font-tajawal'
                                            : 'text-sm sm:text-base lg:text-lg font-poppins'
                                    }`}
                                    style={{ lineHeight: '1.8' }}
                                >
                                    {activeService.description}
                                </p>
                            </div>

                            {/* Learn more link */}
                            <div className={`mt-8 ${isArabic ? 'text-right' : 'text-left'}`}>
                                <Link
                                    href={activeService.link}
                                    className={`inline-flex items-center gap-2 text-sm tracking-widest uppercase transition-colors duration-300 ${
                                        isLightMode
                                            ? 'text-brand-purple hover:text-brand-red'
                                            : 'text-gray-400 hover:text-white'
                                    } ${isArabic ? 'font-tajawal' : 'font-poppins'}`}
                                >
                                    {t('learnMore')}
                                    <svg className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Image — right side */}
                        <div className="flex-[2] flex items-center justify-center max-w-sm lg:max-w-md xl:max-w-lg">
                            <Link
                                href={activeService.link}
                                key={`img-${activeService.id}`}
                                className="relative w-full aspect-square flex items-center justify-center animate-service-image cursor-pointer transition-transform hover:scale-105"
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-red/20 rounded-full blur-3xl" />

                                <img
                                    src={isLightMode && activeService.imageLight ? activeService.imageLight : activeService.image}
                                    alt={activeService.name}
                                    title={activeService.name}
                                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile service indicator dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden z-10">
                    {services.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleServiceClick(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === activeIndex
                                    ? 'bg-gradient-to-r from-brand-purple to-brand-red w-6'
                                    : isLightMode ? 'bg-gray-300' : 'bg-gray-600'
                            }`}
                            aria-label={`View ${services[index].name}`}
                        />
                    ))}
                </div>

                {/* Scroll indicator */}
                {activeIndex < totalServices - 1 && (
                    <div className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 animate-bounce">
                        <span className={`text-xs tracking-widest ${isLightMode ? 'text-gray-400' : 'text-gray-600'} ${isArabic ? 'font-tajawal' : 'font-poppins'}`}>
                            {isArabic ? 'مرر' : 'SCROLL'}
                        </span>
                        <svg className={`w-4 h-4 ${isLightMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
                        </svg>
                    </div>
                )}
            </div>
        </section>
    );
}
