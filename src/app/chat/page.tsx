'use client';

import { ChatInterface } from '@/components/chat-interface';
import { useEffect } from 'react';

export default function ChatPage() {
  // Chat principal es de salud (tema turquesa/verde)
  useEffect(() => {
    // Limpiar cualquier tema existente para usar el tema por defecto (salud)
    document.documentElement.removeAttribute('data-theme');

    // Limpiar al desmontar el componente
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden" style={{ position: 'relative', zIndex: 0 }}>
      {/* Header con Gradiente y Efectos */}
      <header className="relative flex items-center justify-center gap-1 p-4 flex-shrink-0">
        {/* Fondo con gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-xl -z-10"></div>

        {/* Título con efecto de brillo */}
        <div className="relative group">
          <h2 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300">
            Chat Interactivo
          </h2>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Línea divisora animada */}
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </header>

      <div className="h-[calc(100vh-5rem)]">
        <ChatInterface />
      </div>
    </div>
  );
}