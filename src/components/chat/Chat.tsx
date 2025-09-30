'use client';

import { useState, useRef, useEffect } from 'react';
import { AgentTheme } from '@/lib/config/themes';
import { WEBHOOK_CONFIG } from '@/lib/config/constants';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentId: string;
}

interface ChatProps {
  selectedAgent: string;
  theme: AgentTheme;
}

export default function Chat({ selectedAgent, theme }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages for current agent from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_messages_${selectedAgent}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: Message & { timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  }, [selectedAgent]);

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem(`chat_messages_${selectedAgent}`, JSON.stringify(messages));
  }, [messages, selectedAgent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(`chat_messages_${selectedAgent}`);
    localStorage.removeItem(`conversationId_${selectedAgent}`);

    // Forzar la generación de un nuevo conversationId en el próximo mensaje
    // Esto hará que parezca una nueva persona/sesión
  };

  const getAgentResponse = (agentId: string): string => {
    const responses = {
      salud: 'Hola, soy tu asistente de Salud y Bienestar. Estoy aquí para ayudarte con tratamientos disponibles, agendar citas de valoración y recomendaciones basadas en tus síntomas. ¿En qué puedo asistirte hoy?',
      comida: '¡Hola! Bienvenido a nuestra taquería. Soy tu asistente y puedo ayudarte con el menú del día, recomendaciones de tacos y tomar tu pedido. ¿Qué te antoja hoy?'
    };
    return responses[agentId as keyof typeof responses] || 'Hola, soy un agente de IA en prueba.';
  };

  const formatMessageWithLineBreaks = (text: string) => {
  return text.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      {index < text.split('\n').length - 1 && <br />}
    </span>
  ));
};

