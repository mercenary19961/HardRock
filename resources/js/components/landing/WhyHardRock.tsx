import { useTranslation } from 'react-i18next';
import { useInView } from '@/hooks/useInView';
import { MagicCardGrid, MagicCard } from '@/components/ui/MagicCard';

export default function WhyHardRock() {
    const { t, i18n } = useTranslation('whyHardRock');
    const isArabic = i18n.language === 'ar';
    const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.15 });
    const [cardsRef, cardsInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
    const cards = t('cards', { returnObjects: true }) as Array<{
        num: string;
        titleBefore: string;
        titleGrad: string;
        body: string;
    }>;

    return (
        <section id="why-hardrock" className="relative overflow-hidden bg-[#06060f]">

            {/* ─── INNER ─── */}
            <div className="relative z-10 w-full px-6 sm:px-12 lg:px-8 xl:px-16 pt-24">

                {/* HERO ROW */}
                <div
                    ref={heroRef}
                    className={`grid lg:grid-cols-2 gap-10 items-center mb-20 transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    {/* Text */}
                    <div className={isArabic ? 'lg:order-2' : 'lg:order-1'}>
                        {/* Eyebrow */}
                        <div className={`flex items-center gap-3.5 text-[10.5px] font-bold tracking-[0.38em] uppercase text-[#a78bfa] mb-7 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                            <div
                                className="h-px w-9 flex-shrink-0"
                                style={{ background: 'linear-gradient(90deg, #8B5CF6, #D946EF)', boxShadow: '0 0 8px rgba(139,92,246,0.6)' }}
                            />
                            <span className={isArabic ? 'font-tajawal' : ''}>{t('eyebrow')}</span>
                        </div>

                        {/* Headline */}
                        <h2
                            className={`font-black leading-[1] tracking-[-0.03em] mb-9 pb-3 ${isArabic ? 'font-tajawal text-right' : ''}`}
                            style={{ fontSize: 'clamp(60px, 8vw, 130px)' }}
                        >
                            <span
                                className="block text-[#f0f0ff]"
                                style={{ textShadow: '0 0 60px rgba(139,92,246,0.25)' }}
                            >
                                {t('headline.line1')}
                            </span>
                            <span
                                className="block"
                                style={{
                                    background: 'linear-gradient(100deg, #8B5CF6 0%, #D946EF 50%, #F43F5E 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    filter: 'drop-shadow(0 0 24px rgba(139,92,246,0.55))',
                                    paddingBottom: '0.2em',
                                }}
                            >
                                {t('headline.line2')}
                            </span>
                            <span
                                className="block headline-hover-gradient"
                                style={{
                                    fontSize: 'clamp(68px, 9vw, 145px)',
                                    paddingBottom: '0.2em',
                                }}
                            >
                                {t('headline.line3')}
                            </span>
                        </h2>

                        {/* Description */}
                        <p
                            className={`relative text-[15px] font-light leading-[1.85] text-[#8888b0] max-w-[480px] ${
                                isArabic ? 'pr-6 text-right font-tajawal' : 'pl-6'
                            }`}
                        >
                            <span
                                className={`absolute top-0 bottom-0 w-0.5 ${isArabic ? 'right-0' : 'left-0'}`}
                                style={{ background: 'linear-gradient(180deg, #8B5CF6, #D946EF, transparent)', boxShadow: '0 0 8px rgba(139,92,246,0.5)' }}
                            />
                            {t('heroDesc.part1')}
                            <strong className="text-[#c4b5fd] font-medium">{t('heroDesc.bold1')}</strong>
                            {t('heroDesc.part2')}
                            <br /><br />
                            {t('heroDesc.part3')}
                            <strong className="font-medium text-[#c4b5fd]">
                                {t('heroDesc.bold2Before')}
                                <span className="animate-gradient-text font-bold">{t('heroDesc.bold2You')}</span>
                                {t('heroDesc.bold2After')}
                            </strong>
                            {t('heroDesc.part4')}
                        </p>
                    </div>

                    {/* Image */}
                    <div className={`relative flex items-center justify-center h-[820px] ${isArabic ? 'lg:order-1' : 'lg:order-2'}`}>
                        <img
                            src="/images/why-hardrock.webp"
                            alt="Why HardRock"
                            loading="lazy"
                            className="absolute z-[2] object-contain"
                            style={{ width: '90%', height: 'auto' }}
                        />
                    </div>

                </div>

                {/* Glow divider */}
                <div
                    className="h-px mb-[72px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.5) 25%, rgba(217,70,239,0.5) 60%, rgba(244,63,94,0.3) 80%, transparent 100%)',
                        boxShadow: '0 0 12px rgba(139,92,246,0.25)',
                    }}
                />

                {/* CARDS */}
                <div
                    ref={cardsRef}
                    className={`transition-all duration-700 delay-100 ${cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    {/* Single animated bar spanning all four cards */}
                    <div className="relative h-0.5 overflow-hidden">
                        <div className="card-top-bar-inner" />
                    </div>

                    <MagicCardGrid
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] mb-px"
                        spotlightRadius={450}
                    >
                        {cards.map((card, i) => (
                            <MagicCard
                                key={i}
                                className="group relative bg-[#06060f] p-9 overflow-hidden"
                            >
                                <div
                                    className="relative text-[10px] font-bold tracking-[0.25em] mb-5"
                                    style={{ background: 'linear-gradient(90deg, #8B5CF6, #D946EF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                                >
                                    {card.num}
                                </div>

                                <div className={`relative text-[17px] font-bold leading-[1.3] mb-3.5 tracking-[-0.01em] text-[#f0f0ff] ${isArabic ? 'font-tajawal text-right' : ''}`}>
                                    {card.titleBefore}
                                    <br />
                                    <span style={{ background: 'linear-gradient(90deg, #a78bfa, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                        {card.titleGrad}
                                    </span>
                                </div>

                                <p className={`relative text-[12.5px] font-light leading-[1.85] text-[rgba(160,160,200,0.75)] ${isArabic ? 'font-tajawal text-right' : ''}`}>
                                    {card.body}
                                </p>
                            </MagicCard>
                        ))}
                    </MagicCardGrid>
                </div>

                {/* STATEMENT BAR */}
                <div
                    className={`relative overflow-hidden border border-[rgba(139,92,246,0.2)] border-t-0 p-[56px] flex flex-col sm:flex-row items-center gap-10 sm:gap-14 ${isArabic ? 'sm:flex-row-reverse' : ''}`}
                    style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(217,70,239,0.06) 50%, rgba(244,63,94,0.04) 100%)' }}
                >
                    <div
                        className="absolute w-[500px] h-[300px] rounded-full pointer-events-none -top-24 -left-24"
                        style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 65%)' }}
                    />

                    <p
                        className={`relative font-extrabold leading-[1.2] tracking-[-0.02em] text-[#f0f0ff] ${isArabic ? 'font-tajawal text-right' : ''}`}
                        style={{ fontSize: 'clamp(24px, 2.8vw, 38px)' }}
                    >
                        {t('statement.before')}
                        <br />
                        {t('statement.weAre')}
                        <span style={{
                            background: 'linear-gradient(90deg, #8B5CF6, #D946EF, #F43F5E)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 16px rgba(139,92,246,0.4))',
                        }}>
                            {t('statement.grad')}
                        </span>
                    </p>

                    {/* Spinning badge */}
                    <div className="flex-shrink-0 relative w-[120px] h-[120px]">
                        <div
                            className="absolute inset-0 rounded-full animate-orbit-slow"
                            style={{
                                background: 'conic-gradient(#8B5CF6, #D946EF, #F43F5E, #8B5CF6)',
                                WebkitMask: 'radial-gradient(circle, transparent 53px, black 54px)',
                                mask: 'radial-gradient(circle, transparent 53px, black 54px)',
                                boxShadow: '0 0 20px rgba(139,92,246,0.4)',
                            }}
                        />
                        <div
                            className="absolute inset-0 flex items-center justify-center text-[8px] font-bold tracking-[0.12em] uppercase text-center leading-[1.7]"
                            style={{ background: 'linear-gradient(135deg, #a78bfa, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                        >
                            Digital<br />AI · SEO<br />Growth<br />Marketing
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
