"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

const WhatsAppBubble: React.FC = () => {
    const phoneNumber = "573244887171";
    const message = "Hola Fabrica de Winners, quiero llevar mi negocio al siguiente nivel.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[60] w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl shadow-[#25D366]/40 cursor-pointer group border-2 border-white/20"
        >
            <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-10 h-10 relative z-10 drop-shadow-lg"
            />

            {/* Tooltip */}
            <div className="absolute right-20 bg-white text-black text-[10px] font-bold py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-2xl uppercase tracking-widest">
                Hablemos por WhatsApp
            </div>
        </motion.a>
    );
};

export default WhatsAppBubble;
