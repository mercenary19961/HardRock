import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t, i18n } = useTranslation('footer');
    const isArabic = i18n.language === 'ar';

    return (
        <footer className="bg-white dark:bg-black py-16 md:py-20">
            <div className="max-w-7xl mx-auto pl-4 px-0 sm:px-12 lg:px-16 xl:px-20">
                {/* Mobile: Logo First (Centered), Then 2 Columns */}
                {/* Desktop: 3 Equal Columns */}
                <div className="sm:hidden">
                    {/* Logo - Full Width Centered */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <Link href="/" className="inline-block mb-4">
                            <img
                                src="/images/logo-white.png"
                                alt="HardRock"
                                className="h-12 w-auto hidden dark:block"
                            />
                            <img
                                src="/images/logo-black.webp"
                                alt="HardRock"
                                className="h-12 w-auto block dark:hidden"
                            />
                        </Link>

                        {/* Social Media Icons */}
                        <div className="flex items-center gap-2">
                            <a
                                href="https://x.com/hardrock_agency"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-twitter.png" alt="Twitter" loading="lazy" className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/hardrock-agency/?viewAsMember=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-linkedin.png" alt="LinkedIn" loading="lazy" className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.snapchat.com/add/hardrock_agency"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-snapchat.png" alt="Snapchat" loading="lazy" className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.instagram.com/hardrock_agency/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-instagram.png" alt="Instagram" loading="lazy" className="w-6 h-6" />
                            </a>
                            <a
                                href="https://web.facebook.com/profile.php?id=61584916708775"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-facebook.png" alt="Facebook" loading="lazy" className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Two Columns: Contact Info & Navigation */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Left: Contact Info */}
                        <div className={`space-y-3 ${isArabic ? 'order-2' : 'order-1'}`} dir="ltr">
                            {/* Address */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center flex-shrink-0 w-5 h-5">
                                    <img src="/images/icon-location.png" alt="Location" loading="lazy" className="w-full h-full object-contain" />
                                </div>
                                <p className={`text-black dark:text-white text-xs ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}>
                                    {t('address')}
                                </p>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center flex-shrink-0 w-5 h-5">
                                    <img src="/images/icon-phone.png" alt="Phone" loading="lazy" className="w-full h-full object-contain" />
                                </div>
                                <a
                                    href={`tel:${t('phone')}`}
                                    dir="ltr"
                                    className={`text-black dark:text-white text-xs hover:text-brand-purple transition-colors ${
                                        isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                    }`}
                                >
                                    {t('phone')}
                                </a>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center flex-shrink-0 w-5 h-5">
                                    <img src="/images/icon-email.png" alt="Email" loading="lazy" className="w-full h-full object-contain" />
                                </div>
                                <a
                                    href={`mailto:${t('email')}`}
                                    className={`text-black dark:text-white text-xs hover:text-brand-purple transition-colors ${
                                        isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                    }`}
                                >
                                    {t('email')}
                                </a>
                            </div>
                        </div>

                        {/* Right: Navigation Menu */}
                        <div className={`flex flex-col ${isArabic ? 'order-1 items-start pr-4' : 'order-2 items-end pr-4'}`} dir={isArabic ? 'rtl' : 'ltr'}>
                            <nav className="space-y-3">
                                <a
                                    href="#why-hardrock"
                                    className={`group block text-black dark:text-white transition-all duration-300 text-xs relative pb-1 ${
                                        isArabic ? 'font-tajawal font-bold text-right' : 'font-poppins font-light text-left'
                                    }`}
                                >
                                    {t('menu.whyHardRock')}
                                    <span className={`absolute bottom-0 w-0 h-[1px] bg-gradient-to-r from-brand-purple to-brand-red group-hover:w-full transition-all duration-500 ${
                                        isArabic ? 'right-0' : 'left-0'
                                    }`}></span>
                                </a>
                                <a
                                    href="#services"
                                    className={`group block text-black dark:text-white transition-all duration-300 text-xs relative pb-1 ${
                                        isArabic ? 'font-tajawal font-bold text-right' : 'font-poppins font-light text-left'
                                    }`}
                                >
                                    {t('menu.services')}
                                    <span className={`absolute bottom-0 w-0 h-[1px] bg-gradient-to-r from-brand-purple to-brand-red group-hover:w-full transition-all duration-500 ${
                                        isArabic ? 'right-0' : 'left-0'
                                    }`}></span>
                                </a>
                                <a
                                    href="#contact-us"
                                    className={`group block text-black dark:text-white transition-all duration-300 text-xs relative pb-1 ${
                                        isArabic ? 'font-tajawal font-bold text-right' : 'font-poppins font-light text-left'
                                    }`}
                                >
                                    {t('menu.contactUs')}
                                    <span className={`absolute bottom-0 w-0 h-[1px] bg-gradient-to-r from-brand-purple to-brand-red group-hover:w-full transition-all duration-500 ${
                                        isArabic ? 'right-0' : 'left-0'
                                    }`}></span>
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Desktop: 3 Column Layout */}
                <div className={`hidden sm:grid grid-cols-3 ${isArabic ? 'gap-8 md:gap-16 lg:gap-24 xl:gap-60' : 'gap-4 md:gap-6 lg:gap-10 xl:gap-16'} ${isArabic ? 'text-right' : 'text-left'}`}>
                    {/* Left Column - Contact Info */}
                    <div className={`space-y-3 md:space-y-4 lg:space-y-6 ${isArabic ? 'lg:order-1' : 'lg:order-1'}`} dir="ltr">
                        {/* Address */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8">
                                <img src="/images/icon-location.png" alt="Location" loading="lazy" className="w-full h-full object-contain" />
                            </div>
                            <p className={`text-black dark:text-white text-xs md:text-sm lg:text-base ${
                                isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                            }`}>
                                {t('address')}
                            </p>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8">
                                <img src="/images/icon-phone.png" alt="Phone" loading="lazy" className="w-full h-full object-contain" />
                            </div>
                            <a
                                href={`tel:${t('phone')}`}
                                dir="ltr"
                                className={`text-black dark:text-white text-xs md:text-sm lg:text-base hover:text-brand-purple transition-colors ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}
                            >
                                {t('phone')}
                            </a>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8">
                                <img src="/images/icon-email.png" alt="Email" loading="lazy" className="w-full h-full object-contain" />
                            </div>
                            <a
                                href={`mailto:${t('email')}`}
                                className={`text-black dark:text-white text-xs md:text-sm lg:text-base hover:text-brand-purple transition-colors ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}
                            >
                                {t('email')}
                            </a>
                        </div>
                    </div>

                    {/* Center Column - Logo */}
                    <div className={`flex flex-col items-center justify-start ${isArabic ? 'lg:order-2' : 'lg:order-2'}`}>
                        <Link href="/" className="inline-block mb-4 md:mb-6 lg:mb-8">
                            <img
                                src="/images/logo-white.png"
                                alt="HardRock"
                                className="h-12 md:h-16 lg:h-20 xl:h-24 w-auto hidden dark:block"
                            />
                            <img
                                src="/images/logo-black.webp"
                                alt="HardRock"
                                className="h-12 md:h-16 lg:h-20 xl:h-24 w-auto block dark:hidden"
                            />
                        </Link>

                        {/* Social Media Icons */}
                        <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3">
                            <a
                                href="https://x.com/hardrock_agency"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-twitter.png" alt="Twitter" loading="lazy" className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/hardrock-agency/?viewAsMember=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-linkedin.png" alt="LinkedIn" loading="lazy" className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                            </a>
                            <a
                                href="https://www.snapchat.com/add/hardrock_agency"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-snapchat.png" alt="Snapchat" loading="lazy" className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                            </a>
                            <a
                                href="https://www.instagram.com/hardrock_agency/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-instagram.png" alt="Instagram" loading="lazy" className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                            </a>
                            <a
                                href="https://web.facebook.com/profile.php?id=61584916708775"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img src="/images/social-facebook.png" alt="Facebook" loading="lazy" className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column - Navigation Menu */}
                    <div className={`flex flex-col ${isArabic ? 'lg:order-3 items-start pl-4 md:pl-6 lg:pl-8' : 'lg:order-3 items-start lg:items-end pl-4 md:pl-6 lg:pl-8'}`} dir={isArabic ? 'rtl' : 'ltr'}>
                        <nav className="space-y-3 md:space-y-4 lg:space-y-6">
                            <a
                                href="#why-hardrock"
                                className={`group block text-black dark:text-white transition-all duration-300 text-xs md:text-sm lg:text-base relative pb-1 ${
                                    isArabic ? 'font-tajawal font-bold text-left' : 'font-poppins font-light text-left'
                                }`}
                            >
                                {t('menu.whyHardRock')}
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] md:h-[2px] bg-gradient-to-r from-brand-purple to-brand-red group-hover:w-full transition-all duration-500"></span>
                            </a>
                            <a
                                href="#services"
                                className={`group block text-black dark:text-white transition-all duration-300 text-xs md:text-sm lg:text-base relative pb-1 ${
                                    isArabic ? 'font-tajawal font-bold text-left' : 'font-poppins font-light text-left'
                                }`}
                            >
                                {t('menu.services')}
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] md:h-[2px] bg-gradient-to-r from-brand-purple to-brand-red group-hover:w-full transition-all duration-500"></span>
                            </a>
                            {/* <a
                                href="#our-team"
                                className={`group block text-black dark:text-white transition-all duration-300 text-xs md:text-sm lg:text-base relative pb-1 ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}
                            >
                                {t('menu.ourTeam')}
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] md:h-[2px] bg-gradient-to-r from-brand-purple to-brand-red group-hover:w-full transition-all duration-500"></span>
                            </a> */}
                            <a
                                href="#contact-us"
                                className={`group block text-black dark:text-white transition-all duration-300 text-xs md:text-sm lg:text-base relative pb-1 ${
                                    isArabic ? 'font-tajawal font-bold text-left' : 'font-poppins font-light text-left'
                                }`}
                            >
                                {t('menu.contactUs')}
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] md:h-[2px] bg-gradient-to-r from-brand-purple to-brand-red group-hover:w-full transition-all duration-500"></span>
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-16 pt-8 border-t border-gray-300 dark:border-gray-800 text-center">
                    <p className={`text-gray-500 dark:text-gray-400 text-xs md:text-sm ${
                        isArabic ? 'font-tajawal font-light' : 'font-poppins font-light'
                    }`}>
                        {t('copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
