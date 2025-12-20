import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation('common');

    const navLinks = [
        { name: t('nav.whyHardrock'), href: '#why-hardrock' },
        { name: t('nav.services'), href: '#services' },
        // { name: t('nav.ourTeam'), href: '#team' },
    ];

    return (
        // className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/90 backdrop-blur-md border-b-2" style={{ borderImage: 'linear-gradient(to right, rgba(112, 67, 153, 0.6), rgba(201, 55, 39, 0.6)) 1' }}>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/90 backdrop-blur-md border-b border-white/80" >
            <div className="w-full px-4 sm:px-12 lg:px-16 xl:px-20">
                <div className="flex items-center justify-between h-20 gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <img
                            src="/images/HOR-BLACK LOGO.svg"
                            alt="HardRock"
                            className="h-8 w-auto dark:hidden"
                        />
                        <img
                            src="/images/OR-WHITE LOGO.svg"
                            alt="HardRock"
                            className="h-8 w-auto hidden dark:block"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center ltr:space-x-4 ltr:lg:space-x-6 rtl:space-x-reverse rtl:gap-4 rtl:lg:gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-black/90 dark:text-white/90 hover:!text-brand-purple transition-all duration-200 text-sm lg:text-base font-poppins rtl:font-tajawal rtl:font-normal"
                            >
                                {link.name}
                            </a>
                        ))}

                        {/* Theme & Language Toggles */}

                        <a
                            href="#contact-us"
                            className="bg-gradient-to-r from-brand-purple to-brand-red text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium hover:shadow-lg hover:shadow-brand-red/50 transition-all duration-300"
                        >
                            {t('nav.contactUs')}
                        </a>
                        <ThemeToggle />
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <LanguageSwitcher />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-black dark:text-white hover:text-pink-500 focus:outline-none transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <motion.div
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={{
                    open: { opacity: 1, height: "auto" },
                    closed: { opacity: 0, height: 0 }
                }}
                className="md:hidden overflow-hidden bg-black/95 border-b border-white/10"
            >
                <div className="px-4 pt-2 pb-4 space-y-2">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-white/90 hover:text-white block px-3 py-3 rounded-md text-base font-poppins rtl:font-tajawal rtl:font-normal transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#contact-us"
                        className="w-full bg-gradient-to-r from-brand-purple to-brand-red text-white px-4 py-3 rounded-full text-base font-medium hover:shadow-lg hover:shadow-brand-red/50 transition-all mt-2 block text-center"
                        onClick={() => setIsOpen(false)}
                    >
                        {t('nav.contactUs')}
                    </a>
                </div>
            </motion.div>
        </nav>
    );
}
