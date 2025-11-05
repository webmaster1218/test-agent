import React from 'react';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
}

export default function TypingIndicator({ className = '' }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center gap-2 p-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
        <Bot className="h-4 w-4 text-primary animate-pulse" />
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      <span className="text-xs text-muted-foreground font-medium">Marcos está escribiendo...</span>
    </div>
  );
}