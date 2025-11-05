export const WEBHOOK_CONFIG = {
  salud: 'https://n8n.srv1054162.hstgr.cloud/webhook/564531df-e16b-40e4-8e1c-522aa0529631',
  comida: 'https://n8n.vivefelizsindolor.com/webhook/ff3f992e-bf39-432a-9dad-05ce3ec14d26',
} as const;

export const CHAT_CONFIG = {
  defaultAgent: 'salud' as const,
  userId: 'dashboard_user',
  generateMessageId: () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  generateConversationId: () => crypto.randomUUID(),
  generateSessionId: () => crypto.randomUUID(),
} as const;

export interface WebhookPayload {
  headers: {
    host: string;
    'user-agent': string;
    'content-length': string;
    accept: string;
    'accept-encoding': string;
    'accept-language': string;
    'content-type': string;
    origin: string;
    priority: string;
    referer: string;
    'sec-ch-ua': string;
    'sec-ch-ua-mobile': string;
    'sec-ch-ua-platform': string;
    'sec-fetch-dest': string;
    'sec-fetch-mode': string;
    'sec-fetch-site': string;
    'sec-gpc': string;
    'x-forwarded-for': string;
    'x-forwarded-host': string;
    'x-forwarded-port': string;
    'x-forwarded-proto': string;
    'x-forwarded-server': string;
    'x-real-ip': string;
  };
  params: Record<string, any>;
  query: Record<string, any>;
  body: Array<{
    headers: {
      host: string;
      'user-agent': string;
      'content-length': string;
      accept: string;
      'accept-encoding': string;
      'accept-language': string;
      'content-type': string;
      origin: string;
      priority: string;
      referer: string;
      'sec-ch-ua': string;
      'sec-ch-ua-mobile': string;
      'sec-ch-ua-platform': string;
      'sec-fetch-dest': string;
      'sec-fetch-mode': string;
      'sec-fetch-site': string;
      'sec-gpc': string;
      'x-forwarded-for': string;
      'x-forwarded-host': string;
      'x-forwarded-port': string;
      'x-forwarded-proto': string;
      'x-forwarded-server': string;
      'x-real-ip': string;
    };
    params: Record<string, any>;
    query: Record<string, any>;
    body: {
      conversationId: string;
      messageId: string;
      message: string;
      createdAt: string;
    };
    webhookUrl: string;
    executionMode: string;
  }>;
  webhookUrl: string;
  executionMode: string;
}

export interface SimpleMessageData {
  conversationId: string;
  messageId: string;
  message: string;
  createdAt: string;
}