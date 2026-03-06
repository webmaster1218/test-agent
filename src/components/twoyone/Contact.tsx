"use client";

import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter, Youtube, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const Contact: React.FC = () => {
  return (
    <section id="contacto" className="relative py-20 lg:py-32 bg-[#030305] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">

          {/* Left Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
                HABLEMOS DE <br />
                <span className="text-white/40">TU PRÓXIMO NIVEL</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-md">
                No somos una agencia más. Somos tu socio estratégico en el ecosistema digital. Primera consultoría estratégica sin costo.
              </p>
            </motion.div>

            <div className="space-y-6 mb-16">
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm italic">
                Estamos listos para transformar tu presencia digital. Completa el formulario y un especialista se pondrá en contacto contigo en menos de 24 horas.
              </p>
            </div>
          </div>

          {/* Right Column (Form) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-[2.5rem] blur opacity-20" />
            <div className="relative bg-[#0a0a0c] p-10 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nombre</label>
                    <input type="text" placeholder="Juan Pérez" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-white placeholder:text-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                    <input type="email" placeholder="juan@empresa.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-white placeholder:text-gray-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Presupuesto Mensual</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-gray-400 appearance-none">
                    <option>Selecciona un rango</option>
                    <option>1.000€ - 5.000€</option>
                    <option>5.000€ - 15.000€</option>
                    <option>15.000€+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mensaje</label>
                  <textarea rows={4} placeholder="Cuéntanos sobre tus objetivos..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-white placeholder:text-gray-700 resize-none" />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-black font-bold py-5 rounded-2xl shadow-xl shadow-white/5 transition-all flex items-center justify-center gap-3 group"
                >
                  Enviar Propuesta
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </motion.button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;

