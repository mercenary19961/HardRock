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
                        <div className={`flex items-center gap-3.5 text-[10.5px] font-bold tracking-[0.38em] uppercase text-[#8c16af] mb-7 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                            <div
                                className="h-px w-9 flex-shrink-0"
                                style={{ background: 'linear-gradient(90deg, #8B5CF6, #D946EF)', boxShadow: '0 0 8px rgba(139,92,246,0.6)' }}
                            />
                            <span className={isArabic ? 'font-tajawal' : ''}>{t('eyebrow')}</span>
                        </div>

                        {/* Headline */}
                        <h2
                            className={`font-bold leading-[1] tracking-[-0.03em] mb-9 pb-3 ${isArabic ? 'font-tajawal text-right' : 'font-sf-pro'}`}
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
                                    paddingBottom: '0.2em',
                                    filter: 'drop-shadow(0 0 8px rgba(102,10,219,0.25)) drop-shadow(0 0 16px rgba(255,60,43,0.12))',
                                }}
                            >
                                <span style={{
                                    background: 'linear-gradient(100deg, #660adb 0%, #ff3c2b 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>
                                    {t('headline.line2')}
                                </span>
                            </span>
                            <span
                                className="block relative"
                                style={{ fontSize: 'clamp(68px, 9vw, 145px)', paddingBottom: '0.2em' }}
                            >
                                {/* White outline — visible in empty areas */}
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0"
                                    style={{
                                        WebkitTextStroke: '1.5px rgba(203,213,225,0.75)',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {t('headline.line3')}
                                </span>
                                {/* Gradient sweep — covers white when filled */}
                                <span className="headline-hover-gradient">
                                    {t('headline.line3')}
                                </span>
                            </span>
                        </h2>

                        {/* Description */}
                        <p
                            className={`relative text-[15px] font-light leading-[1.85] text-white max-w-[480px] ${
                                isArabic ? 'pr-6 text-right font-tajawal' : 'pl-6'
                            }`}
                        >
                            <span
                                className={`absolute top-0 bottom-0 w-0.5 ${isArabic ? 'right-0' : 'left-0'}`}
                                style={{ background: 'linear-gradient(180deg, #8B5CF6, #D946EF, transparent)', boxShadow: '0 0 8px rgba(139,92,246,0.5)' }}
                            />
                            {t('heroDesc.part1')}
                            <strong className="text-[#660adb] font-medium">{t('heroDesc.bold1')}</strong>
                            {t('heroDesc.part2')}
                            <br /><br />
                            {t('heroDesc.part3')}
                            <strong className="font-medium text-[#660adb]">
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
                                    <span style={{ color: '#660adb' }}>
                                        {card.titleGrad}
                                    </span>
                                </div>

                                <p className={`relative text-[12.5px] font-light leading-[1.85] text-white ${isArabic ? 'font-tajawal text-right' : ''}`}>
                                    {card.body}
                                </p>
                            </MagicCard>
                        ))}
                    </MagicCardGrid>
                </div>

                {/* STATEMENT BAR */}
                <div
                    className={`group relative overflow-hidden  px-[40px] py-[28px] flex flex-col sm:flex-row items-center sm:justify-between ${isArabic ? 'sm:flex-row-reverse' : ''}`}
                    style={{ background: '#06060f' }}
                    onMouseMove={e => {
                        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const glow = (e.currentTarget as HTMLDivElement).querySelector<HTMLDivElement>('.statement-glow');
                        if (glow) {
                            glow.style.left = `${x}px`;
                            glow.style.top = `${y}px`;
                            glow.style.opacity = '1';
                        }
                    }}
                    onMouseLeave={e => {
                        const glow = (e.currentTarget as HTMLDivElement).querySelector<HTMLDivElement>('.statement-glow');
                        if (glow) glow.style.opacity = '0';
                    }}
                >
                    {/* Mouse-following glow */}
                    <div
                        className="statement-glow absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 w-[420px] h-[280px] rounded-full opacity-0 transition-opacity duration-500"
                        style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, rgba(217,70,239,0.07) 45%, transparent 70%)' }}
                    />

                    <p
                        className={`relative font-extrabold leading-[1.2] tracking-[-0.02em] text-[#f0f0ff] whitespace-nowrap ${isArabic ? 'font-tajawal text-right' : ''}`}
                        style={{ fontSize: 'clamp(16px, 1.8vw, 26px)' }}
                    >
                        {t('statement.before')}{' '}
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

                </div>
            </div>

        </section>
    );
}
