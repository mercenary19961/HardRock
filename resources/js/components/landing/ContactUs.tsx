import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useForm } from '@inertiajs/react';

interface FormData {
    personalName: string;
    companyName: string;
    phoneNumber: string;
    email: string;
    services: string[];
    moreDetails: string;
}

export default function ContactUs() {
    const { t, i18n } = useTranslation('contactUs');
    const { theme } = useTheme();
    const isArabic = i18n.language === 'ar';

    const { data, setData, post, processing, errors: inertiaErrors, reset, clearErrors } = useForm<FormData>({
        personalName: '',
        companyName: '',
        phoneNumber: '',
        email: '',
        services: [],
        moreDetails: '',
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showNotification, setShowNotification] = useState(false);

    // Merge Inertia errors with local errors
    const allErrors = { ...errors, ...inertiaErrors };

    // Validation functions
    const validatePersonalName = (name: string): string => {
        const trimmed = name.trim();
        if (!trimmed) return isArabic ? 'الاسم مطلوب' : 'Name is required';

        const names = trimmed.split(/\s+/);
        if (names.length < 2) {
            return isArabic ? 'يجب إدخال الاسم الأول والأخير' : 'First and last name required';
        }

        for (const n of names) {
            if (n.length < 2) {
                return isArabic ? 'كل اسم يجب أن يحتوي على حرفين على الأقل' : 'Each name must be at least 2 letters';
            }
        }

        return '';
    };

    const validateCompanyName = (name: string): string => {
        const trimmed = name.trim();
        if (trimmed && trimmed.length < 2) {
            return isArabic ? 'اسم الشركة يجب أن يحتوي على حرفين على الأقل' : 'Company name must be at least 2 letters';
        }
        return '';
    };

    const validatePhoneNumber = (phone: string): string => {
        const trimmed = phone.trim();
        if (!trimmed) return isArabic ? 'رقم الهاتف مطلوب' : 'Phone number is required';

        // International phone format: allows +, spaces, hyphens, parentheses, and digits
        // Minimum 7 digits, maximum 15 digits (E.164 standard)
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
        const digitsOnly = trimmed.replace(/\D/g, '');

        if (digitsOnly.length < 7 || digitsOnly.length > 15) {
            return isArabic ? 'رقم الهاتف غير صالح' : 'Invalid phone number';
        }

        if (!phoneRegex.test(trimmed)) {
            return isArabic ? 'رقم الهاتف غير صالح' : 'Invalid phone number';
        }

        return '';
    };

    const validateEmail = (email: string): string => {
        const trimmed = email.trim();
        if (!trimmed) return isArabic ? 'البريد الإلكتروني مطلوب' : 'Email is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            return isArabic ? 'البريد الإلكتروني غير صالح' : 'Invalid email address';
        }

        return '';
    };

    const validateField = (fieldName: string, value: string) => {
        let error = '';

        switch (fieldName) {
            case 'personalName':
                error = validatePersonalName(value);
                break;
            case 'companyName':
                error = validateCompanyName(value);
                break;
            case 'phoneNumber':
                error = validatePhoneNumber(value);
                break;
            case 'email':
                error = validateEmail(value);
                break;
        }

        setErrors(prev => ({
            ...prev,
            [fieldName]: error
        }));
    };

    const availableServices = [
        'Paid Ads',
        'Social Media',
        'SEO',
        'Branding',
        'PR Services',
        'Q&Q Research',
        'Software & AI Solutions',
        'Social Listening',
    ];

    const availableServicesAr = [
        'الحملات الإعلانية',
        'التواصل الاجتماعي',
        'الاستماع الرقمي',
        'البحث الكمي والنوعي',
        'العلاقات العامة',
        'العلامة التجارية',
        'تحسين محركات البحث',
        'حلول البرمجيات والذكاء الاصطناعي',
    ];

    const services = isArabic ? availableServicesAr : availableServices;

    const handleServiceToggle = (service: string) => {
        const isSelected = data.services.includes(service);
        const newServices = isSelected
            ? data.services.filter((s: string) => s !== service)
            : [service, ...data.services];
        setData('services', newServices);
    };

    const isFormValid = () => {
        // Check if required fields are filled
        if (!data.personalName.trim() || !data.phoneNumber.trim() || !data.email.trim()) {
            return false;
        }

        // Check if there are any validation errors (both local and server-side)
        if (allErrors.personalName || allErrors.companyName || allErrors.phoneNumber || allErrors.email) {
            return false;
        }

        // Validate fields that haven't been validated yet
        const nameError = validatePersonalName(data.personalName);
        const phoneError = validatePhoneNumber(data.phoneNumber);
        const emailError = validateEmail(data.email);
        const companyError = data.companyName ? validateCompanyName(data.companyName) : '';

        return !nameError && !phoneError && !emailError && !companyError;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid()) {
            const startTime = performance.now();
            console.log('[FORM] Submission started');

            post(route('contact.store'), {
                preserveScroll: true,
                preserveState: false,
                replace: true,
                onSuccess: () => {
                    const endTime = performance.now();
                    const duration = Math.round(endTime - startTime);
                    console.log(`[FORM] Submission completed in ${duration}ms`);

                    // Track Facebook Pixel Lead event
                    if (typeof window !== 'undefined' && (window as any).fbq) {
                        (window as any).fbq('track', 'Lead', {
                            content_name: 'Contact Form Submission',
                            content_category: 'Lead Generation',
                            value: data.services.length,
                            currency: 'USD'
                        });
                    }

                    // Clear all form data
                    reset();
                    setErrors({});
                    clearErrors();
                    setFocusedField(null);
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 5000);
                },
                onError: (errors) => {
                    const endTime = performance.now();
                    const duration = Math.round(endTime - startTime);
                    console.error(`[FORM] Submission failed after ${duration}ms:`, errors);
                }
            });
        }
    };

    return (
        <section
            id="contact-us"
            className="relative py-10 md:py-32 overflow-hidden bg-white dark:bg-black"
        >
            {/* Background Image - Position on far right/left edge, only half visible */}
            <div
                className="hidden lg:block absolute inset-y-0 pointer-events-none overflow-visible"
                style={{
                    width: '50%',
                    right: isArabic ? 'auto' : '-25%',
                    left: isArabic ? '-25%' : 'auto',
                }}
            >
                <div
                    className="w-full h-full bg-no-repeat bg-contain"
                    style={{
                        backgroundImage: 'url(/images/contact-us.webp)',
                        backgroundPosition: 'center center',
                        opacity: 1,
                    }}
                />
            </div>

            {/* Background Blurs */}
            <div className="absolute top-20 ltr:left-20 rtl:right-20 w-40 h-40 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-40 ltr:right-20 rtl:left-20 w-48 h-48 bg-pink-500/20 dark:bg-pink-500/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 ltr:right-1/3 rtl:left-1/3 w-32 h-32 bg-red-500/15 dark:bg-red-500/25 rounded-full blur-3xl" />

            <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className={`text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black mb-4 lg:mb-6 2xl:mb-16 ${
                        isArabic ? 'font-tajawal text-right' : 'font-sf-pro text-left'
                    }`}
                    style={isArabic ? {
                        lineHeight: '2',
                        overflow: 'visible',
                        display: 'block'
                    } : { lineHeight: '1.2' }}
                >
                    {isArabic ? (
                        <>
                            <span className="text-black dark:text-white">تواصـــــل </span>
                            <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">
                                معنا
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="text-black dark:text-white">CONTACT </span>
                            <span className="bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent">
                                US
                            </span>
                        </>
                    )}
                </motion.h1>

                <div className="grid lg:grid-cols-[40%_60%] xl:grid-cols-2 gap-12 lg:gap-6 xl:gap-16">
                    {/* Left Column - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className={isArabic ? 'lg:order-1' : 'lg:order-1'}
                    >
                        <form onSubmit={handleSubmit} className="space-y-9">
                            {/* Personal Name */}
                            <div className="relative">
                                <input
                                    type="text"
                                    id="personalName"
                                    name="personalName"
                                    value={data.personalName}
                                    onChange={(e) => {
                                        setData('personalName', e.target.value);
                                        clearErrors('personalName');
                                        if (allErrors.personalName) {
                                            validateField('personalName', e.target.value);
                                        }
                                    }}
                                    onFocus={() => setFocusedField('personalName')}
                                    onBlur={() => {
                                        validateField('personalName', data.personalName);
                                        if (!data.personalName) setFocusedField(null);
                                    }}
                                    className={`w-full bg-transparent py-4 px-0 outline-none transition-all duration-300 ${
                                        isArabic
                                            ? 'text-right font-tajawal font-normal'
                                            : 'text-left font-sf-pro-expanded font-thin'
                                    } text-black dark:text-white text-lg`}
                                    style={{
                                        border: 'none',
                                        borderTop: 'none',
                                        borderLeft: 'none',
                                        borderRight: 'none',
                                        borderBottom: allErrors.personalName
                                            ? '2px solid #c93727'
                                            : (focusedField === 'personalName' || data.personalName)
                                                ? '2px solid #704399'
                                                : theme === 'light' ? '2px solid #000000' : '2px solid #ffffff',
                                        outline: 'none',
                                        boxShadow: 'none',
                                    }}
                                />
                                <label
                                    htmlFor="personalName"
                                    className={`absolute transition-all duration-300 pointer-events-none ${
                                        focusedField === 'personalName' || data.personalName
                                            ? isArabic
                                                ? '-top-5 right-0 text-sm'
                                                : '-top-5 left-0 text-sm'
                                            : isArabic
                                                ? 'top-3 right-0'
                                                : 'top-3 left-0'
                                    } ${
                                        isArabic
                                            ? 'font-tajawal font-normal text-right'
                                            : 'font-sf-pro-expanded font-thin text-left'
                                    } ${
                                        focusedField === 'personalName' || data.personalName
                                            ? 'text-black dark:text-white'
                                            : 'text-gray-500 dark:text-gray-400'
                                    } text-lg`}
                                >
                                    {isArabic ? 'الاســــــــــــم :' : 'PERSONAL NAME :'}
                                </label>
                                {allErrors.personalName && (
                                    <p className={`mt-1 text-sm text-brand-red ${
                                        isArabic ? 'text-right font-tajawal' : 'text-left font-poppins'
                                    }`}>
                                        {allErrors.personalName}
                                    </p>
                                )}
                            </div>

                            {/* Company Name */}
                            <div className="relative">
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={data.companyName}
                                    onChange={(e) => {
                                        setData('companyName', e.target.value);
                                        clearErrors('companyName');
                                        if (allErrors.companyName) {
                                            validateField('companyName', e.target.value);
                                        }
                                    }}
                                    onFocus={() => setFocusedField('companyName')}
                                    onBlur={() => {
                                        validateField('companyName', data.companyName);
                                        if (!data.companyName) setFocusedField(null);
                                    }}
                                    className={`w-full bg-transparent py-4 px-0 outline-none transition-all duration-300 ${
                                        isArabic
                                            ? 'text-right font-tajawal font-normal'
                                            : 'text-left font-sf-pro-expanded font-thin'
                                    } text-black dark:text-white text-lg`}
                                    style={{
                                        border: 'none',
                                        borderTop: 'none',
                                        borderLeft: 'none',
                                        borderRight: 'none',
                                        borderBottom: allErrors.companyName
                                            ? '2px solid #c93727'
                                            : (focusedField === 'companyName' || data.companyName)
                                                ? '2px solid #704399'
                                                : theme === 'light' ? '2px solid #000000' : '2px solid #ffffff',
                                        outline: 'none',
                                        boxShadow: 'none',
                                    }}
                                />
                                <label
                                    htmlFor="companyName"
                                    className={`absolute transition-all duration-300 pointer-events-none ${
                                        focusedField === 'companyName' || data.companyName
                                            ? isArabic
                                                ? '-top-5 right-0 text-sm'
                                                : '-top-5 left-0 text-sm'
                                            : isArabic
                                                ? 'top-3 right-0'
                                                : 'top-3 left-0'
                                    } ${
                                        isArabic
                                            ? 'font-tajawal font-normal text-right'
                                            : 'font-sf-pro-expanded font-thin text-left'
                                    } ${
                                        focusedField === 'companyName' || data.companyName
                                            ? 'text-black dark:text-white'
                                            : 'text-gray-500 dark:text-gray-400'
                                    } text-lg`}
                                >
                                    {isArabic ? 'اســـــــــم الشــــركـــة :' : 'COMPANY NAME :'}
                                </label>
                                {allErrors.companyName && (
                                    <p className={`mt-1 text-sm text-brand-red ${
                                        isArabic ? 'text-right font-tajawal' : 'text-left font-poppins'
                                    }`}>
                                        {allErrors.companyName}
                                    </p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="relative">
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={data.phoneNumber}
                                    onChange={(e) => {
                                        setData('phoneNumber', e.target.value);
                                        clearErrors('phoneNumber');
                                        if (allErrors.phoneNumber) {
                                            validateField('phoneNumber', e.target.value);
                                        }
                                    }}
                                    onFocus={() => setFocusedField('phoneNumber')}
                                    onBlur={() => {
                                        validateField('phoneNumber', data.phoneNumber);
                                        if (!data.phoneNumber) setFocusedField(null);
                                    }}
                                    className={`w-full bg-transparent py-4 px-0 outline-none transition-all duration-300 ${
                                        isArabic
                                            ? 'text-right font-tajawal font-normal'
                                            : 'text-left font-sf-pro-expanded font-thin'
                                    } text-black dark:text-white text-lg`}
                                    style={{
                                        border: 'none',
                                        borderTop: 'none',
                                        borderLeft: 'none',
                                        borderRight: 'none',
                                        borderBottom: allErrors.phoneNumber
                                            ? '2px solid #c93727'
                                            : (focusedField === 'phoneNumber' || data.phoneNumber)
                                                ? '2px solid #704399'
                                                : theme === 'light' ? '2px solid #000000' : '2px solid #ffffff',
                                        outline: 'none',
                                        boxShadow: 'none',
                                    }}
                                />
                                <label
                                    htmlFor="phoneNumber"
                                    className={`absolute transition-all duration-300 pointer-events-none ${
                                        focusedField === 'phoneNumber' || data.phoneNumber
                                            ? isArabic
                                                ? '-top-5 right-0 text-sm'
                                                : '-top-5 left-0 text-sm'
                                            : isArabic
                                                ? 'top-3 right-0'
                                                : 'top-3 left-0'
                                    } ${
                                        isArabic
                                            ? 'font-tajawal font-normal text-right'
                                            : 'font-sf-pro-expanded font-thin text-left'
                                    } ${
                                        focusedField === 'phoneNumber' || data.phoneNumber
                                            ? 'text-black dark:text-white'
                                            : 'text-gray-500 dark:text-gray-400'
                                    } text-lg`}
                                >
                                    {isArabic ? 'رقـــــم الهـــاتــف :' : 'PHONE NUMBER :'}
                                </label>
                                {allErrors.phoneNumber && (
                                    <p className={`mt-1 text-sm text-brand-red ${
                                        isArabic ? 'text-right font-tajawal' : 'text-left font-poppins'
                                    }`}>
                                        {allErrors.phoneNumber}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => {
                                        setData('email', e.target.value);
                                        clearErrors('email');
                                        if (allErrors.email) {
                                            validateField('email', e.target.value);
                                        }
                                    }}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => {
                                        validateField('email', data.email);
                                        if (!data.email) setFocusedField(null);
                                    }}
                                    className={`w-full bg-transparent py-4 px-0 outline-none transition-all duration-300 ${
                                        isArabic
                                            ? 'text-right font-tajawal font-normal'
                                            : 'text-left font-sf-pro-expanded font-thin'
                                    } text-black dark:text-white text-lg`}
                                    style={{
                                        border: 'none',
                                        borderTop: 'none',
                                        borderLeft: 'none',
                                        borderRight: 'none',
                                        borderBottom: allErrors.email
                                            ? '2px solid #c93727'
                                            : (focusedField === 'email' || data.email)
                                                ? '2px solid #704399'
                                                : theme === 'light' ? '2px solid #000000' : '2px solid #ffffff',
                                        outline: 'none',
                                        boxShadow: 'none',
                                    }}
                                />
                                <label
                                    htmlFor="email"
                                    className={`absolute transition-all duration-300 pointer-events-none ${
                                        focusedField === 'email' || data.email
                                            ? isArabic
                                                ? '-top-5 right-0 text-sm'
                                                : '-top-5 left-0 text-sm'
                                            : isArabic
                                                ? 'top-3 right-0'
                                                : 'top-3 left-0'
                                    } ${
                                        isArabic
                                            ? 'font-tajawal font-normal text-right'
                                            : 'font-sf-pro-expanded font-thin text-left'
                                    } ${
                                        focusedField === 'email' || data.email
                                            ? 'text-black dark:text-white'
                                            : 'text-gray-500 dark:text-gray-400'
                                    } text-lg`}
                                >
                                    {isArabic ? 'البريد الإلكترونــــــي :' : 'E-MAIL :'}
                                </label>
                                {allErrors.email && (
                                    <p className={`mt-1 text-sm text-brand-red ${
                                        isArabic ? 'text-right font-tajawal' : 'text-left font-poppins'
                                    }`}>
                                        {allErrors.email}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button - Hidden on mobile, shown on large screens */}
                            <div className="hidden lg:flex justify-center">
                                <button
                                    type="submit"
                                    disabled={!isFormValid() || processing}
                                    className={`relative w-2/4 py-6 px-8 rounded-full text-2xl transition-all duration-300 ${
                                        isFormValid() && !processing
                                            ? 'bg-gradient-to-r from-brand-purple to-brand-red text-white cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-brand-purple/50 active:scale-95 animate-pulse-glow'
                                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                                    } ${
                                        isArabic
                                            ? 'font-tajawal font-extrabold'
                                            : 'font-poppins font-bold'
                                    }`}
                                >
                                    {processing
                                        ? (isArabic ? 'جاري الإرسال...' : 'SUBMITTING...')
                                        : (isArabic ? 'قــــــــدّم' : 'SUBMIT')
                                    }
                                </button>
                            </div>

                            <style dangerouslySetInnerHTML={{
                                __html: `
                                    @keyframes pulse-glow {
                                        0%, 100% {
                                            box-shadow: 0 0 20px rgba(112, 67, 153, 0.4), 0 0 40px rgba(201, 55, 39, 0.2);
                                        }
                                        50% {
                                            box-shadow: 0 0 30px rgba(112, 67, 153, 0.6), 0 0 60px rgba(201, 55, 39, 0.3);
                                        }
                                    }
                                    .animate-pulse-glow {
                                        animation: pulse-glow 2s ease-in-out infinite;
                                    }
                                `
                            }} />
                        </form>
                    </motion.div>

                    {/* Right Column - Services */}
                    <motion.div
                        initial={{ opacity: 0, x: isArabic ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className={`${isArabic ? 'lg:order-2' : 'lg:order-2'} relative`}
                    >
                        {/* Services and More Details Container */}
                        <div className={`relative z-10 space-y-5 md:space-y-5 lg:space-y-7 xl:space-y-9 ${
                            isArabic ? 'ml-0 md:ml-32 lg:ml-40 xl:ml-48' : 'mr-0 md:mr-32 lg:mr-40 xl:mr-52'
                        }`}>
                            {/* Services Section */}
                            <div>
                                <h2
                                    className={`text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl mb-6 ${
                                        isArabic
                                            ? 'font-tajawal font-normal text-right'
                                            : 'font-sf-pro-expanded font-light text-left'
                                    } text-black dark:text-white`}
                                >
                                    {isArabic ? 'الخدمات المهتم بها؟' : 'Services you are looking for?'}
                                </h2>
                                <div className="flex flex-wrap gap-0.5 sm:gap-1 lg:gap-1 xl:gap-2 2xl:gap-3">
                                    {services.map((service) => {
                                        const isSelected = data.services.includes(service);
                                        return (
                                            <span
                                                key={service}
                                                onClick={() => handleServiceToggle(service)}
                                                className={`cursor-pointer transition-all duration-300 px-3 py-1.5 lg:px-3 lg:py-2 xl:px-4 xl:py-2 rounded-full text-sm lg:text-sm xl:text-base ${
                                                    isArabic
                                                        ? 'font-tajawal font-normal'
                                                        : 'font-poppins font-normal'
                                                } ${
                                                    isSelected
                                                        ? 'text-white bg-gradient-to-r from-brand-purple/70 to-brand-red/70'
                                                        : 'text-black dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                                }`}
                                            >
                                                {service}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* More Details Section */}
                            <div>
                                <h2
                                    className={`text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl mb-6 ${
                                        isArabic
                                            ? 'font-tajawal font-normal text-right'
                                            : 'font-sf-pro-expanded font-light text-left'
                                    } text-black dark:text-white`}
                                >
                                    {isArabic ? 'ملاحظـــــــــات:' : 'More Details:'}
                                </h2>
                                <div
                                    className={`relative rounded-[3rem] p-[1px] transition-all duration-300 ${
                                        (focusedField === 'moreDetails' || data.moreDetails)
                                            ? 'bg-brand-purple'
                                            : 'bg-black dark:bg-white'
                                    }`}
                                >
                                    <div className="bg-white dark:bg-black rounded-[3rem] p-6">
                                        <textarea
                                            id="moreDetails"
                                            name="moreDetails"
                                            value={data.moreDetails}
                                            onChange={(e) =>
                                                setData('moreDetails', e.target.value)
                                            }
                                            onFocus={() => setFocusedField('moreDetails')}
                                            onBlur={() => setFocusedField(null)}
                                            rows={6}
                                            placeholder={isArabic ? 'أخبرنا بالمزيد عن مشروعك...' : 'Tell us more about your project...'}
                                            className={`w-full bg-transparent outline-none resize-none border-0 ${
                                                isArabic
                                                    ? 'font-tajawal font-light text-right'
                                                    : 'font-poppins font-light text-left'
                                            } text-black dark:text-white text-base placeholder-gray-400 dark:placeholder-gray-500`}
                                            style={{ border: 'none', boxShadow: 'none' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Submit Button for Mobile - Only shown on small screens */}
                <div className="lg:hidden flex justify-center mt-12">
                    <button
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            const form = document.querySelector('form');
                            if (form && !processing) {
                                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                                form.dispatchEvent(submitEvent);
                            }
                        }}
                        disabled={!isFormValid() || processing}
                        className={`relative w-2/4 py-6 px-8 rounded-full text-2xl transition-all duration-300 ${
                            isFormValid() && !processing
                                ? 'bg-gradient-to-r from-brand-purple to-brand-red text-white cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-brand-purple/50 active:scale-95 animate-pulse-glow'
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                        } ${
                            isArabic
                                ? 'font-tajawal font-extrabold'
                                : 'font-poppins font-bold'
                        }`}
                    >
                        {processing
                            ? (isArabic ? 'جاري الإرسال...' : 'SUBMITTING...')
                            : (isArabic ? 'قــــــــدّم' : 'SUBMIT')
                        }
                    </button>
                </div>
            </div>

            {/* Success Notification Toast */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
                    >
                        <div className="bg-gradient-to-r from-brand-purple to-brand-red p-1 rounded-2xl shadow-2xl">
                            <div className="bg-white dark:bg-black rounded-2xl p-6 flex items-center gap-4">
                                {/* Success Icon */}
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-brand-purple to-brand-red rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>

                                {/* Message */}
                                <div className="flex-1">
                                    <h3 className={`font-bold text-lg mb-1 text-black dark:text-white ${
                                        isArabic ? 'font-tajawal text-right' : 'font-poppins text-left'
                                    }`}>
                                        {isArabic ? 'تم الإرسال بنجاح!' : 'Successfully Submitted!'}
                                    </h3>
                                    <p className={`text-sm text-gray-600 dark:text-gray-400 ${
                                        isArabic ? 'font-tajawal text-right' : 'font-poppins text-left'
                                    }`}>
                                        {isArabic
                                            ? 'سنتواصل معك قريباً'
                                            : "We'll get back to you soon"}
                                    </p>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => setShowNotification(false)}
                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <svg
                                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: 5, ease: 'linear' }}
                            className="h-1 bg-gradient-to-r from-brand-purple to-brand-red rounded-full mt-2 origin-left"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
