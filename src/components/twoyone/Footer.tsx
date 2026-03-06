"use client";

import React from 'react';
import { Linkedin, Instagram, Twitter, Youtube, ArrowRight, Infinity } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030305] border-t border-white/5 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white">
                <Infinity size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tighter">FABRICA DE WINNERS</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
              Transformamos datos en crecimiento exponencial. La agencia de marketing IA-First para marcas que dominan el futuro.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold mb-8 uppercase tracking-widest text-[10px]">Navegación</h5>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#exitos" className="hover:text-white transition-colors">Casos de Éxito</a></li>
              <li><a href="#agentes" className="hover:text-white transition-colors">Prueba IA</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-8 uppercase tracking-widest text-[10px]">Estrategia</h5>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#capacidades" className="hover:text-white transition-colors">Publicidad</a></li>
              <li><a href="#testimonios" className="hover:text-white transition-colors">Testimonios</a></li>
              <li><a href="https://wa.me/573244887171?text=Hola%20Fabrica%20de%20Winners,%20quiero%20llevar%20mi%20negocio%20al%20siguiente%20nivel." target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Escalar Ahora</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            © 2025 FABRICA DE WINNERS. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

