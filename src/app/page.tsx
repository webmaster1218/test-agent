'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Plasma from '@/components/ui/Plasma';
import Chat from '@/components/chat/Chat';
import AgentSelector from '@/components/ui/AgentSelector';
import { Button } from '@/components/ui/button';
import { getAgentTheme } from '@/lib/config/themes';
import { BarChart3, Sparkles, TrendingUp } from 'lucide-react';

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState('salud');
  const [theme, setTheme] = useState(getAgentTheme('salud'));

  useEffect(() => {
    // Load saved agent from localStorage
    const savedAgent = localStorage.getItem('selectedAgent');
    if (savedAgent && (savedAgent === 'salud' || savedAgent === 'comida')) {
      setSelectedAgent(savedAgent);
    }
  }, []);

  useEffect(() => {
    // Update theme when agent changes
    const newTheme = getAgentTheme(selectedAgent);
    setTheme(newTheme);
  }, [selectedAgent]);

  const handleAgentChange = (agentId: string) => {
    setSelectedAgent(agentId);
    localStorage.setItem('selectedAgent', agentId);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0">
        <Plasma
          color={theme.plasma}
          speed={0.5}
          direction="forward"
          scale={1.2}
          opacity={0.7}
          mouseInteractive={true}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="text-center py-12 md:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-semibold text-white tracking-tight leading-tight uppercase mb-4">
              FÁBRICA DE WINNERS
            </h1>
            <h2 className="text-lg md:text-xl font-sans font-normal text-white/80 tracking-wide uppercase">
              Pruebas de Agentes IA
            </h2>
          </div>
        </header>

        <div className="px-4 mb-6 space-y-4">
          <div className="w-full max-w-md mx-auto">
            <AgentSelector
              selectedAgent={selectedAgent}
              onAgentChange={handleAgentChange}
              theme={theme}
            />
          </div>

          {/* Dashboard Access Button */}
          <div className="w-full max-w-md mx-auto">
            <Link href={selectedAgent === 'comida' ? '/login/comida' : '/login/salud'} passHref>
              <Button
                size="default"
                className="w-full group relative overflow-hidden bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-medium">Acceder a Dashboard</span>
                  <Sparkles className="h-4 w-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              </Button>
            </Link>
          </div>
        </div>

        <main className="flex-1 flex items-start justify-center px-4 pb-8">
          <div className="w-full max-w-xl">
            <div
              className="chat-container rounded-2xl p-6 shadow-xl interactive-glow transition-smooth"
              style={{
                background: theme.background,
                borderColor: `${theme.primary}33`,
                boxShadow: `0 0 20px ${theme.primary}33`,
                '--theme-primary': theme.primary
              } as React.CSSProperties}
            >
              <Chat selectedAgent={selectedAgent} theme={theme} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
