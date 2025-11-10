import { RotateCcw, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { getAgentTheme } from '@/lib/config/themes';

interface ChatHeaderProps {
  onReset: () => void;
}

export default function ChatHeader({ onReset }: ChatHeaderProps) {
  const pathname = usePathname();
  const isComidaRoute = pathname.includes('/comida');
  const agentType = isComidaRoute ? 'comida' : 'salud';
  const agentTheme = getAgentTheme(agentType);

  return (
    <header className="bg-background/95 backdrop-blur-md p-4 flex items-center justify-between border-b border-border/50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Bot
            className="h-5 w-5"
            style={{ color: agentTheme.primary }}
          />
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Conversación Activa
          </h1>
        </div>
        <span className="text-sm text-muted-foreground">
          Chatea con el asistente de {agentType === 'salud' ? 'salud' : 'comida'}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        aria-label="Borrar historial del chat"
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        <span className="text-sm">Limpiar</span>
      </Button>
    </header>
  );
}