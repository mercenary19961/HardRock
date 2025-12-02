import { motion } from 'framer-motion';
import { Bot, Database, Layers, Cpu, Code2, Network } from 'lucide-react';

const capabilities = [
    {
        icon: Bot,
        title: "AI Agent Integration",
        description: "We don't just build chatbots; we embed intelligent agents directly into your UI. From customer support to complex workflow automation, our agents feel like a natural part of your application."
    },
    {
        icon: Database,
        title: "Dataset Schema Design",
        description: "The brain of an AI is its data. We architect structured, efficient dataset schemas and knowledge bases (RAG) that ensure your agents have the right context to make accurate decisions."
    },
    {
        icon: Layers,
        title: "Modern Tech Stack",
        description: "Built on a rock-solid foundation of Laravel and React (TypeScript). We utilize Tailwind CSS for beautiful, responsive designs that load instantly."
    },
    {
        icon: Cpu,
        title: "LLM & Vector Search",
        description: "Leveraging the power of Large Language Models and Vector Databases (like Pinecone or Weaviate) to create search experiences that understand intent, not just keywords."
    },
    {
        icon: Code2,
        title: "Future-Ready Libraries",
        description: "We stay ahead of the curve, integrating libraries like LangChain for complex reasoning and AutoGPT for autonomous task execution in future iterations."
    },
    {
        icon: Network,
        title: "Scalable Architecture",
        description: "Systems designed to grow. Whether it's microservices or modular monoliths, we build software that handles scale without breaking a sweat."
    }
];

export default function TechnicalCapabilities() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Technical <span className="text-primary">Excellence</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Beyond marketing, we are engineering experts. We build the sophisticated AI infrastructure and software that powers modern businesses.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {capabilities.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card border border-border p-6 rounded-xl hover:shadow-lg transition-shadow group"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <item.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
