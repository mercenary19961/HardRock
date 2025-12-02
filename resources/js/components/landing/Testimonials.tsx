

const testimonials = [
    {
        quote: "Hard Rock transformed our marketing strategy completely. The AI insights are game-changing for the Saudi market.",
        author: "Ahmed Al-Sayed",
        role: "CMO, Riyadh Tech",
        image: "/images/testimonials/ahmed.png"
    },
    {
        quote: "The ROI we've seen since partnering with them is incredible. Highly recommended for startups in Jordan.",
        author: "Layla Mahmoud",
        role: "Founder, Amman Innovations",
        image: "/images/testimonials/layla.png"
    },
    {
        quote: "Finally, an agency that understands both creativity and data. A perfect match for our expansion plans.",
        author: "Omar Khalid",
        role: "Director of Marketing, Jeddah Corp",
        image: "/images/testimonials/omar.png"
    },
    {
        quote: "Their automated workflows saved us hundreds of hours. The efficiency is unmatched in the region.",
        author: "Sara Al-Amri",
        role: "COO, Future Vision KSA",
        image: "/images/testimonials/sara.png"
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 overflow-hidden bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
                <p className="text-muted-foreground">Join hundreds of companies scaling with Hard Rock</p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-8 group-hover:paused">
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                        <div 
                            key={index}
                            className="w-[400px] p-8 rounded-2xl bg-muted/30 border border-border flex-shrink-0 whitespace-normal hover:border-primary/50 transition-colors"
                        >
                            <p className="text-lg mb-6">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-4">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.author} 
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="text-left">
                                    <h4 className="font-semibold">{testimonial.author}</h4>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-8 ml-8 group-hover:paused">
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                        <div 
                            key={index}
                            className="w-[400px] p-8 rounded-2xl bg-muted/30 border border-border flex-shrink-0 whitespace-normal hover:border-primary/50 transition-colors"
                        >
                            <p className="text-lg mb-6">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-4">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.author} 
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="text-left">
                                    <h4 className="font-semibold">{testimonial.author}</h4>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            </div>
        </section>
    );
}
