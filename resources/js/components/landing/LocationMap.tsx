import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MapPinIcon = ({ className }: { className?: string }) => (
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
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
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
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
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
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
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
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export default function LocationMap() {
    const { t, i18n } = useTranslation('common');
    const isArabic = i18n.language === 'ar';

    // Google Maps embed URL - Amman, Jordan (Map view)
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.5!2d35.84856305260722!3d31.99276407247539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU5JzM0LjAiTiAzNcKwNTAnNTQuOCJF!5e0!3m2!1sen!2sjo!4v1700000000000";

    const contactInfo = [
        {
            icon: MapPinIcon,
            label: t('location.address', 'Address'),
            value: t('location.addressValue', 'Amman, Jordan'),
            href: 'https://maps.app.goo.gl/6mK9yKbDoU7UW82a9'
        },
        {
            icon: PhoneIcon,
            label: t('location.phone', 'Phone'),
            value: '+962 79 170 0034',
            href: 'tel:+962791700034'
        },
        {
            icon: MailIcon,
            label: t('location.email', 'Email'),
            value: 'sales@hardrock-co.com',
            href: 'mailto:sales@hardrock-co.com'
        },
        {
            icon: ClockIcon,
            label: t('location.hours', 'Working Hours'),
            value: t('location.hoursValue', 'Sun - Thu: 9AM - 5PM'),
            href: null
        }
    ];

    return (
        <section id="location" className="relative w-full h-[500px] md:h-[600px]">
            {/* Full-width Google Map */}
            <div className="absolute inset-0">
                <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="HardRock Location"
                    className="w-full h-full grayscale-[30%] dark:grayscale-[50%] dark:opacity-80"
                />

                {/* Gradient overlay for better card visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent dark:from-black/60 pointer-events-none" />
            </div>

            {/* Floating Info Card */}
            <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className={`absolute top-1/2 -translate-y-1/2 md:top-auto md:translate-y-0 md:bottom-8 lg:bottom-12 ${isArabic ? 'right-4 sm:right-6 lg:right-8' : 'left-4 sm:left-6 lg:left-8'}`}
                    dir={isArabic ? 'rtl' : 'ltr'}
                >
                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 max-w-sm">
                        {/* Card Header */}
                        <div className="mb-6">
                            <h3 className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 ${isArabic ? 'font-tajawal' : 'font-sf-pro'}`}>
                                {t('location.title', 'Find Us')}
                            </h3>
                            <div className="w-16 h-1 bg-gradient-to-r from-brand-purple to-brand-red rounded-full" />
                        </div>

                        {/* Contact Info List */}
                        <div className="space-y-4">
                            {contactInfo.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple/10 to-brand-red/10 flex items-center justify-center">
                                        <item.icon className="w-5 h-5 text-brand-purple" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs text-gray-500 dark:text-gray-400 mb-0.5 ${isArabic ? 'font-tajawal' : 'font-poppins'}`}>
                                            {item.label}
                                        </p>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                target={item.href.startsWith('http') ? '_blank' : undefined}
                                                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                className={`text-sm md:text-base text-gray-900 dark:text-white hover:text-brand-purple dark:hover:text-brand-purple transition-colors ${isArabic ? 'font-tajawal' : 'font-poppins'}`}
                                            >
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p className={`text-sm md:text-base text-gray-900 dark:text-white ${isArabic ? 'font-tajawal' : 'font-poppins'}`}>
                                                {item.value}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Get Directions Button */}
                        <motion.a
                            href="https://maps.app.goo.gl/6mK9yKbDoU7UW82a9"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            viewport={{ once: true }}
                            className={`mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-purple to-brand-red text-white px-6 py-3 rounded-full text-sm md:text-base font-medium hover:shadow-lg hover:shadow-brand-purple/30 transition-all duration-300 ${isArabic ? 'font-tajawal' : 'font-poppins'}`}
                        >
                            <MapPinIcon className="w-4 h-4" />
                            {t('location.getDirections', 'Get Directions')}
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
