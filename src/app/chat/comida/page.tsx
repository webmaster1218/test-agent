'use client';

import { ChatInterface } from '@/components/chat-interface';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ChatComidaPage() {
  // Aplicar tema de comida (el script inline ya lo hizo, pero esto es por seguridad)
  useEffect(() => {
    // Limpiar al desmontar el componente
    return () => {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-foreground');
      document.documentElement.style.removeProperty('--ring');
      document.documentElement.style.removeProperty('--chart-1');
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden" suppressHydrationWarning>
      <div className="h-[calc(100vh-4rem)] m-8 p-1 bg-card rounded-xl shadow-sm border border-border/50">
        <ChatInterface />
      </div>
    </div>
  );
}