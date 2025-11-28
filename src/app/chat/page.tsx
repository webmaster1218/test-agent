'use client';

import { ChatInterface } from '@/components/chat-interface';
import { useEffect } from 'react';

export default function ChatPage() {
  // Forzar el agente de salud por defecto para esta ruta
  useEffect(() => {
    localStorage.setItem('selectedAgent', 'salud');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden" suppressHydrationWarning>
      <div className="h-[calc(100vh-12.8rem)] mt-32 mb-4 mx-4 sm:m-6 md:m-8 p-1 bg-card rounded-xl shadow-sm border border-border/50">
        <ChatInterface show_header={true} />
      </div>
    </div>
  );
}