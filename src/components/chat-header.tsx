import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  onReset: () => void;
}

export default function ChatHeader({ onReset }: ChatHeaderProps) {
  return (
    <header className="bg-background/95 backdrop-blur-md p-4 flex items-center justify-between border-b border-border/50 shadow-sm">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold tracking-tight">MARCOS</h1>
          <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-500 border-orange-500/20">
            Activo
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground font-medium">Asistente Virtual</p>
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