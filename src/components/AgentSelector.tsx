'use client';

import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface AgentSelectorProps {
  selectedAgent: string;
  onAgentChange: (agentId: string) => void;
}

const agents: Agent[] = [
  {
    id: 'salud',
    name: 'Salud',
    description: 'Asistente de Salud y Bienestar',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    id: 'comida',
    name: 'Comida',
    description: 'Asistente de Gastronomía',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
];

export default function AgentSelector({ selectedAgent, onAgentChange }: AgentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedAgentData = agents.find(agent => agent.id === selectedAgent) || agents[0];

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-medium text-left flex items-center justify-between hover:bg-white/15 hover:border-white/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
      >
        <div className="flex items-center space-x-4 group">
          <div className="text-blue-300 flex-shrink-0 group-hover:text-blue-200 transition-colors duration-300">
            {selectedAgentData.icon}
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold group-hover:text-white transition-colors duration-300">{selectedAgentData.name}</div>
            <div className="text-sm text-white/70 mt-1 group-hover:text-white/80 transition-colors duration-300">{selectedAgentData.description}</div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} flex-shrink-0 ml-3`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => {
                onAgentChange(agent.id);
                setIsOpen(false);
              }}
              className={`w-full px-6 py-4 text-left transition-all duration-300 hover:bg-white/15 hover:border-blue-400/20 ${
                selectedAgent === agent.id ? 'bg-white/20 border-l-4 border-blue-400' : 'hover:border-l-4 hover:border-white/30'
              }`}
            >
              <div className="flex items-center space-x-4 group">
                <div className="text-blue-300 flex-shrink-0 group-hover:text-blue-200 transition-colors duration-300">
                  {agent.icon}
                </div>
                <div>
                  <div className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors duration-300">{agent.name}</div>
                  <div className="text-sm text-white/70 mt-1 group-hover:text-white/80 transition-colors duration-300">{agent.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}