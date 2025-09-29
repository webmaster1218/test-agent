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
    primary: '#4229FF',
    secondary: '#6366F1',
    accent: '#818CF8',
    background: 'rgba(66, 41, 255, 0.08)',
    plasma: '#4229FF',
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