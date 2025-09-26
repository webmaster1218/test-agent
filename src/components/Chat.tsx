'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentId: string;
}

interface ChatProps {
  selectedAgent: string;
}

export default function Chat({ selectedAgent }: ChatProps) {
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

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(`chat_messages_${selectedAgent}`);
    localStorage.removeItem(`conversationId_${selectedAgent}`);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAgentResponse = (agentId: string): string => {
    const responses = {
      salud: 'Hola, soy tu asistente de Salud y Bienestar. Estoy aquí para ayudarte con consejos sobre nutrición, ejercicio, salud mental y hábitos saludables. ¿En qué puedo asistirte hoy?',
      comida: 'Hola, soy tu asistente de Gastronomía. Puedo ayudarte con recetas, técnicas de cocina, consejos de alimentación y recomendaciones culinarias. ¿Qué te gustaría preparar hoy?'
    };
    return responses[agentId as keyof typeof responses] || 'Hola, soy un agente de IA en prueba.';
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
        // Usar webhook para el chat de salud
        await sendToWebhook(inputText, 'https://n8n.vivefelizsindolor.com/webhook/d25d94ff-e996-4044-88e9-9a108118f0f4');
      } else if (selectedAgent === 'comida') {
        // Usar webhook para el chat de comida
        await sendToWebhook(inputText, 'https://n8n.vivefelizsindolor.com/webhook/ff3f992e-bf39-432a-9dad-05ce3ec14d26');
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
      // Mensaje de error más específico
      let errorMessage = 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.';

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'No puedo conectar con el servidor de salud. Por favor verifica tu conexión a internet.';
        } else if (error.message.includes('Error HTTP')) {
          errorMessage = 'El servidor de salud está experimentando problemas. Por favor intenta más tarde.';
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

  const sendToWebhook = async (message: string, webhookUrl: string) => {
    // Generar un conversationId único para esta sesión
    const conversationId = localStorage.getItem(`conversationId_${selectedAgent}`) ||
                          `bdc41d22-a72b-47cf-b1ad-6d6a1e8fe13d-${Date.now()}`;

    if (!localStorage.getItem(`conversationId_${selectedAgent}`)) {
      localStorage.setItem(`conversationId_${selectedAgent}`, conversationId);
    }

    // Usar la misma estructura que funcionaba para el chat de salud
    const payload = [{
      headers: {
        "host": "n8n.vivefelizsindolor.com",
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
        "message": message
      },
      "webhookUrl": webhookUrl,
      "executionMode": "production"
    }];

    console.log('Enviando al webhook:', payload);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('Respuesta status:', response.status);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Respuesta del webhook:', responseData);

    // Procesar la respuesta del webhook
    let responseText = '';

    // Si es un array, tomar el primer elemento
    if (Array.isArray(responseData) && responseData.length > 0) {
      const webhookResponse = responseData[0];
      console.log('Respuesta individual:', webhookResponse);

      responseText = webhookResponse.reply ||
                      webhookResponse.response?.message ||
                      webhookResponse.body?.response ||
                      webhookResponse.body?.message ||
                      webhookResponse.output ||
                      webhookResponse.message ||
                      '';
    }
    // Si es un objeto directo
    else if (responseData && typeof responseData === 'object') {
      console.log('Procesando como objeto directo');
      responseText = responseData.reply ||
                      responseData.response?.message ||
                      responseData.response ||
                      responseData.body?.response ||
                      responseData.body?.message ||
                      responseData.output ||
                      responseData.message ||
                      '';
    }

    console.log('Texto extraído:', responseText);

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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // All messages are for the current agent (loaded from localStorage)
  const displayMessages = messages;

  return (
    <div className="flex flex-col h-full max-w-xl w-full mx-auto">
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
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-4 max-h-104 chat-scroll">
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
                  ? 'bg-white/35 text-white hover:bg-white/45 hover:shadow-lg hover:shadow-blue-500/20'
                  : 'bg-white/20 text-white/90 hover:bg-white/25 hover:shadow-lg'
              }`}
            >
              <div className="text-sm">{message.text}</div>
              <div className="text-xs text-white/40 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white/25 text-white/90 px-4 py-2 rounded-lg typing-indicator">
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
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje..."
          className="flex-1 bg-white/10 text-white placeholder-white/40 px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-200 hover:border-white/30 hover:bg-white/15 chat-input"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="bg-white/20 hover:bg-white/30 hover:shadow-lg hover:shadow-blue-500/20 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 send-button"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}