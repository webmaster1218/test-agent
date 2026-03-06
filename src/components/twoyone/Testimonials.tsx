"use client";

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

const testimonials = [
  {
    name: 'Carlos Mendoza',
    role: 'CEO, TechVision Solutions',
    company: 'Startup SaaS',
    text: 'Increíble trabajo. En solo 3 meses triplicamos nuestros prospectos cualificados. El equipo entiende perfectamente el ecosistema digital.',
    image: 'https://i.pravatar.cc/150?u=carlos',
    tag: 'Google Ads'
  },
  {
    name: 'María Rodríguez',
    role: 'Directora de Marketing',
    company: 'Fashion Boutique',
    text: 'Las campañas en Meta han transformado completamente nuestro negocio. Pasamos de vender localmente a nivel nacional.',
    image: 'https://i.pravatar.cc/150?u=maria',
    tag: 'Meta Ads'
  },
  {
    name: 'Javier Torres',
    role: 'Fundador',
    company: 'Indie Music Label',
    text: 'Los Anuncios de Spotify fueron un cambio radical para nuestros artistas. Llegamos exactamente a la audiencia correcta.',
    image: 'https://i.pravatar.cc/150?u=javier',
    tag: 'Spotify Ads'
  }
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonios" className="py-20 lg:py-32 bg-[#030305]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              VOCES DE <span className="text-white/40 text-gradient">CONFIANZA</span>
            </h2>
            <p className="text-gray-500 text-lg">
              Lo que dicen los líderes que ya están escalando con nosotros.
            </p>
          </div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-blue-500 text-blue-500" />
            ))}
            <span className="ml-2 font-bold text-white">5.0/5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-10 rounded-[2.5rem] bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-colors"
            >
              <Quote className="absolute top-8 right-8 text-white/5 group-hover:text-blue-500/20 transition-colors" size={60} />

              <p className="text-gray-300 text-lg leading-relaxed mb-10 relative z-10">
                "{t.text}"
              </p>

              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border border-white/10" />
                <div>
                  <h5 className="font-bold text-white">{t.name}</h5>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

