'use client';

import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import ChatWelcome from './chat-welcome';
import TypingIndicator from './ui/typing-indicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePathname } from 'next/navigation';
import { getAgentTheme } from '@/lib/config/themes';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

export default function ChatMessages({ messages, isLoading, onSuggestionClick, className }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isComidaRoute = pathname.includes('/comida');
  const agentType = isComidaRoute ? 'comida' : 'salud';
  const agentTheme = getAgentTheme(agentType);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <ScrollArea className={cn("flex-1 chat-scroll", className)}>
      <div className="p-4 md:p-6 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <ChatWelcome onSuggestionClick={onSuggestionClick} />
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn('flex items-start gap-3 animate-in fade-in', {
                'justify-end': message.role === 'user',
                'justify-start': message.role === 'agent',
              })}
            >
              <div
                className={cn(
                  'max-w-xs md:max-w-md lg:max-w-xl rounded-lg px-4 py-3 text-base transition-all break-words shadow-sm',
                  {
                    'text-white rounded-br-sm shadow-lg': message.role === 'user',
                    'backdrop-blur-sm border rounded-bl-sm hover:bg-opacity-15 transition-colors duration-300': message.role === 'agent',
                  }
                )}
                style={{
                  backgroundColor: message.role === 'user' ? agentTheme.primary : `${agentTheme.primary}10`,
                  borderColor: message.role === 'agent' ? `${agentTheme.primary}20` : undefined,
                  boxShadow: message.role === 'user' ? `${agentTheme.primary}40 0 10px 15px -3px` : undefined
                }}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}