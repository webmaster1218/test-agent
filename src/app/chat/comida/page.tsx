'use client';

import { ChatInterface } from '@/components/chat-interface';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ChatComidaPage() {

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden" suppressHydrationWarning>
      <div className="h-[calc(100vh-4rem)] m-4 sm:m-6 md:m-8 p-1 bg-card rounded-xl shadow-sm border border-border/50">
        <ChatInterface />
      </div>
    </div>
  );
}