const sendToWebhook = async (message: string, webhookUrl: string) => {
    const conversationId = localStorage.getItem(`conversationId_${selectedAgent}`) ||
                          `bdc41d22-a72b-47cf-b1ad-6d6a1e8fe13d-${Date.now()}`;

    if (!localStorage.getItem(`conversationId_${selectedAgent}`)) {
      localStorage.setItem(`conversationId_${selectedAgent}`, conversationId);
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();

    const payload = [{
      headers: {
        "host": "n8n.vivefelizsindolor.com",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
        "content-length": "98",
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "es-ES,es;q=0.9",
        "content-type": "application/json",
        "origin": "http://localhost:3002",
        "priority": "u=1, i",
        "referer": "http://localhost:3002/",
        "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Brave\";v=\"140\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "sec-gpc": "1",
        "x-forwarded-for": "181.32.155.251",
        "x-forwarded-host": "n8n.vivefelizsindolor.com",
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
        "message": message,
        "createdAt": createdAt
      },
      "webhookUrl": webhookUrl,
      "executionMode": "production"
    }];

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      // Si la respuesta no es JSON, intentar obtener el texto
      const textResponse = await response.text();
      throw new Error(`Respuesta no válida del servidor: ${textResponse.slice(0, 100)}`);
    }

    let responseText = '';
    if (Array.isArray(responseData) && responseData.length > 0) {
      const webhookResponse = responseData[0];
      responseText = webhookResponse.reply ||
                      webhookResponse.response?.message ||
                      webhookResponse.body?.response ||
                      webhookResponse.body?.message ||
                      webhookResponse.output ||
                      webhookResponse.message ||
                      '';
    } else if (responseData && typeof responseData === 'object') {
      responseText = responseData.reply ||
                      responseData.response?.message ||
                      responseData.response ||
                      responseData.body?.response ||
                      responseData.body?.message ||
                      responseData.output ||
                      responseData.message ||
                      '';
    }

    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText || `Recibí tu mensaje sobre ${selectedAgent}.`,
      sender: 'agent',
      timestamp: new Date(),
      agentId: selectedAgent
    };

    setMessages(prev => [...prev, agentMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      setInputText(prev => prev + '\n');
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      agentId: selectedAgent
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      if (selectedAgent === 'salud') {
        await sendToWebhook(inputText, WEBHOOK_CONFIG.salud);
      } else if (selectedAgent === 'comida') {
        await sendToWebhook(inputText, WEBHOOK_CONFIG.comida);
      } else {
        // Simular respuesta para otros agentes
        setTimeout(() => {
          const agentMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: getAgentResponse(selectedAgent),
            sender: 'agent',
            timestamp: new Date(),
            agentId: selectedAgent
          };
          setMessages(prev => [...prev, agentMessage]);
          setIsTyping(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      let errorMessage = 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.';

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'No puedo conectar con el servidor. Por favor verifica tu conexión a internet.';
        } else if (error.message.includes('Error HTTP')) {
          errorMessage = 'El servidor está experimentando problemas. Por favor intenta más tarde.';
        }
      }

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'agent',
        timestamp: new Date(),
        agentId: selectedAgent
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }
  };

  // All messages are for the current agent (loaded from localStorage)
  const displayMessages = messages;

  return (
    <div className="flex flex-col max-w-xl w-full mx-auto" style={{ maxHeight: '600px' }}>
      <div className="flex items-center justify-between mb-4 px-4 pt-4">
        <h3 className="text-lg font-semibold text-white tracking-tight">
          Chat de {selectedAgent === 'salud' ? 'Salud' : 'Comida'}
        </h3>
        <button
          onClick={clearChat}
          className="text-sm text-white/60 hover:text-white/80 hover:scale-105 transition-all duration-200 px-2 py-1 rounded hover:bg-white/10"
        >
          Limpiar chat
        </button>
      </div>
      <div className="overflow-y-auto space-y-3 mb-4 px-4 chat-scroll" style={{ maxHeight: '400px' }}>
        {displayMessages.length === 0 && (
          <div className="text-center text-white/60 text-sm py-8">
            <div className="mb-2">
              <svg className="w-8 h-8 mx-auto text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            Inicia una conversación con el asistente de {selectedAgent === 'salud' ? 'Salud' : 'Comida'}
          </div>
        )}

        {displayMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] message-bubble ${
                message.sender === 'user'
                  ? 'bg-white/35 text-white hover:bg-white/45'
                  : 'bg-white/20 text-white/90 hover:bg-white/25'
              }`}
              style={{
                boxShadow: message.sender === 'user' ? `0 0 15px ${theme.primary}20` : '0 0 10px rgba(255,255,255,0.1)'
              }}
            >
              <div className="text-sm whitespace-pre-wrap">{formatMessageWithLineBreaks(message.text)}</div>
              <div className="text-xs text-white/40 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div
              className="text-white/90 px-4 py-2 rounded-lg typing-indicator"
              style={{
                background: `${theme.primary}25`,
                border: `1px solid ${theme.primary}33`
              }}
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2 px-4 pb-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Escribe tu mensaje... (Ctrl+Enter para salto de línea)"
          className="flex-1 bg-white/10 text-white placeholder-white/40 px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:bg-white/15 transition-all duration-200 hover:border-white/30 hover:bg-white/15 chat-input resize-none"
          style={{
            minHeight: '44px',
            maxHeight: '120px',
            borderColor: `${theme.primary}20`
          }}
          onFocus={(e) => {
            e.target.style.borderColor = `${theme.primary}50`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = `${theme.primary}20`;
          }}
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 send-button"
          style={{
            background: `${theme.primary}30`,
            border: `1px solid ${theme.primary}40`
          }}
          onMouseEnter={(e) => {
            if (!inputText.trim()) return;
            e.currentTarget.style.background = `${theme.primary}40`;
            e.currentTarget.style.borderColor = `${theme.primary}60`;
            e.currentTarget.style.boxShadow = `0 8px 25px ${theme.primary}33`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${theme.primary}30`;
            e.currentTarget.style.borderColor = `${theme.primary}40`;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}