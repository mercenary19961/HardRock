import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ServiceItem {
    slug: string;
    name: string;
}

// Map slugs to their image files
const SERVICE_IMAGES: Record<string, string> = {
    'social-media': '/images/services/social-media-2.webp',
    'paid-ads': '/images/services/paid-ads-2.webp',
    'seo': '/images/services/seo-2.webp',
    'pr-social-listening': '/images/services/pr-2.webp',
    'branding': '/images/services/branding-2.webp',
    'software-ai': '/images/services/ai-2.webp',
};

interface ExpandableServiceSelectorProps {
    services: ServiceItem[];
    currentSlug: string;
    onServiceChange: (slug: string) => void;
    isArabic?: boolean;
    isLightMode?: boolean;
    className?: string;
}

const ExpandableServiceSelector: React.FC<ExpandableServiceSelectorProps> = ({
    services,
    currentSlug,
    onServiceChange,
    isArabic = false,
    isLightMode = false,
    className = '',
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const getFlexValue = (index: number, slug: string) => {
        const isActive = slug === currentSlug;

        if (hoveredIndex === null) {
            return isActive ? 1.8 : 1;
        }
        if (hoveredIndex === index) {
            return 3;
        }
        return 0.6;
    };

    return (
        <>
            {/* Mobile: 3x2 Grid Layout */}
            <div className={`grid grid-cols-3 gap-2 md:hidden w-full max-w-lg mx-auto ${className}`}>
                {services.map((service, index) => {
                    const isActive = service.slug === currentSlug;
                    const isHovered = hoveredIndex === index;
                    const imageSrc = SERVICE_IMAGES[service.slug];

                    return (
                        <motion.button
                            key={service.slug}
                            className={`relative cursor-pointer overflow-hidden rounded-xl aspect-square ${
                                isArabic ? 'font-tajawal' : 'font-poppins'
                            } ${
                                isActive
                                    ? 'ring-2 ring-brand-purple shadow-lg shadow-brand-purple/30'
                                    : ''
                            } ${
                                isLightMode
                                    ? 'bg-white shadow-md'
                                    : 'shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-2px_rgba(255,255,255,0.1)]'
                            }`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => onServiceChange(service.slug)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Background */}
                            <div className={`absolute inset-0 ${isLightMode ? 'bg-white' : 'bg-black/90'}`} />

                            {/* Background Image */}
                            <div className="absolute inset-0 flex items-center justify-center p-2 pb-8">
                                <motion.img
                                    src={imageSrc}
                                    alt={service.name}
                                    className="max-w-full max-h-full object-contain"
                                    animate={{ scale: isHovered ? 1.1 : 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>

                            {/* Gradient overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${
                                isLightMode
                                    ? 'from-white via-white/30 to-transparent'
                                    : 'from-black via-black/30 to-transparent'
                            }`} />

                            {/* Text at bottom */}
                            <div className={`absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t ${
                                isLightMode ? 'from-white/90 to-transparent' : 'from-black/90 to-transparent'
                            }`}>
                                <span className={`block font-semibold text-center leading-tight text-[10px] ${
                                    isLightMode ? 'text-gray-900' : 'text-white'
                                }`}>
                                    {service.name}
                                </span>
                            </div>

                        </motion.button>
                    );
                })}
            </div>

            {/* Desktop: Expandable Flex Layout */}
            <div className={`hidden md:flex gap-3 h-64 lg:h-72 w-full max-w-6xl mx-auto ${className}`}>
                {services.map((service, index) => {
                    const isActive = service.slug === currentSlug;
                    const isHovered = hoveredIndex === index;
                    const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;
                    const imageSrc = SERVICE_IMAGES[service.slug];

                    return (
                        <motion.button
                            key={service.slug}
                            className={`relative cursor-pointer overflow-hidden rounded-2xl ${
                                isLightMode ? 'shadow-md' : 'shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-2px_rgba(255,255,255,0.1)]'
                            } ${
                                isArabic ? 'font-tajawal' : 'font-poppins'
                            } ${
                                isActive && !isOtherHovered
                                    ? 'ring-2 ring-brand-purple shadow-lg shadow-brand-purple/30'
                                    : ''
                            }`}
                            style={{ flex: 1 }}
                            animate={{
                                flex: getFlexValue(index, service.slug),
                                opacity: isOtherHovered ? 0 : 1,
                            }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => onServiceChange(service.slug)}
                        >
                            {/* Background - only for light mode */}
                            {isLightMode && (
                                <div className="absolute inset-0 bg-white" />
                            )}

                            {/* Background Image - centered and contained */}
                            <div className="absolute inset-0 flex items-center justify-center p-4 pb-16">
                                <motion.img
                                    src={imageSrc}
                                    alt={service.name}
                                    className="max-w-full max-h-full object-contain"
                                    animate={{
                                        scale: isHovered ? 1.1 : 1,
                                    }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                />
                            </div>

                            {/* Gradient overlay - only for light mode for text readability */}
                            {isLightMode && (
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent pointer-events-none" />
                            )}

                            {/* Text at bottom */}
                            <div className={`absolute bottom-0 left-0 right-0 p-2 md:p-3 ${
                                isLightMode ? 'bg-gradient-to-t from-white/90 to-transparent' : ''
                            }`}>
                                <motion.span
                                    className={`block font-semibold text-center leading-tight ${
                                        isLightMode ? 'text-gray-900' : 'text-white'
                                    }`}
                                    animate={{
                                        fontSize: isHovered ? '18px' : '12px',
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {service.name}
                                </motion.span>
                            </div>

                        </motion.button>
                    );
                })}
            </div>
        </>
    );
};

export default ExpandableServiceSelector;
