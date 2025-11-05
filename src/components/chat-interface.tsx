'use client';

import type { Message } from '@/lib/types';
import { useState, useEffect } from 'react';
import ChatHeader from '@/components/chat-header';
import ChatMessages from '@/components/chat-messages';
import ChatInput from '@/components/chat-input';
import { useToast } from '@/hooks/use-toast';
import { WEBHOOK_CONFIG, CHAT_CONFIG, type WebhookPayload, type SimpleMessageData } from '@/lib/constants';

export function ChatInterface({ show_header = true }: { show_header?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Generate a unique ID for the conversation session
    setConversationId(CHAT_CONFIG.generateConversationId());
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !conversationId) return;

    const messageId = CHAT_CONFIG.generateMessageId();
    const timestamp = new Date().toISOString();
    const sessionId = CHAT_CONFIG.generateSessionId();

    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const messageData = {
        message: content,
        conversationId: conversationId,
        messageId: messageId,
        timestamp: timestamp
      };

      console.log('Enviando mensaje al webhook:', JSON.stringify(messageData, null, 2));

      const response = await fetch(WEBHOOK_CONFIG[CHAT_CONFIG.defaultAgent], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      let agentResponseContent;

      try {
        const data = await response.json();
        console.log('Respuesta recibida de n8n:', data);

        // Procesar diferentes formatos de respuesta
        agentResponseContent = data.reply || data.response || data.message;

        // Si la respuesta es un array, tomar el primer elemento
        if (Array.isArray(data) && data.length > 0) {
          agentResponseContent = data[0].reply || data[0].response || data[0].message;
        }
      } catch (parseError) {
        console.log('Error al parsear respuesta del webhook, usando respuesta de prueba');
        // Respuesta de prueba mientras el webhook no funciona
        agentResponseContent = `Hola! Soy el asistente de salud. He recibido tu mensaje: "${content}". El webhook de n8n está siendo configurado. Esta es una respuesta temporal para que puedas ver cómo funciona la interfaz.`;
      }

      if (typeof agentResponseContent === 'string') {
        const agentMessage: Message = {
          id: CHAT_CONFIG.generateMessageId(),
          role: 'agent',
          content: agentResponseContent,
        };
        setMessages((prev) => [...prev, agentMessage]);
      } else {
        throw new Error("La respuesta de n8n no contiene una propiedad de respuesta válida (reply/response/message).");
      }

    } catch (error) {
      console.error('Error al comunicarse con n8n:', error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido";
      toast({
        variant: "destructive",
        title: "Error de Comunicación",
        description: `No se pudo obtener una respuesta del agente. ${errorMessage}`,
      });
      const errorResponseMessage: Message = {
        id: CHAT_CONFIG.generateMessageId(),
        role: 'agent',
        content: `Lo siento, he encontrado un problema. ${errorMessage}`,
      };
      setMessages((prev) => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setConversationId(CHAT_CONFIG.generateConversationId());
  };

  return (
    <div className="flex flex-col h-full bg-card text-foreground font-sans relative">
      {show_header && <ChatHeader onReset={handleReset} />}
      {/* Botón de limpiar mejorado para cuando no hay header (dashboard) */}
      {!show_header && (
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-lg bg-background/90 backdrop-blur-md border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200 shadow-sm hover:shadow-md group"
            aria-label="Limpiar chat"
          >
            <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <ChatMessages messages={messages} isLoading={isLoading} onSuggestionClick={handleSendMessage} />
      </div>
      <div className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}