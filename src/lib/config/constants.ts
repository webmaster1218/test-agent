export const APP_CONFIG = {
  name: 'Fábrica de Winners',
  description: 'Pruebas de Agentes IA',
  version: '1.0.0',
  defaultAgent: 'salud' as const,
  agents: ['salud', 'comida'] as const,
} as const;

export const WEBHOOK_CONFIG = {
  salud: 'https://n8n.srv1054162.hstgr.cloud/webhook/29aad504-0017-47b9-b2b5-57800b5649f8',
  comida: 'https://n8n.srv1054162.hstgr.cloud/webhook/ff3f992e-bf39-432a-9dad-05ce3ec14d26',
} as const;