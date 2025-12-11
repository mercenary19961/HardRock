import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t, i18n } = useTranslation('footer');
    const isArabic = i18n.language === 'ar';

    return (
        <footer className="bg-white dark:bg-black py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 ${isArabic ? 'text-right' : 'text-left'}`}>
                    {/* Left Column - Contact Info */}
                    <div className={`space-y-6 ${isArabic ? 'lg:order-1' : 'lg:order-1'}`} dir={isArabic ? 'rtl' : 'ltr'}>
                        {/* Address */}
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center mt-1">
                                <img src="/images/icon-location.png" alt="Location" className="w-10 h-10" />
                            </div>
                            <p className={`text-black dark:text-white text-sm md:text-base ${
                                isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                            }`}>
                                {t('address')}
                            </p>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center mt-1">
                                <img src="/images/icon-phone.png" alt="Phone" className="w-10 h-10" />
                            </div>
                            <a
                                href={`tel:${t('phone')}`}
                                className={`text-black dark:text-white text-sm md:text-base hover:text-brand-purple transition-colors ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}
                            >
                                {t('phone')}
                            </a>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center mt-1">
                                <img src="/images/icon-email.png" alt="Email" className="w-10 h-10" />
                            </div>
                            <a
                                href={`mailto:${t('email')}`}
                                className={`text-black dark:text-white text-sm md:text-base hover:text-brand-purple transition-colors ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}
                            >
                                {t('email')}
                            </a>
                        </div>
                    </div>

                    {/* Center Column - Logo */}
                    <div className={`flex flex-col items-center justify-start ${isArabic ? 'lg:order-2' : 'lg:order-2'}`}>
                        <Link href="/" className="inline-block mb-8">
                            <img
                                src="/images/logo-white.png"
                                alt="HardRock"
                                className="h-20 md:h-24 lg:h-28 w-auto hidden dark:block"
                            />
                            <img
                                src="/images/logo-black.png"
                                alt="HardRock"
                                className="h-20 md:h-24 lg:h-28 w-auto block dark:hidden"
                            />
                        </Link>

                        {/* Social Media Icons */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://twitter.com/hardrock"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-twitter.png" alt="Twitter" className="w-10 h-10" />
                            </a>
                            <a
                                href="https://linkedin.com/company/hardrock"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-linkedin.png" alt="LinkedIn" className="w-10 h-10" />
                            </a>
                            <a
                                href="https://snapchat.com/add/hardrock"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-snapchat.png" alt="Snapchat" className="w-10 h-10" />
                            </a>
                            <a
                                href="https://instagram.com/hardrock"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-instagram.png" alt="Instagram" className="w-10 h-10" />
                            </a>
                            <a
                                href="https://facebook.com/hardrock"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-facebook.png" alt="Facebook" className="w-10 h-10" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column - Navigation Menu */}
                    <div className={`flex flex-col ${isArabic ? 'lg:order-3 items-start lg:items-end' : 'lg:order-3 items-start lg:items-end'}`} dir={isArabic ? 'rtl' : 'ltr'}>
                        <nav className="space-y-4">
                            <a
                                href="#why-hardrock"
                                className={`group block text-black dark:text-white transition-all duration-300 text-sm md:text-base relative pb-1 ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}
                            >
                                {t('menu.whyHardRock')}
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-brand-purple to-brand-red group-hover:w-full transition-all duration-500"></span>
                            </a>
                            <a
                                href="#services"
                                className={`group block text-black dark:text-white transition-all duration-300 text-sm md:text-base relative pb-1 ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}
                            >
                                {t('menu.services')}
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-brand-purple to-brand-red group-hover:w-full transition-all duration-500"></span>
                            </a>
                            {/* <a
                                href="#our-team"
                                className={`group block text-black dark:text-white transition-all duration-300 text-sm md:text-base relative pb-1 ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}
                            >
                                {t('menu.ourTeam')}
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-brand-purple to-brand-red group-hover:w-full transition-all duration-500"></span>
                            </a> */}
                            <a
                                href="#contact-us"
                                className={`group block text-black dark:text-white transition-all duration-300 text-sm md:text-base relative pb-1 ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}
                            >
                                {t('menu.contactUs')}
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-brand-purple to-brand-red group-hover:w-full transition-all duration-500"></span>
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-16 pt-8 border-t border-gray-300 dark:border-gray-800 text-center">
                    <p className={`text-gray-500 dark:text-gray-400 text-xs md:text-sm ${
                        isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                    }`}>
                        {t('copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
