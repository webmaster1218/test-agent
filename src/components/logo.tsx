import React from 'react';
import { getAgentTheme } from '@/lib/config/themes';

export default function Logo({ className = '', agentType = 'salud' }: { className?: string; agentType?: 'salud' | 'comida' }) {
  // Obtener colores del sistema centralizado
  const agentTheme = getAgentTheme(agentType);
  const primaryColor = agentTheme.primary;
  const secondaryColor = agentTheme.secondary;
  const eyeColor = agentTheme.primary;
  const gradientId = `gradient1-${agentType}`;

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Logo de Marcos Chat */}
      <circle cx="50" cy="50" r="45" fill={`url(#${gradientId})`} />
      <path
        d="M30 40 Q 50 20, 70 40 Q 50 60, 30 40"
        fill="white"
        opacity="0.9"
      />
      <circle cx="40" cy="45" r="3" fill={eyeColor} />
      <circle cx="60" cy="45" r="3" fill={eyeColor} />
      <path
        d="M35 55 Q 50 65, 65 55"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
    </svg>
  );
}