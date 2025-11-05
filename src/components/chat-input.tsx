'use client';

import { useState, type KeyboardEvent, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="p-3 bg-orange-500/5 backdrop-blur-sm border-t border-orange-500/10">
      <form onSubmit={handleSubmit} className="flex items-start gap-3">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje al asistente..."
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-background/80 backdrop-blur-sm border border-orange-500/20 focus:border-orange-500/40 focus-visible:ring-2 focus-visible:ring-orange-500/20 resize-none max-h-32 rounded-lg transition-all duration-300 placeholder:text-muted-foreground/70 custom-scrollbar"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          aria-label="Enviar mensaje"
          style={{
            background: 'linear-gradient(to right, #FF6B35, rgba(255, 107, 53, 0.8))',
            color: 'white',
            border: 'none'
          }}
          className="rounded-full shrink-0 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-105 transition-all duration-300"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}