'use client';

import { useState, useEffect } from 'react';
import { AgentTheme } from '@/lib/config/themes';
import { Agent } from '@/types';

const agents: Agent[] = [
  {
    id: 'salud',
    name: 'Salud',
    description: 'Asistente de Salud y Bienestar',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    capabilities: [
      'Tratamientos disponibles',
      'Agendar cita de valoración',
      'Información de la empresa',
      'Describir dolor para recomendación'
    ]
  },
  {
    id: 'comida',
    name: 'Comida',
    description: 'Asistente de Taquería',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    capabilities: [
      'Solicitar menú del día',
      'Recomendaciones de tacos',
      'Hacer pedido'
    ]
  }
];

interface AgentSelectorProps {
  selectedAgent: string;
  onAgentChange: (agentId: string) => void;
  theme: AgentTheme;
}

export default function AgentSelector({ selectedAgent, onAgentChange, theme }: AgentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [showCapabilitiesTooltip, setShowCapabilitiesTooltip] = useState(false);
  const [selectedAgentForTooltip, setSelectedAgentForTooltip] = useState<Agent | null>(null);

  // Mostrar tooltip cuando se selecciona un agente
  useEffect(() => {
    if (selectedAgent) {
      const agent = agents.find(a => a.id === selectedAgent);
      setSelectedAgentForTooltip(agent || null);
      setShowCapabilitiesTooltip(true);

      // Ocultar tooltip después de 4 segundos
      const timer = setTimeout(() => {
        setShowCapabilitiesTooltip(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [selectedAgent]);

  const selectedAgentData = agents.find(agent => agent.id === selectedAgent) || agents[0];

  return (
    <div className="relative mb-6">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-medium text-left flex items-center justify-between hover:bg-white/15 hover:border-white/30 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          style={{
            borderColor: `${theme.primary}33`,
            boxShadow: `0 0 20px ${theme.primary}33`,
          }}
          onMouseEnter={() => setHoveredAgent(selectedAgentData.id)}
          onMouseLeave={() => setHoveredAgent(null)}
        >
          <div className="flex items-center space-x-4 group">
            <div className="flex-shrink-0 transition-colors duration-300" style={{ color: theme.secondary }}>
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

        {/* Tooltip de capacidades al seleccionar agente */}
        {showCapabilitiesTooltip && selectedAgentForTooltip && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white/95 backdrop-blur-md border border-white/30 rounded-lg px-4 py-3 shadow-2xl z-50 animate-fade-in-up max-w-xs">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm font-semibold text-gray-800 flex items-center">
                <span className="mr-2" style={{ color: selectedAgentForTooltip.id === 'salud' ? '#4229FF' : '#FF6B35' }}>
                  {selectedAgentForTooltip.icon}
                </span>
                ¿Qué puedo preguntarle?
              </div>
              <button
                onClick={() => setShowCapabilitiesTooltip(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              {selectedAgentForTooltip.capabilities.map((capability, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mr-2"></span>
                  {capability}
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
            </div>
          </div>
        )}

        {/* Tooltip for selected agent */}
        {hoveredAgent === selectedAgentData.id && (
          <div className="agent-tooltip" style={{
            borderColor: `${theme.primary}33`,
            boxShadow: `0 4px 20px ${theme.primary}33`
          }}>
            {selectedAgentData.capabilities.join(' • ')}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
          {agents.map((agent) => {
            const agentTheme = agent.id === 'salud' ?
              { primary: '#4229FF', secondary: '#6366F1' } :
              { primary: '#FF6B35', secondary: '#FF8C42' };

            return (
              <div key={agent.id} className="relative">
                <button
                  onClick={() => {
                    onAgentChange(agent.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-6 py-4 text-left transition-all duration-300 hover:bg-white/15 ${
                    selectedAgent === agent.id ? 'bg-white/20 border-l-4' : 'hover:border-l-4 hover:border-white/30'
                  }`}
                  style={{
                    borderLeftColor: selectedAgent === agent.id ? agentTheme.primary : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredAgent(agent.id)}
                  onMouseLeave={() => setHoveredAgent(null)}
                >
                  <div className="flex items-center space-x-4 group">
                    <div className="flex-shrink-0 transition-colors duration-300" style={{ color: agentTheme.secondary }}>
                      {agent.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-white group-hover:text-white transition-colors duration-300">{agent.name}</div>
                      <div className="text-sm text-white/70 mt-1 group-hover:text-white/80 transition-colors duration-300">{agent.description}</div>
                    </div>
                  </div>
                </button>

                {/* Tooltip for dropdown agent */}
                {hoveredAgent === agent.id && (
                  <div className="agent-tooltip" style={{
                    borderColor: `${agentTheme.primary}33`,
                    boxShadow: `0 4px 20px ${agentTheme.primary}33`
                  }}>
                    {agent.capabilities.join(' • ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}