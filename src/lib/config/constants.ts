export const APP_CONFIG = {
  name: 'Fábrica de Winners',
  description: 'Pruebas de Agentes IA',
  version: '1.0.0',
  defaultAgent: 'salud' as const,
  agents: ['salud', 'comida'] as const,
} as const;

export const WEBHOOK_CONFIG = {
  salud: 'https://n8n.vivefelizsindolor.com/webhook/d25d94ff-e996-4044-88e9-9a108118f0f4',
  comida: 'https://n8n.vivefelizsindolor.com/webhook/ff3f992e-bf39-432a-9dad-05ce3ec14d26',
} as const;