export interface AgentTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  plasma: string;
  name: string;
}

export const agentThemes: Record<string, AgentTheme> = {
  salud: {
    primary: '#2C8082',
    secondary: '#1f5a5c',
    accent: '#236667',
    background: 'rgba(44, 128, 130, 0.08)',
    plasma: '#2C8082',
    name: 'Salud'
  },
  comida: {
    primary: '#FF6B35',
    secondary: '#FF8C42',
    accent: '#FFA726',
    background: 'rgba(255, 107, 53, 0.08)',
    plasma: '#FF6B35',
    name: 'Comida'
  }
};

export function getAgentTheme(agentId: string): AgentTheme {
  return agentThemes[agentId] || agentThemes.salud;
}