"use client";
import React from 'react';
import { Chrome, Layout, Music, Twitter, Check, Zap, Target, TrendingUp, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const Platforms: React.FC = () => {
  const platforms = [
    {
      name: 'Google Ads',
      icon: Chrome,
      color: 'from-blue-600 to-blue-800',
      shadow: 'shadow-blue-500/20',
      features: ['Anuncios de Búsqueda', 'Red de Display', 'Anuncios de Shopping', 'Anuncios en YouTube'],
      description: 'Dominamos el buscador más grande del mundo para capturar demanda activa.'
    },
    {
      name: 'Meta Ads',
      icon: Layout,
      color: 'from-purple-600 to-pink-600',
      shadow: 'shadow-purple-500/20',
      features: ['Anuncios en Facebook', 'Anuncios en Instagram', 'Anuncios en Messenger', 'Audience Network'],
      description: 'Segmentación psicográfica avanzada para generar deseo y comunidad.'
    },
    {
      name: 'Spotify Ads',
      icon: Music,
      color: 'from-green-600 to-emerald-800',
      shadow: 'shadow-green-500/20',
      features: ['Anuncios de Audio', 'Anuncios de Video', 'Anuncios en Podcasts', 'Segmentación Avanzada'],
      description: 'Conectamos tu marca con los oídos de tu audiencia en momentos clave.'
    },
    {
      name: 'X (Twitter) Ads',
      icon: Twitter,
      color: 'from-slate-800 to-black',
      shadow: 'shadow-slate-500/10',
      features: ['Tweets Promocionados', 'Tendencias', 'X Amplify', 'Takeover'],
      description: 'Conversación en tiempo real y posicionamiento de marca de alto nivel.'
    }
  ];

  return (
    <section id="capacidades" className="relative py-20 lg:py-32 bg-[#030305] overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
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
              className="text-4xl md:text-6xl font-bold tracking-tighter mb-8"
            >
              DOMINAMOS LAS <span className="text-white/40 text-gradient">PLATAFORMAS QUE IMPORTAN</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 max-w-xs text-sm leading-relaxed"
          >
            No disparamos a ciegas. Utilizamos datos y algoritmos para asegurar que cada impresión cuente.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br p-8 transition-all duration-500 border border-white/5",
                p.color,
                p.shadow
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 bg-white/10 w-fit p-4 rounded-2xl backdrop-blur-md border border-white/10">
                  <p.icon className="text-white" size={28} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{p.name}</h3>
                <p className="text-white/70 text-sm mb-8 leading-relaxed font-medium">
                  {p.description}
                </p>

                <ul className="space-y-3 mt-auto">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
                      <span className="text-xs font-bold uppercase tracking-wider">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats/Accents */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Target, title: 'Targeting de Precisión', desc: 'Llegamos al usuario exacto en el momento de compra.' },
            { icon: TrendingUp, title: 'Optimización Continua', desc: 'A/B testing diario para maximizar el rendimiento.' },
            { icon: Globe, title: 'Escalabilidad Global', desc: 'Capacidad para escalar marcas a nivel internacional.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex gap-4 p-6 rounded-3xl bg-white/5 border border-white/5"
            >
              <div className="text-blue-500 shrink-0">
                <item.icon size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Platforms;

