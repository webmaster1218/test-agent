"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Bot, LineChart, Code2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const services = [
    {
        title: 'Inteligencia Artificial',
        icon: Bot,
        color: 'from-blue-500 to-cyan-500',
        description: 'Automatizamos tu atención al cliente y procesos operativos con agentes de IA 24/7. Respuestas inteligentes, agendamiento y retención sin intervención humana.',
        features: ['Agentes Conversacionales', 'Automatización de Tareas', 'Análisis Predictivo']
    },
    {
        title: 'Marketing Digital',
        icon: LineChart,
        color: 'from-purple-500 to-pink-500',
        description: 'Estrategias de Growth Marketing centradas en el retorno de inversión. Adquisición de clientes escalable mediante campañas hiper-segmentadas.',
        features: ['Performance Marketing', 'Gestión de Pauta (Ads)', 'SEO & Posicionamiento']
    },
    {
        title: 'Desarrollo Digital',
        icon: Code2,
        color: 'from-emerald-500 to-teal-500',
        description: 'Construimos el núcleo visual y tecnológico de tu marca. Diseño web premium, e-commerce y desarrollo de software a medida para escalar sin límites.',
        features: ['Desarrollo Web & App', 'E-commerce', 'UX/UI Design']
    }
];

const Services: React.FC = () => {
    return (
        <section id="servicios" className="relative py-20 lg:py-32 bg-[#030305] overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-900/10 blur-[120px] -z-10 rounded-full" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-blue-500 font-bold tracking-[0.3em] uppercase text-[10px] mb-4"
                    >
                        Resultados Reales
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold tracking-tighter mb-8"
                    >
                        ECOSISTEMAS DIGITALES <br />
                        <span className="text-white/40 text-gradient">QUE MULTIPLICAN RESULTADOS</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto font-light"
                    >
                        Integrando tecnología de vanguardia, estrategias comprobadas y desarrollo de software robusto para llevar tu negocio al siguiente nivel.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {services.map((service, idx) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.04] hover:border-white/20 hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-2xl"
                        >
                            {/* Highlight gradient on hover */}
                            <div className={cn(
                                "absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-[2.5rem] bg-gradient-to-br",
                                service.color
                            )} />

                            {/* Top glow */}
                            <div className={cn(
                                "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br",
                                service.color
                            )} />

                            <div className="relative z-10">
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl mb-8 flex items-center justify-center bg-gradient-to-br relative overflow-hidden",
                                    service.color
                                )}>
                                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                                    <service.icon size={28} className="text-white relative z-10" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{service.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8 h-24">
                                    {service.description}
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {service.features.map(feature => (
                                        <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
