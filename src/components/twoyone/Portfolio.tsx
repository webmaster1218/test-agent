"use client";

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const projects = [
  {
    title: 'Alquiler de Ecógrafos',
    category: 'SaaS Médico',
    growth: '100% Automatizado',
    description: 'Plataforma SaaS que digitaliza y automatiza todo el flujo de negocio para el alquiler de equipos médicos, desde la generación de leads y adquisición de clientes, hasta la gestión operativa, inventario, contratos digitales y seguimiento post-venta, integrando CRM, marketing digital, Purblicidad, analítica, automatización empresarial y documentacion.',
    tags: ['SaaS', 'Meta Ads', 'CRM'],
    image: '/images/alquiler-ecografos.png',
    link: 'https://alquilerdeecografos.com/',
    className: 'md:col-span-2 md:row-span-2'
  },
  {
    title: 'La Juana Cerro Tusa',
    category: 'Hospitalidad & Turismo',
    growth: 'Sincronización Total',
    description: 'Aplicativo web que conecta un panel administrativo con calendario interactivo, sincronizado automáticamente con plataformas de alojamiento como Airbnb, Booking.com y Vrbo, permitiendo gestionar la disponibilidad en tiempo real y evitar duplicidades en las reservas. La plataforma se complementa con optimización posicionamiento web, analítica avanzada y herramientas de marketing digital, publicidad enfocados en maximizar las conversiones.',
    tags: ['Desarrollo Web', 'Integraciones', 'Ads'],
    image: '/images/la-juana.png',
    link: 'https://www.lajuanacerrotusa.com/',
    className: 'md:col-span-1 md:row-span-1'
  },
  {
    title: 'Vive Feliz Sin Dolor',
    category: 'Medicina Regenerativa',
    growth: 'Ecosistema Integrado',
    description: 'Vive Feliz Sin Dolor es un ecosistema digital de captación y gestión de pacientes para medicina regenerativa, donde se integró toda la infraestructura tecnológica del negocio, desde marketing digital y adquisición de pacientes hasta la automatización completa de la gestión clínica. La plataforma conecta sitio web optimizado, analítica avanzada, posicionamiento SEO, CRM automatizado, campañas de publicidad digital y agentes de IA, capaces de informar, asesorar a los pacientes, registrar comprobantes de pago y gestionar de forma autónoma la programación de citas médicas y la documentación clínica.',
    tags: ['Automatización', 'Agentes IA', 'SEO'],
    image: '/images/vive-feliz.png',
    link: 'https://vivefelizsindolor.com/',
    className: 'md:col-span-1 md:row-span-1'
  },
  {
    title: 'Sabrositas',
    category: 'Restaurante & Alimentos',
    growth: 'Experiencia Interactiva',
    description: 'Plataforma web con una interfaz vibrante y moderna enfocada en la provocación visual. Incluye un menú digital interactivo, un formulario automatizado de contratación y está completamente optimizada para cualquier dispositivo móvil.',
    tags: ['Diseño UI/UX', 'Menú Digital', 'Responsive'],
    image: '/images/sabrositas.png',
    link: 'https://sabrositas.co/',
    className: 'md:col-span-1 md:row-span-1'
  },
  {
    title: 'GastroConnect',
    category: 'Retail',
    growth: '+190% Tráfico',
    description: 'Campaña geolocalizada hiper-segmentada para una cadena de restaurantes premium.',
    tags: ['Meta', 'SEO Local'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    className: 'md:col-span-2 md:row-span-1'
  }
];

const Portfolio: React.FC = () => {
  return (
    <section id="portafolio" className="py-32 bg-[#030305]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.9]"
            >
              PROYECTOS QUE <br />
              <span className="text-white/20 italic font-serif">DEFINEN EL MERCADO</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
              Nuestra obsesión es el retorno. Cada proyecto es una oportunidad para redefinir lo que es posible en la era digital.
            </p>
            <div className="h-px w-24 bg-blue-500/50" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
          {projects.map((project, idx) => (
            <motion.a
              href={project.link || '#'}
              target={project.link ? "_blank" : "_self"}
              rel={project.link ? "noopener noreferrer" : undefined}
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={cn(
                "group relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/5 cursor-pointer block",
                project.className
              )}
            >
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/20 to-transparent" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex justify-between items-start mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-2 block">
                      {project.category}
                    </span>
                    <h4 className="text-2xl font-bold text-white tracking-tight">
                      {project.title}
                    </h4>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                <p className="text-gray-400 text-sm max-w-sm line-clamp-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {project.description}
                </p>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <div className="flex gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-white/60 bg-white/5 px-2 py-1 rounded-md border border-white/5">{tag}</span>
                    ))}
                  </div>
                  <span className="text-green-400 font-bold text-sm tracking-tight">{project.growth}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

