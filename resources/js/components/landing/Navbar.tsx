import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CinematicSwitch from '@/components/ui/cinematic-glow-toggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

/** Height of the bar itself (`h-20`), in px. */
const NAV_HEIGHT = 80;

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { t } = useTranslation('common');
    const menuRef = useRef<HTMLDivElement>(null);
    const { url } = usePage();

    /*
     * The bar has no solid background any more, so what sits behind it decides what
     * colour it has to be — and on the landing page that changes with scroll.
     *
     * Wherever the character renders, the hero backdrop is dark art in BOTH themes (the
     * copy there is already forced to `desktop-pointer:text-white` for the same
     * reason), so a white light-theme scrim over it would erase the logo. Past the hero
     * the page is white again in light mode, where white nav content would be just as
     * invisible. Hence a measured flag rather than a fixed choice.
     *
     * Seeded from the URL instead of from a measurement so the server-rendered markup
     * is already correct — measuring first would flash a black logo over the dark art
     * on every light-theme load, for as long as hydration takes.
     */
    const isLanding = url === '/' || url.startsWith('/?') || url.startsWith('/#');
    const [overHero, setOverHero] = useState(isLanding);

    const [showConsultation, setShowConsultation] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowConsultation((prev) => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Hide navbar when services section is in view, reveal on top 20% hover
    useEffect(() => {
        const servicesEl = () => document.getElementById('services');
        let hideTimer: ReturnType<typeof setTimeout> | null = null;

        const clearHideTimer = () => {
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }
        };

        const isInServicesSection = () => {
            const section = servicesEl();
            if (!section) return false;
            const rect = section.getBoundingClientRect();
            return rect.top <= 0 && rect.bottom >= window.innerHeight;
        };

        // Over the hero for as long as its bottom edge is still under the bar. Pages
        // without a #hero (services, consultation) simply never set it.
        const syncOverHero = () => {
            const hero = document.getElementById('hero');
            setOverHero(!!hero && hero.getBoundingClientRect().bottom > NAV_HEIGHT);
        };

        const handleScroll = () => {
            syncOverHero();
            const section = servicesEl();
            if (!section) { clearHideTimer(); setHidden(false); return; }
            clearHideTimer();
            setHidden(isInServicesSection());
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (e.clientY < window.innerHeight * 0.2) {
                clearHideTimer();
                setHidden(false);
            } else if (isInServicesSection()) {
                if (!hideTimer) {
                    hideTimer = setTimeout(() => {
                        if (isInServicesSection()) setHidden(true);
                        hideTimer = null;
                    }, 500);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        // The hero is min-h-screen, so its bottom edge moves whenever the viewport does.
        window.addEventListener('resize', syncOverHero);
        handleScroll();

        return () => {
            clearHideTimer();
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', syncOverHero);
        };
    }, []);

    const ctaText = showConsultation ? t('nav.freeConsultation') : t('nav.contactUs');

    const navLinks = [
        { name: t('nav.whyHardrock'), href: '/#why-hardrock' },
        { name: t('nav.services'), href: '/services/branding?from=nav' },
    ];

    // Handle menu height for animation
    useEffect(() => {
        if (menuRef.current) {
            if (isOpen) {
                menuRef.current.style.height = `${menuRef.current.scrollHeight}px`;
            } else {
                menuRef.current.style.height = '0px';
            }
        }
    }, [isOpen]);

    /*
     * A top-to-bottom scrim rather than a bar: opaque enough at the top edge to carry
     * the logo and the links, gone by the bottom edge so nothing draws a line across
     * the hero. Deliberately no backdrop blur — the blur would stop dead at the bottom
     * of the box while the colour keeps fading, leaving the very seam this removes.
     *
     * The `desktop-pointer:` override is the dark-art case above: it wins over the
     * light-theme stops by source order, and loses to the `dark:` ones on specificity,
     * which is what we want since those are already black.
     */
    const scrim = `bg-gradient-to-b from-white/90 via-white/45 to-transparent dark:from-black/90 dark:via-black/45 ${
        overHero ? 'desktop-pointer:from-black/80 desktop-pointer:via-black/40' : ''
    }`;

    // Over the dark hero art the light theme has to borrow the dark theme's colours.
    // Keyed to desktop-pointer rather than to lg, because a pointerless desktop screen
    // gets the original light hero instead of the character, and white on that is white
    // on white.
    const overArt = overHero ? 'desktop-pointer:text-white' : '';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 overflow-x-hidden ${scrim} transition-transform duration-500 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
            <div className="w-full ltr:pl-2 ltr:pr-4 rtl:pr-2 rtl:pl-4 sm:ltr:px-12 sm:rtl:px-12 lg:px-16 xl:px-20">
                <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        {/* The white logo stands in for the black one while the bar is over
                            the character art, in either theme. `dark:` outranks a screen
                            variant on specificity, so the dark theme is unaffected. */}
                        <img
                            src="/images/HOR-BLACK LOGO.svg"
                            alt="HardRock"
                            title="HardRock"
                            className={`h-5 sm:h-8 w-auto dark:hidden ${overHero ? 'desktop-pointer:hidden' : ''}`}
                        />
                        <img
                            src="/images/OR-WHITE LOGO.svg"
                            alt="HardRock"
                            title="HardRock"
                            className={`h-5 sm:h-8 w-auto hidden dark:block ${overHero ? 'desktop-pointer:block' : ''}`}
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center ltr:space-x-4 ltr:lg:space-x-6 rtl:space-x-reverse rtl:gap-4 rtl:lg:gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`text-black/90 dark:text-white/90 ${overArt} hover:!text-brand-purple transition-all duration-200 text-sm lg:text-base font-poppins rtl:font-tajawal rtl:font-normal`}
                            >
                                {link.name}
                            </a>
                        ))}

                        {/* Theme & Language Toggles */}

                        <a
                            href="/#contact-us"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-brand-purple to-brand-red text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-xs lg:text-sm font-medium hover:shadow-lg hover:shadow-brand-red/50 transition-all duration-300 min-w-[140px] lg:min-w-[170px] whitespace-nowrap"
                        >
                            <span key={ctaText} className="inline-flex items-center gap-1.5 animate-fade-in-nav">
                                {!showConsultation && (
                                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                )}
                                {ctaText}
                            </span>
                        </a>
                        <CinematicSwitch />
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <CinematicSwitch />
                        <LanguageSwitcher />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-black dark:text-white hover:text-pink-500 focus:outline-none transition-colors"
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                        >
                            {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                ref={menuRef}
                id="mobile-menu"
                className={`md:hidden overflow-hidden bg-white/95 dark:bg-black/95 border-b border-gray-200 dark:border-white/10 transition-all duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                style={{ height: 0 }}
            >
                <div className="px-4 pt-2 pb-4 space-y-2">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-black/90 dark:text-white/90 hover:text-brand-purple dark:hover:text-white block px-3 py-3 rounded-md text-base font-poppins rtl:font-tajawal rtl:font-normal transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="/#contact-us"
                        className="w-full bg-gradient-to-r from-brand-purple to-brand-red text-white px-4 py-3 rounded-full text-base font-medium hover:shadow-lg hover:shadow-brand-red/50 transition-all mt-2 block text-center"
                        onClick={() => setIsOpen(false)}
                    >
                        <span key={ctaText} className="inline-flex items-center justify-center gap-1.5 animate-fade-in-nav">
                            {!showConsultation && (
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            )}
                            {ctaText}
                        </span>
                    </a>
                </div>
            </div>
        </nav>
    );
}
