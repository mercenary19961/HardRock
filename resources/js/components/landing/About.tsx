import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
    return (
        <section id="about" className="py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            We Are the Bridge Between <br />
                            <span className="text-primary">Creativity & Technology</span>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8">
                            Founded by a team of marketing veterans and Software Engineers, we understand that the future of brand growth lies in the intelligent application of data. We don't just run ads; we build systems that learn and adapt.
                        </p>

                        <div className="space-y-4">
                            {[
                                'Data-Driven Decision Making',
                                'Proprietary AI Algorithms',
                                'Award-Winning Creative Team',
                                '24/7 Performance Monitoring'
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    <span className="font-medium">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-primary/20 to-purple-500/20 p-1">
                            <div className="absolute inset-0 bg-card/50 backdrop-blur-3xl" />
                            <div className="relative h-full w-full bg-card rounded-xl flex items-center justify-center border border-border overflow-hidden">
                                <img 
                                    src="/images/team.png" 
                                    alt="Hard Rock Team" 
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
