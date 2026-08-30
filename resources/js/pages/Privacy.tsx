import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, BarChart3, Megaphone, Cookie, Mail } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';
import { OPEN_CONSENT_EVENT } from '@/lib/consent';

/**
 * Privacy and cookie policy. The consent banner's "Learn more" link points here,
 * so this page has to exist for the banner to be lawful at all.
 *
 * Every string comes from resources/js/locales so EN and AR change together. The
 * section list is declared here rather than iterated blindly out of the bundle:
 * `t()` returns strings in this codebase (no returnObjects on this namespace), so
 * the bullet keys have to be named, and naming them means a dropped translation
 * shows up as a raw key instead of a silently missing paragraph.
 *
 * ⚠️ When the wording changes materially, bump POLICY_VERSION in
 * resources/js/lib/consent.ts and `privacy.updated` in both locale files. The
 * version is stored in the visitor's consent cookie; leaving it alone means
 * people stay recorded as having agreed to text they never saw.
 */
const SECTIONS = [
    { key: 'whoWeAre', points: [] },
    { key: 'whatWeCollect', points: ['contact', 'leads', 'technical'] },
    { key: 'whyWeUse', points: ['respond', 'campaigns', 'improve', 'secure'] },
    { key: 'cookies', points: [] },
    { key: 'sharing', points: ['hosting', 'email', 'workflow', 'advertising'] },
    { key: 'retention', points: ['enquiries', 'leads', 'analytics'] },
    { key: 'rights', points: ['access', 'correct', 'delete', 'withdraw'] },
    { key: 'security', points: [] },
    { key: 'changes', points: [] },
] as const;

/** Mirrors the three groups in the consent banner, so the labels cannot drift. */
const COOKIE_CATEGORIES = [
    { key: 'necessary', icon: ShieldCheck },
    { key: 'analytics', icon: BarChart3 },
    { key: 'marketing', icon: Megaphone },
] as const;

/**
 * Hardcoded English, mirroring the 'privacy' entry in app.blade.php $serviceSeo.
 * SSR emits a second <title> next to Blade's, so a translated or reworded title
 * here shows crawlers two different ones. Change both together.
 */
const PAGE_TITLE = 'Privacy & Cookie Policy | HardRock - Digital Marketing Agency Jordan';

export default function Privacy() {
    const { t, i18n } = useTranslation('privacy');
    const { t: tConsent } = useTranslation('consent');
    const { t: tFooter } = useTranslation('footer');
    const isArabic = i18n.language === 'ar';

    const headingFont = isArabic ? 'font-tajawal font-bold' : 'font-poppins font-semibold';
    const bodyFont = isArabic ? 'font-tajawal font-medium' : 'font-poppins font-light';

    const openConsent = () => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));

    return (
        <>
            {/* Description, OG tags and canonical for this URL are emitted by
                app.blade.php, which is also the copy that survives an SSR
                fallback. Adding them here would only duplicate the tags. */}
            <Head title={PAGE_TITLE} />

            <div className="min-h-screen bg-white dark:bg-black text-foreground font-sans antialiased">
                <Navbar />

                <main className="pt-20">
                    {/* Header. Not a full-viewport hero: this is a document, and
                        burying the first paragraph below the fold would be style
                        getting in the way. */}
                    <section className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-16 pt-12 pb-10 md:pt-16">
                        <p className={`mb-4 text-xs uppercase tracking-widest bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent ${headingFont}`}>
                            {t('label')}
                        </p>
                        <h1 className={`mb-6 text-3xl sm:text-4xl md:text-5xl leading-tight text-black dark:text-white ${headingFont}`}>
                            {t('title')}
                        </h1>
                        <p className={`mb-4 text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300 ${bodyFont}`}>
                            {t('intro')}
                        </p>
                        <p className={`text-sm text-gray-400 dark:text-gray-500 ${bodyFont}`}>{t('updated')}</p>

                        {/* A consent decision has to be revocable, and this is where
                            someone reading the policy looks for the switch. */}
                        <button
                            type="button"
                            onClick={openConsent}
                            className={`mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-purple to-brand-red px-6 py-3 text-sm sm:text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-brand-red/30 hover:scale-105 ${
                                isArabic ? 'font-tajawal font-bold' : 'font-poppins font-medium'
                            }`}
                        >
                            <Cookie size={18} />
                            {t('manageCookies')}
                        </button>
                    </section>

                    <section className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-16 pb-24">
                        <div className="space-y-12">
                            {SECTIONS.map(({ key, points }) => (
                                <div key={key}>
                                    <h2 className={`mb-4 text-xl sm:text-2xl leading-tight text-black dark:text-white ${headingFont}`}>
                                        {t(`sections.${key}.title`)}
                                    </h2>
                                    <p className={`leading-relaxed text-gray-600 dark:text-gray-300 ${bodyFont}`}>
                                        {t(`sections.${key}.body`)}
                                    </p>

                                    {points.length > 0 && (
                                        <ul className="mt-5 space-y-3">
                                            {points.map((point) => (
                                                <li key={point} className="flex items-start gap-3">
                                                    <span
                                                        aria-hidden="true"
                                                        className="mt-2 size-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand-purple to-brand-red"
                                                    />
                                                    <span className={`leading-relaxed text-gray-600 dark:text-gray-300 ${bodyFont}`}>
                                                        {t(`sections.${key}.points.${point}`)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* The cookie categories are the one part of this
                                        document a visitor acts on, so they get cards
                                        rather than another paragraph. */}
                                    {key === 'cookies' && (
                                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                            {COOKIE_CATEGORIES.map(({ key: category, icon: Icon }) => (
                                                <div
                                                    key={category}
                                                    className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-5"
                                                >
                                                    <span className="mb-3 inline-flex rounded-full bg-gradient-to-r from-brand-purple to-brand-red p-2.5 text-white">
                                                        <Icon size={18} />
                                                    </span>
                                                    <h3 className={`mb-2 text-black dark:text-white ${headingFont}`}>
                                                        {tConsent(`categories.${category}.label`)}
                                                    </h3>
                                                    <p className={`text-sm leading-relaxed text-gray-600 dark:text-gray-400 ${bodyFont}`}>
                                                        {tConsent(`categories.${category}.description`)}
                                                    </p>
                                                    <p className={`mt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-500 ${bodyFont}`}>
                                                        {tConsent(`categories.${category}.detail`)}
                                                    </p>
                                                    <p className={`mt-3 text-[11px] uppercase tracking-wider bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent ${headingFont}`}>
                                                        {t(`cookieTable.${category}`)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Contact. Kept out of SECTIONS because the address is
                                data (it lives in the footer namespace), not copy. */}
                            <div>
                                <h2 className={`mb-4 text-xl sm:text-2xl leading-tight text-black dark:text-white ${headingFont}`}>
                                    {t('sections.contact.title')}
                                </h2>
                                <p className={`leading-relaxed text-gray-600 dark:text-gray-300 ${bodyFont}`}>
                                    {t('sections.contact.body')}
                                </p>
                                <a
                                    href={`mailto:${tFooter('email')}`}
                                    className={`mt-5 inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-white/20 px-5 py-3 text-sm text-black dark:text-white transition-colors hover:border-brand-purple dark:hover:border-brand-red ${bodyFont}`}
                                >
                                    <Mail size={18} className="text-brand-purple dark:text-brand-red" />
                                    <span dir="ltr">{tFooter('email')}</span>
                                </a>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
                <WhatsAppButton />
                <CookieConsent />
            </div>
        </>
    );
}
