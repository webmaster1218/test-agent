import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { usePathname } from 'next/navigation';
import { getAgentTheme } from '@/lib/config/themes';

interface ChatWelcomeProps {
    onSuggestionClick: (suggestion: string) => void;
}

export default function ChatWelcome({ onSuggestionClick }: ChatWelcomeProps) {
    const pathname = usePathname();
    const isComidaRoute = pathname.includes('/comida');
    const agentType = isComidaRoute ? 'comida' : 'salud';
    const agentTheme = getAgentTheme(agentType);

    const suggestions = [
        "¿Cuáles son sus servicios?",
        "Quiero agendar una cita",
        "¿Cuál es su horario?",
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in fade-in-50 duration-500">
            {/* Icono con diseño simple */}
            <div className="relative mb-8">
                <div className="relative p-6 rounded-3xl backdrop-blur-sm border shadow-lg"
                    style={{
                        backgroundColor: `${agentTheme.primary}10`,
                        borderColor: `${agentTheme.primary}20`
                    }}>
                    <div className="relative">
                        <Bot className="h-14 w-14" style={{ color: agentTheme.primary }} />
                        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 animate-pulse" style={{ color: agentTheme.primary }} />
                    </div>
                </div>
            </div>

            {/* Descripción */}
            <div className="mb-6 max-w-sm">
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    Hola, soy tu asistente virtual de {agentType === 'salud' ? 'salud' : 'comida'}. Estoy aquí para ayudarte con tus consultas.
                </p>
            </div>

            {/* Sugerencias */}
            <div className="flex flex-col gap-3 w-full max-w-md">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Sugerencias rápidas
                </p>
                <div className="grid grid-cols-1 gap-2">
                    {suggestions.map((suggestion) => (
                        <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            className="group justify-start h-auto px-4 py-3 text-xs bg-background/60 backdrop-blur-sm transition-all duration-300 rounded-lg"
                            onClick={() => onSuggestionClick(suggestion)}
                        >
                            <MessageCircle className="h-3 w-3 mr-2" style={{ color: agentTheme.primary }} />
                            <span className="text-left">{suggestion}</span>
                            <Sparkles
                                className="h-3 w-3 ml-auto transition-colors group-hover:opacity-100"
                                style={{
                                    color: `${agentTheme.primary}80`,
                                    opacity: '0.5'
                                }}
                            />
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}