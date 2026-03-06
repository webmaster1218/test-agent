'use client';

import React from 'react';
import Chat from '@/components/chat/Chat';
import { getAgentTheme } from '@/lib/config/themes';
import { motion } from 'motion/react';
import { Stethoscope, Utensils } from 'lucide-react';

export default function AITestingSection() {
    const saludTheme = getAgentTheme('salud');
    const comidaTheme = getAgentTheme('comida');

    return (
        <section id="agentes" className="relative py-20 lg:py-32 overflow-hidden bg-[#030305] border-t border-white/5">
            <div className="absolute inset-0 z-0">
                {/* Background effects */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
                <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-brand-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#4229ff]/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-blue-500 font-bold tracking-[0.3em] uppercase text-[10px] mb-4"
                    >
                        Interacción en Tiempo Real
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold tracking-tighter"
                    >
                        PRUEBA NUESTROS AGENTES <span className="text-white/40 text-gradient">DE IA</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-white/60"
                    >
                        Experimenta el poder de la atención automatizada, inteligente y personalizada. Interactúa con nuestros agentes especializados a continuación.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
                    {/* Agent 1: Salud */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col relative group rounded-[2.5rem] p-[2px] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2C8082]/10 via-transparent to-[#2C8082]/5 rounded-[2.5rem] pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-70"></div>

                        <div
                            className="relative flex flex-col h-full bg-white/[0.02] backdrop-blur-2xl rounded-[2.4rem] border border-[#2C8082]/20 overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-[#2C8082]/40 group-hover:bg-[#2C8082]/10"
                            style={{
                                boxShadow: `0 0 40px -10px ${saludTheme.primary}40`,
                            } as React.CSSProperties}
                        >
                            {/* Header Section */}
                            <div className="p-6 sm:px-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent relative z-20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#2C8082]/20 border border-[#2C8082]/30 flex items-center justify-center text-[#2C8082] shadow-lg shadow-[#2C8082]/20 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-[#2C8082]/20 to-transparent"></div>
                                            <Stethoscope size={28} className="relative z-10" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white tracking-tight">Agente de Salud</h3>
                                            <p className="text-sm text-white/50 font-medium">Clínicas y Consultorios</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#2C8082]/10 px-3 py-1.5 rounded-full border border-[#2C8082]/20">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2C8082] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full bg-[#2C8082] h-2.5 w-2.5"></span>
                                        </span>
                                        <span className="text-[11px] font-bold text-[#2C8082] uppercase tracking-wider hidden sm:inline-block">Activo</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Section */}
                            <div className="flex-1 p-2 sm:p-4 relative">
                                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#2C8082]/5 to-transparent pointer-events-none"></div>
                                <div className="relative z-10 h-full min-h-[500px]">
                                    <Chat selectedAgent="salud" theme={saludTheme} />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Agent 2: Comida */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col relative group rounded-[2.5rem] p-[2px] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-bl from-[#FF6B35]/10 via-transparent to-[#FF6B35]/5 rounded-[2.5rem] pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-70"></div>

                        <div
                            className="relative flex flex-col h-full bg-white/[0.02] backdrop-blur-2xl rounded-[2.4rem] border border-[#FF6B35]/20 overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-[#FF6B35]/40 group-hover:bg-[#FF6B35]/10"
                            style={{
                                boxShadow: `0 0 40px -10px ${comidaTheme.primary}40`,
                            } as React.CSSProperties}
                        >
                            {/* Header Section */}
                            <div className="p-6 sm:px-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent relative z-20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/20 border border-[#FF6B35]/30 flex items-center justify-center text-[#FF6B35] shadow-lg shadow-[#FF6B35]/20 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B35]/20 to-transparent"></div>
                                            <Utensils size={28} className="relative z-10" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white tracking-tight">Agente de Comida</h3>
                                            <p className="text-sm text-white/50 font-medium">Restaurantes y Entregas</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#FF6B35]/10 px-3 py-1.5 rounded-full border border-[#FF6B35]/20">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full bg-[#FF6B35] h-2.5 w-2.5"></span>
                                        </span>
                                        <span className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-wider hidden sm:inline-block">Activo</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Section */}
                            <div className="flex-1 p-2 sm:p-4 relative">
                                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FF6B35]/5 to-transparent pointer-events-none"></div>
                                <div className="relative z-10 h-full min-h-[500px]">
                                    <Chat selectedAgent="comida" theme={comidaTheme} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
