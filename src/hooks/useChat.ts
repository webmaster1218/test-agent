'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types';
import { WEBHOOK_CONFIG } from '@/lib/config/constants';

export function useChat(selectedAgent: string) {
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
  };

  const getAgentResponse = (agentId: string): string => {
    const responses = {
      salud: 'Hola, soy tu asistente de Salud y Bienestar. Estoy aquí para ayudarte con consejos sobre nutrición, ejercicio, salud mental y hábitos saludables. ¿En qué puedo asistirte hoy?',
      comida: 'Hola, soy tu asistente de Gastronomía. Puedo ayudarte con recetas, técnicas de cocina, consejos de alimentación y recomendaciones culinarias. ¿Qué te gustaría preparar hoy?'
    };
    return responses[agentId as keyof typeof responses] || 'Hola, soy un agente de IA en prueba.';
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

  const sendToWebhook = async (message: string, webhookUrl: string) => {
    const conversationId = localStorage.getItem(`conversationId_${selectedAgent}`) ||
                          `bdc41d22-a72b-47cf-b1ad-6d6a1e8fe13d-${Date.now()}`;

    if (!localStorage.getItem(`conversationId_${selectedAgent}`)) {
      localStorage.setItem(`conversationId_${selectedAgent}`, conversationId);
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
        "messageId": messageId,
        "message": message
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

    const responseData = await response.json();

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

  return {
    messages,
    inputText,
    setInputText,
    isTyping,
    messagesEndRef,
    handleKeyPress,
    handleSend,
    clearChat,
    // All messages are for the current agent (loaded from localStorage)
    displayMessages: messages
  };
}