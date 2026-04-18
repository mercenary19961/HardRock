import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const servicesCol1 = ['paid-ads', 'social-media', 'seo'] as const;
const servicesCol2 = ['branding', 'software-ai', 'pr-social-listening'] as const;

export default function Footer() {
    const { t, i18n } = useTranslation('footer');
    const isArabic = i18n.language === 'ar';

    const columnHeaderClass = `text-black dark:text-white text-xs md:text-sm font-semibold pb-2 mb-4 relative ${
        isArabic ? 'font-tajawal' : 'font-poppins'
    }`;

    const serviceLinkClass = `group block text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300 text-[11px] md:text-xs lg:text-sm py-1 ${
        isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
    }`;

    const navLinkClass = `group block text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300 text-[11px] md:text-xs lg:text-sm py-1 ${
        isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
    }`;

    const GradientLine = () => (
        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-purple to-brand-red" />
    );

    return (
        <footer className="bg-white dark:bg-black pt-16 pb-8 md:pt-20 md:pb-10">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 xl:px-20">

                {/* Mobile Layout */}
                <div className="sm:hidden" dir={isArabic ? 'rtl' : 'ltr'}>
                    {/* Services in 2 columns */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <h3 className={columnHeaderClass}>
                                {t('columns.services001')}
                                <GradientLine />
                            </h3>
                            {servicesCol1.map((slug) => (
                                <Link key={slug} href={`/services/${slug}`} className={serviceLinkClass}>
                                    {t(`serviceLinks.${slug}`)}
                                </Link>
                            ))}
                        </div>
                        <div>
                            <h3 className={columnHeaderClass}>
                                {t('columns.services002')}
                                <GradientLine />
                            </h3>
                            {servicesCol2.map((slug) => (
                                <Link key={slug} href={`/services/${slug}`} className={serviceLinkClass}>
                                    {t(`serviceLinks.${slug}`)}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Company + Contact in 2 columns */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <h3 className={columnHeaderClass}>
                                {t('columns.company')}
                                <GradientLine />
                            </h3>
                            <a href="#why-hardrock" className={navLinkClass}>
                                {t('menu.whyHardRock')}
                            </a>
                            <a href="#services" className={navLinkClass}>
                                {t('menu.services')}
                            </a>
                            <a href="#contact-us" className={navLinkClass}>
                                {t('menu.contactUs')}
                            </a>
                        </div>
                        <div>
                            <h3 className={columnHeaderClass}>
                                {t('columns.contact')}
                                <GradientLine />
                            </h3>
                            <div className="space-y-2" dir="ltr">
                                <div className="flex items-center gap-2">
                                    <img src="/images/icon-location.png" alt="Location" title="Location" loading="lazy" className="w-4 h-4 flex-shrink-0" />
                                    <p className={`text-gray-500 dark:text-gray-400 text-[11px] ${
                                        isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                    }`}>
                                        {t('address')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <img src="/images/icon-phone.png" alt="Phone" title="Phone" loading="lazy" className="w-4 h-4 flex-shrink-0" />
                                    <a href={`tel:${t('phone')}`} className={`text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-[11px] transition-colors ${
                                        isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                    }`}>
                                        {t('phone')}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <img src="/images/icon-email.png" alt="Email" title="Email" loading="lazy" className="w-4 h-4 flex-shrink-0" />
                                    <a href={`mailto:${t('email')}`} className={`text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-[11px] transition-colors ${
                                        isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                    }`}>
                                        {t('email')}
                                    </a>
                                </div>
                            </div>
                            {/* Social Icons */}
                            <div className="flex items-center gap-2 mt-4" dir="ltr">
                                <a href="https://x.com/hardrock_agency" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Follow HardRock on Twitter">
                                    <img src="/images/social-twitter.png" alt="Twitter" title="Twitter" loading="lazy" className="w-5 h-5" />
                                </a>
                                <a href="https://www.linkedin.com/company/hardrock-agency/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Follow HardRock on LinkedIn">
                                    <img src="/images/social-linkedin.png" alt="LinkedIn" title="LinkedIn" loading="lazy" className="w-5 h-5" />
                                </a>
                                <a href="https://www.snapchat.com/add/hardrock_agency" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Follow HardRock on Snapchat">
                                    <img src="/images/social-snapchat.png" alt="Snapchat" title="Snapchat" loading="lazy" className="w-5 h-5" />
                                </a>
                                <a href="https://www.instagram.com/hardrock_agency/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Follow HardRock on Instagram">
                                    <img src="/images/social-instagram.png" alt="Instagram" title="Instagram" loading="lazy" className="w-5 h-5" />
                                </a>
                                <a href="https://web.facebook.com/profile.php?id=61584916708775" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Follow HardRock on Facebook">
                                    <img src="/images/social-facebook.png" alt="Facebook" title="Facebook" loading="lazy" className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout - 4 Columns */}
                <div className="hidden sm:grid grid-cols-4 gap-8 lg:gap-12 xl:gap-16" dir={isArabic ? 'rtl' : 'ltr'}>
                    {/* Column 1 - Services (first half) */}
                    <div>
                        <h3 className={columnHeaderClass}>
                            {t('columns.services001')}
                            <GradientLine />
                        </h3>
                        {servicesCol1.map((slug) => (
                            <Link key={slug} href={`/services/${slug}`} className={serviceLinkClass}>
                                {t(`serviceLinks.${slug}`)}
                            </Link>
                        ))}
                    </div>

                    {/* Column 2 - Services (second half) */}
                    <div>
                        <h3 className={columnHeaderClass}>
                            {t('columns.services002')}
                            <GradientLine />
                        </h3>
                        {servicesCol2.map((slug) => (
                            <Link key={slug} href={`/services/${slug}`} className={serviceLinkClass}>
                                {t(`serviceLinks.${slug}`)}
                            </Link>
                        ))}
                    </div>

                    {/* Column 3 - Company */}
                    <div>
                        <h3 className={columnHeaderClass}>
                            {t('columns.pages')}
                            <GradientLine />
                        </h3>
                        <a href="#why-hardrock" className={navLinkClass}>
                            {t('menu.whyHardRock')}
                        </a>
                        <a href="#services" className={navLinkClass}>
                            {t('menu.services')}
                        </a>
                        <a href="#contact-us" className={navLinkClass}>
                            {t('menu.contactUs')}
                        </a>
                    </div>

                    {/* Column 4 - Contact */}
                    <div>
                        <h3 className={columnHeaderClass}>
                            {t('columns.contact')}
                            <GradientLine />
                        </h3>
                        <div className="space-y-3" dir="ltr">
                            <div className="flex items-center gap-2">
                                <img src="/images/icon-location.png" alt="Location" title="Location" loading="lazy" className="w-5 h-5 flex-shrink-0" />
                                <p className={`text-gray-500 dark:text-gray-400 text-[11px] md:text-xs lg:text-sm ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}>
                                    {t('address')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src="/images/icon-phone.png" alt="Phone" title="Phone" loading="lazy" className="w-5 h-5 flex-shrink-0" />
                                <a href={`tel:${t('phone')}`} className={`text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-[11px] md:text-xs lg:text-sm transition-colors ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}>
                                    {t('phone')}
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src="/images/icon-email.png" alt="Email" title="Email" loading="lazy" className="w-5 h-5 flex-shrink-0" />
                                <a href={`mailto:${t('email')}`} className={`text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-[11px] md:text-xs lg:text-sm transition-colors ${
                                    isArabic ? 'font-tajawal font-bold' : 'font-poppins font-light'
                                }`}>
                                    {t('email')}
                                </a>
                            </div>
                        </div>
                        {/* Social Icons */}
                        <div className="flex items-center gap-2 mt-4" dir="ltr">
                            <a href="https://x.com/hardrock_agency" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Follow HardRock on Twitter">
                                <img src="/images/social-twitter.png" alt="Twitter" title="Twitter" loading="lazy" className="w-5 h-5 md:w-6 md:h-6" />
                            </a>
                            <a href="https://www.linkedin.com/company/hardrock-agency/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Follow HardRock on LinkedIn">
                                <img src="/images/social-linkedin.png" alt="LinkedIn" title="LinkedIn" loading="lazy" className="w-5 h-5 md:w-6 md:h-6" />
                            </a>
                            <a href="https://www.snapchat.com/add/hardrock_agency" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Follow HardRock on Snapchat">
                                <img src="/images/social-snapchat.png" alt="Snapchat" title="Snapchat" loading="lazy" className="w-5 h-5 md:w-6 md:h-6" />
                            </a>
                            <a href="https://www.instagram.com/hardrock_agency/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Follow HardRock on Instagram">
                                <img src="/images/social-instagram.png" alt="Instagram" title="Instagram" loading="lazy" className="w-5 h-5 md:w-6 md:h-6" />
                            </a>
                            <a href="https://web.facebook.com/profile.php?id=61584916708775" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Follow HardRock on Facebook">
                                <img src="/images/social-facebook.png" alt="Facebook" title="Facebook" loading="lazy" className="w-5 h-5 md:w-6 md:h-6" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright Bar with Logo */}
                <div className="mt-12 md:mt-16 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center gap-4">
                    <Link href="/">
                        <img
                            src="/images/logo-white.png"
                            alt="HardRock" title="HardRock"
                            className="h-10 md:h-12 w-auto hidden dark:block"
                        />
                        <img
                            src="/images/logo-black.webp"
                            alt="HardRock" title="HardRock"
                            className="h-10 md:h-12 w-auto block dark:hidden"
                        />
                    </Link>
                    <p className={`text-gray-400 dark:text-gray-500 text-xs ${
                        isArabic ? 'font-tajawal font-light' : 'font-poppins font-light'
                    }`}>
                        {t('copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
