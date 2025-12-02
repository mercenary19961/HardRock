import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { BarChart3, Bot, Brain, Globe, Megaphone, Zap } from 'lucide-react';
import { MouseEvent } from 'react';
import { cn } from '@/lib/utils';

const services = [
    {
        title: 'AI Strategy',
        description: 'Leverage machine learning to predict trends and optimize campaigns.',
        icon: Brain,
        className: "md:col-span-2",
        gradient: "from-purple-500/20 to-blue-500/20"
    },
    {
        title: 'Digital Marketing',
        description: 'Full-service digital marketing campaigns that drive real ROI.',
        icon: Megaphone,
        className: "md:col-span-1",
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        title: 'Automation',
        description: 'Streamline your workflows with intelligent process automation.',
        icon: Bot,
        className: "md:col-span-1",
        gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
        title: 'Global Reach',
        description: 'Expand your brand presence across international markets.',
        icon: Globe,
        className: "md:col-span-2",
        gradient: "from-orange-500/20 to-red-500/20"
    },
    {
        title: 'Data Analytics',
        description: 'Deep insights into customer behavior and market performance.',
        icon: BarChart3,
        className: "md:col-span-1",
        gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
        title: 'Rapid Scaling',
        description: 'Growth hacking strategies designed for startups and scale-ups.',
        icon: Zap,
        className: "md:col-span-2",
        gradient: "from-yellow-500/20 to-amber-500/20"
    },
];

function ServiceCard({ service, index }: { service: typeof services[0], index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "group relative rounded-3xl border border-white/10 bg-card overflow-hidden",
                service.className
            )}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(255,255,255,0.1),
                            transparent 80%
                        )
                    `,
                }}
            />
            <div className="relative h-full p-8 flex flex-col justify-between z-10">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br", service.gradient)}>
                    <service.icon className="w-7 h-7 text-foreground" />
                </div>
                
                <div>
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </div>

                <div className="absolute bottom-0 right-0 p-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowRight className="w-6 h-6 text-primary" />
                </div>
            </div>
        </motion.div>
    );
}

import { ArrowRight } from 'lucide-react';

export default function Services() {
    return (
        <section id="services" className="py-32 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Our Expertise
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Comprehensive solutions bridging the gap between traditional marketing and artificial intelligence.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={service.title} service={service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
