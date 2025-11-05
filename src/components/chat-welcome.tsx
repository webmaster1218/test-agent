import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ChatWelcomeProps {
    onSuggestionClick: (suggestion: string) => void;
}

export default function ChatWelcome({ onSuggestionClick }: ChatWelcomeProps) {
    const suggestions = [
        "¿Cuáles son sus servicios?",
        "Quiero agendar una cita",
        "¿Cuál es su horario?",
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in fade-in-50 duration-500">
            {/* Icono premium con efectos modernos */}
            <div className="relative mb-8 group">
                <div className="relative p-6 rounded-3xl bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 group-hover:border-orange-500/40 group-hover:bg-orange-500/15 transition-all duration-300 shadow-lg">
                    <div className="relative">
                        <Bot className="h-14 w-14 text-orange-500 group-hover:scale-110 transition-all duration-300" />
                        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-orange-500 animate-pulse" />
                    </div>
                </div>
                {/* Efecto de halo moderno sin gradiente */}
                <div className="absolute -inset-3 bg-orange-500/10 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
            </div>

            {/* Mensaje de bienvenida con diseño mejorado */}
            <Card className="mb-8 p-6 bg-background/60 backdrop-blur-sm border border-orange-500/10 max-w-sm">
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-foreground">
                        Hola, soy Marcos
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Tu asistente virtual especializado. Estoy aquí para ayudarte con tus consultas de manera rápida y eficiente.
                    </p>
                </div>
            </Card>

            {/* Sugerencias con diseño shadcn */}
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
                            className="group justify-start h-auto px-4 py-3 text-xs border-orange-500/20 hover:border-orange-500/40 bg-background/60 backdrop-blur-sm hover:bg-orange-500/10 transition-all duration-300 rounded-lg hover:scale-[1.02] hover:shadow-md hover:shadow-orange-500/10"
                            onClick={() => onSuggestionClick(suggestion)}
                        >
                            <MessageCircle className="h-3 w-3 mr-2 text-orange-500" />
                            <span className="text-left">{suggestion}</span>
                            <Sparkles className="h-3 w-3 ml-auto text-orange-500/50 group-hover:text-orange-500 transition-colors" />
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}