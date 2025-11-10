'use client';

import { useState, type KeyboardEvent, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getAgentTheme } from '@/lib/config/themes';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const isComidaRoute = pathname.includes('/comida');
  const agentType = isComidaRoute ? 'comida' : 'salud';
  const agentTheme = getAgentTheme(agentType);

  const getAgentColor = (opacity = '1') => {
    const hex = agentTheme.primary.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [input]);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div
      className="p-3 sm:p-4 backdrop-blur-sm border-t"
      style={{
        backgroundColor: getAgentColor('0.05'),
        borderColor: getAgentColor('0.1')
      }}
    >
      <form onSubmit={handleSubmit} className="flex items-start gap-2 sm:gap-3">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje al asistente..."
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-background/80 backdrop-blur-sm border resize-none max-h-32 rounded-lg transition-all duration-300 placeholder:text-muted-foreground/70 custom-scrollbar text-sm sm:text-base"
          style={{
            borderColor: getAgentColor('0.2')
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          aria-label="Enviar mensaje"
          style={{
            background: `linear-gradient(to right, ${agentTheme.primary}, ${agentTheme.primary}CC)`,
            color: 'white',
            border: 'none'
          }}
          className="rounded-full shrink-0 hover:shadow-lg hover:scale-105 transition-all duration-300 h-10 w-10 sm:h-10 sm:w-10"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}