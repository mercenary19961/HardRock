import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRef } from 'react';

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Aurora Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
                <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-purple-500/20 blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute -top-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute -bottom-[40%] left-[20%] w-[70%] h-[70%] rounded-full bg-pink-500/20 blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            </div>

            <motion.div 
                style={{ y, opacity }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20 backdrop-blur-sm"
                >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-medium">Next Gen Marketing & AI Solutions</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-8xl font-bold tracking-tight text-foreground mb-8 leading-tight"
                >
                    Elevate Your Brand with <br />
                    <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300%">
                        Intelligent Marketing
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    We combine creative storytelling with cutting-edge AI technology to deliver data-driven marketing strategies that scale.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                    <button className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)]">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative flex items-center gap-2">
                            Start Your Journey
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                    <button className="px-8 py-4 bg-background border border-border text-foreground rounded-full font-medium text-lg hover:bg-muted transition-all hover:scale-105">
                        View Case Studies
                    </button>
                </motion.div>
            </motion.div>
            
            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full p-1">
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mx-auto animate-bounce" />
                </div>
            </motion.div>
        </section>
    );
}
