"use client";

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, TrendingUp, Users, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const CaseStudies: React.FC = () => {
  const cases = [
    {
      id: '01',
      category: 'SaaS Médico',
      title: 'Alquiler de Ecógrafos',
      growth: 'Gestión 100% Digital',
      description: 'Plataforma SaaS que digitaliza y automatiza todo el flujo de negocio para el alquiler de equipos médicos, desde la generación de leads y adquisición de clientes, hasta la gestión operativa, inventario, contratos digitales y seguimiento post-venta, integrando CRM, marketing digital, Purblicidad, analítica, automatización empresarial y documentacion.',
      stats: [
        { label: 'Automatización', value: '100%' },
        { label: 'Eficiencia', value: '10x' },
        { label: 'Cierre Visitas', value: '+45%' }
      ],
      image: '/images/alquiler-ecografos.png',
      color: 'text-blue-400',
      link: 'https://alquilerdeecografos.com/'
    },
    {
      id: '02',
      category: 'Hospitalidad & Turismo',
      title: 'La Juana Cerro Tusa',
      growth: 'Cero Duplicidades',
      description: 'Aplicativo web que conecta un panel administrativo con calendario interactivo, sincronizado automáticamente con plataformas de alojamiento como Airbnb, Booking.com y Vrbo, permitiendo gestionar la disponibilidad en tiempo real y evitar duplicidades en las reservas. La plataforma se complementa con optimización posicionamiento web, analítica avanzada y herramientas de marketing digital, publicidad enfocados en maximizar las conversiones.',
      stats: [
        { label: 'Sincronización', value: '100%' },
        { label: 'Duplicidades', value: '0' },
        { label: 'Conversiones', value: '+120%' }
      ],
      image: '/images/la-juana.png',
      color: 'text-green-400',
      link: 'https://www.lajuanacerrotusa.com/'
    },
    {
      id: '03',
      category: 'Medicina Regenerativa',
      title: 'Vive Feliz Sin Dolor',
      growth: 'Gestión Inteligente',
      description: 'Ecosistema digital de captación y gestión de pacientes para medicina regenerativa, donde se integró toda la infraestructura tecnológica del negocio, desde marketing digital y adquisición de pacientes hasta la automatización completa de la gestión clínica. La plataforma conecta sitio web optimizado, analítica avanzada, posicionamiento SEO, CRM automatizado, campañas de publicidad digital y agentes de IA, capaces de informar, asesorar a los pacientes, registrar comprobantes de pago y gestionar de forma autónoma la programación de citas médicas y la documentación clínica.',
      stats: [
        { label: 'Conversión', value: '+300%' },
        { label: 'Agentes IA', value: '24/7' },
        { label: 'Autonomía', value: '100%' }
      ],
      image: '/images/vive-feliz.png',
      color: 'text-purple-400',
      link: 'https://vivefelizsindolor.com/'
    },
    {
      id: '04',
      category: 'Restaurante & Alimentos',
      title: 'Sabrositas',
      growth: 'Experiencia Interactiva',
      description: 'Plataforma web con una interfaz vibrante y moderna enfocada en la provocación visual y facilidad de navegación. Incluye un catálogo interactivo con precios y descripciones de productos, un formulario de "Trabaja con Nosotros" con envío automático de correos, y está completamente optimizada para una experiencia fluida desde cualquier dispositivo móvil.',
      stats: [
        { label: 'Navegación', value: 'Fluida' },
        { label: 'Menú', value: 'Interactivo' },
        { label: 'Responsive', value: '100%' }
      ],
      image: '/images/sabrositas.png',
      color: 'text-orange-400',
      link: 'https://sabrositas.co/'
    }
  ];

  return (
    <section id="exitos" className="py-32 bg-black/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
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
            className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          >
            ALGUNOS CASOS <span className="text-white/40 text-gradient">DE ÉXITO</span>
          </motion.h2>
        </div>

        <div className="space-y-32">
          {cases.map((c, i) => (
            <div key={c.id} className={cn(
              "flex flex-col lg:flex-row gap-16 items-center",
              i % 2 !== 0 && "lg:flex-row-reverse"
            )}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2 relative group"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 aspect-[4/3]">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-8 left-8 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                    <span className="text-white font-bold text-xl">{c.growth}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl font-serif italic text-white/10">{c.id}</span>
                  <div className="h-px flex-1 bg-white/10" />
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest", c.color)}>{c.category}</span>
                </div>

                <h3 className="text-4xl font-bold mb-6 tracking-tight">{c.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-10">
                  {c.description}
                </p>

                <div className="grid grid-cols-3 gap-8 mb-12">
                  {c.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <motion.a
                  href={c.link || '#'}
                  target={c.link ? "_blank" : "_self"}
                  rel={c.link ? "noopener noreferrer" : undefined}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-2 text-white font-bold text-sm group cursor-pointer inline-flex"
                >
                  {c.link ? 'Visitar el sitio web' : 'Leer Estudio Completo'}
                  <ArrowRight size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;

