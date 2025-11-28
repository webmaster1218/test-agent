'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bot, User, Loader } from 'lucide-react';
import { WEBHOOK_CONFIG, CHAT_CONFIG } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

interface DashboardSaludChatProps {
  className?: string;
}

export function DashboardSaludChat({ className }: DashboardSaludChatProps) {
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: chatMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatMessage('');
    setIsChatLoading(true);

    try {
      // Usar el webhook correcto para el agente de salud
      const conversationId = localStorage.getItem('conversationId_salud') ||
                            CHAT_CONFIG.generateConversationId();

      if (!localStorage.getItem('conversationId_salud')) {
        localStorage.setItem('conversationId_salud', conversationId);
      }

      const messageId = CHAT_CONFIG.generateMessageId();
      const createdAt = new Date().toISOString();

      // Construir el payload complexo que espera n8n
      const payload = [{
        headers: {
          "host": "n8n.srv1054162.hstgr.cloud",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
          "content-length": "98",
          "accept": "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "es-ES,es;q=0.9",
          "content-type": "application/json",
          "origin": "http://localhost:3000",
          "priority": "u=1, i",
          "referer": "http://localhost:3000/",
          "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Brave\";v=\"140\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "sec-gpc": "1",
          "x-forwarded-for": "181.32.155.251",
          "x-forwarded-host": "n8n.srv1054162.hstgr.cloud",
          "x-forwarded-port": "443",
          "x-forwarded-proto": "https",
          "x-forwarded-server": "3c54fcca5a76",
          "x-real-ip": "181.32.155.251"
        },
        params: {},
        query: {},
        body: {
          "conversationId": conversationId,
          "messageId": messageId,
          "message": chatMessage.trim(),
          "createdAt": createdAt
        },
        "webhookUrl": WEBHOOK_CONFIG.salud,
        "executionMode": "production"
      }];

      const response = await fetch(WEBHOOK_CONFIG.salud, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        const textResponse = await response.text();
        throw new Error(`Respuesta no válida del servidor: ${textResponse.slice(0, 100)}`);
      }

      let responseText = '';
      let images: Array<{url: string, alt?: string}> = [];

      // Procesar diferentes formatos de respuesta de n8n
      if (Array.isArray(responseData) && responseData.length > 0) {
        const webhookResponse = responseData[0];
        responseText = webhookResponse.reply ||
                       webhookResponse.response?.message ||
                       webhookResponse.body?.response ||
                       webhookResponse.body?.message ||
                       webhookResponse.output ||
                       webhookResponse.message ||
                       '';

        // Extraer imágenes si existen
        if (webhookResponse.images && Array.isArray(webhookResponse.images)) {
          images = webhookResponse.images.map((img: any) => ({
            url: img.url || img.imageUrl || '',
            alt: img.alt || img.imageAlt || 'Imagen del agente'
          }));
        }

        // Extraer imagen única si existe
        if (webhookResponse.imageUrl && images.length === 0) {
          images = [{
            url: webhookResponse.imageUrl,
            alt: webhookResponse.imageAlt || 'Imagen enviada por el agente'
          }];
        }
      } else if (responseData && typeof responseData === 'object') {
        responseText = responseData.reply ||
                       responseData.response?.message ||
                       responseData.response ||
                       responseData.body?.response ||
                       responseData.body?.message ||
                       responseData.output ||
                       responseData.message ||
                       '';

        // Extraer imágenes si existen
        if (responseData.images && Array.isArray(responseData.images)) {
          images = responseData.images.map((img: any) => ({
            url: img.url || img.imageUrl || '',
            alt: img.alt || img.imageAlt || 'Imagen del agente'
          }));
        }

        // Extraer imagen única si existe
        if (responseData.imageUrl && images.length === 0) {
          images = [{
            url: responseData.imageUrl,
            alt: responseData.imageAlt || 'Imagen enviada por el agente'
          }];
        }
      }

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: responseText || 'He recibido tu mensaje. Estoy procesando tu solicitud.',
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error('Error al enviar mensaje al webhook de salud:', error);

      let errorMessage = 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.';

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'No puedo conectar con el servidor del agente de salud. Por favor verifica tu conexión a internet.';
        } else if (error.message.includes('Error HTTP')) {
          errorMessage = 'El servidor del agente de salud está experimentando problemas. Por favor intenta más tarde.';
        }
      }

      toast({
        title: "Error de Comunicación",
        description: errorMessage,
        variant: "destructive",
      });

      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: errorMessage,
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          Chat - Asistente de Salud
        </CardTitle>
        <CardDescription className="text-xs">
          Consultas médicas y agendamiento de citas
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-3 pt-0">
        {/* Área de mensajes */}
        <div className="flex-1 mb-3 min-h-[200px] max-h-[400px] overflow-y-auto">
          {chatMessages.length === 0 ? (
            <div className="text-center text-muted-foreground text-xs py-8">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Envía un mensaje para comenzar</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.isUser ? 'order-2' : 'order-1'}`}>
                    <div className={`px-3 py-2 rounded-lg text-xs ${
                      msg.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                  <div className={`w-6 h-6 ${msg.isUser ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className={`text-[10px] ${
                        msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {msg.isUser ? 'Tú' : 'AI'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isChatLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 text-muted-foreground text-xs">
                <div className="w-6 h-6">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-muted">AI</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input del chat */}
        <div className="flex space-x-2">
          <Input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 text-xs"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isChatLoading}
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!chatMessage.trim() || isChatLoading}
            className="px-3"
          >
            {isChatLoading ? (
              <Loader className="h-3 w-3 animate-spin" />
            ) : (
              <MessageCircle className="h-3 w-3" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}