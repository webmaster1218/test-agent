"use client";
import React from 'react';
import { Calendar, ArrowRight, Music, Activity, BarChart2, Users, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const Hero: React.FC = () => {
  return (
    <section id="inicio" className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-center pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">Motor de Crecimiento impulsado por IA</span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-8xl lg:text-[110px] font-bold tracking-tighter leading-[0.9] md:leading-[0.85] mb-8">
            ESCALAMOS <br />
            <span className="text-gradient">TU VISIÓN</span>
            <span className="block font-serif italic font-light text-2xl md:text-6xl text-white/40 mt-4 lowercase tracking-normal">
              en la era digital
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed mb-10 font-light">
            Ayudamos a negocios a crecer en internet. Construimos ecosistemas digitales a través de Inteligencia Artificial, Marketing de Precisión y Desarrollo de Software avanzado.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <motion.a
              href="#exitos"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-14 px-10 rounded-2xl bg-white text-black text-base font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-white/5"
            >
              Ver Resultados
              <ArrowRight size={20} />
            </motion.a>
            <motion.a
              href="#contacto"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.98 }}
              className="h-14 px-10 rounded-2xl border border-white/15 text-white text-base font-bold transition-all flex items-center justify-center gap-2"
            >
              Consultoría Gratis
              <Calendar size={18} />
            </motion.a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-12 border-t border-white/5 pt-10 max-w-lg">
            {[
              { label: 'ROI Promedio', value: '+450%' },
              { label: 'Retención', value: '98%' },
              { label: 'Inversión Gestionada', value: '$12M+' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <p className="text-3xl font-bold tracking-tight text-white mb-1">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Visuals */}
        <div className="relative h-[600px] w-full hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            {/* Meta Card */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-72 h-80 rounded-[2.5rem] bg-gradient-to-br from-[#0064e0] to-[#6b2c91] p-8 shadow-2xl z-20 border border-white/20 backdrop-blur-sm"
            >
              <img src="https://diariobitcoin.b-cdn.net/wp-content/uploads/2021/10/meta_logo_press_kit.jpg" alt="Meta" className="h-10 object-contain " />
              <div className="space-y-6">
                <div>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-1">ROAS Actual</p>
                  <p className="text-4xl font-bold text-white">8.42x</p>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '84%' }}
                    transition={{ duration: 2, delay: 1 }}
                    className="h-full bg-white"
                  />
                </div>
                <div className="flex justify-between text-white/80 text-xs">
                  <span>Conversiones</span>
                  <span className="font-bold">+124%</span>
                </div>
              </div>
            </motion.div>

            {/* Google Card */}
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-10 right-10 w-56 h-56 rounded-3xl bg-white p-6 shadow-2xl z-10 flex flex-col justify-between"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-10 h-10" />
              <div>
                <p className="text-black/40 text-[10px] uppercase tracking-widest font-bold mb-1">Anuncios de Búsqueda</p>
                <p className="text-2xl font-bold text-black">Top 1%</p>
                <p className="text-black/60 text-[10px] mt-1">Cuota de Impresiones</p>
              </div>
            </motion.div>

            {/* Spotify Card */}
            <motion.div
              animate={{ x: [0, -15, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-0 w-64 h-40 rounded-2xl bg-[#121212] border border-white/10 p-6 shadow-2xl z-30 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <Music className="text-[#1DB954]" size={32} />
                <Activity className="text-white/20" size={20} />
              </div>
              <div>
                <p className="text-white font-bold">Campañas de Audio</p>
                <p className="text-white/40 text-xs">Segmentación Activa</p>
              </div>
            </motion.div>

            {/* Floating Icons */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            >
              <div className="absolute top-20 left-10 p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <BarChart2 className="text-blue-400" size={20} />
              </div>
              <div className="absolute bottom-40 right-20 p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <Users className="text-purple-400" size={20} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Marquee */}
      <div className="mt-auto pt-20">
        <div className="border-y border-white/5 bg-white/[0.02] py-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-10">
            <p className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">Con la confianza de líderes de la industria</p>
          </div>

          <div className="relative flex overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap gap-24 items-center px-12">
              {['Google', 'Meta', 'TikTok', 'Spotify', 'Amazon', 'Microsoft', 'LinkedIn', 'Apple', 'Netflix', 'Adobe'].map((brand) => (
                <span key={brand} className="text-xl md:text-2xl font-bold tracking-tighter text-white/30 hover:text-white transition-colors duration-300">{brand}</span>
              ))}
              {/* Duplicate for seamless loop */}
              {['Google', 'Meta', 'TikTok', 'Spotify', 'Amazon', 'Microsoft', 'LinkedIn', 'Apple', 'Netflix', 'Adobe'].map((brand) => (
                <span key={`${brand}-dup`} className="text-xl md:text-2xl font-bold tracking-tighter text-white/30 hover:text-white transition-colors duration-300">{brand}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

