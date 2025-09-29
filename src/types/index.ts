export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentId: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  capabilities: string[];
}

export interface AgentTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  plasma: string;
  name: string;
}

export interface AgentSelectorProps {
  selectedAgent: string;
  onAgentChange: (agentId: string) => void;
  theme: AgentTheme;
}

export interface ChatProps {
  selectedAgent: string;
  theme: AgentTheme;
}