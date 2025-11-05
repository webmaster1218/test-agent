import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat-interface";
import { Bot, MessageCircle } from "lucide-react";

export function DashboardChat() {
  return (
    <div className="relative group h-full">
      {/* Fondo con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C8082]/5 via-[#2C8082]/8 to-transparent rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <Card className="relative h-full bg-background/60 backdrop-blur-sm border-[#2C8082]/20 hover:border-[#2C8082]/40 hover:shadow-lg hover:shadow-[#2C8082]/15 transition-all duration-300 overflow-hidden flex flex-col"
            style={{ zIndex: 1 }}>

        {/* Línea decorativa superior */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2C8082]/60 to-transparent"></div>

        <CardHeader className="flex flex-row items-center gap-2 p-3 border-b border-[#2C8082]/10 relative z-10">
          <div className="relative p-1.5 rounded-lg bg-[#2C8082]/5 group-hover:bg-[#2C8082]/10 transition-all duration-300">
            <Bot className="h-5 w-5 text-[#2C8082] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            {/* Efecto de brillo en el icono */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2C8082]/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm bg-gradient-to-r from-foreground to-[#2C8082] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Marcos Chat
            </p>
            <p className="text-xs text-muted-foreground group-hover:text-[#2C8082]/70 transition-colors duration-300">
              Agente IA Asistente
            </p>
          </div>
          <div className="relative p-1.5 rounded-lg bg-[#2C8082]/5 group-hover:bg-[#2C8082]/10 transition-all duration-300">
            <MessageCircle className="h-4 w-4 text-[#2C8082] group-hover:scale-110 transition-all duration-300" />
            {/* Efecto de brillo en el icono */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2C8082]/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col relative z-10 min-h-0">
          <div className="flex-1 min-h-0">
            <ChatInterface show_header={false} />
          </div>
        </CardContent>

        {/* Efecto de borde inferior animado */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#2C8082] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </Card>

      {/* Efecto de brillo externo en hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2C8082]/10 to-[#1f5a5c]/10 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
    </div>
  );
}