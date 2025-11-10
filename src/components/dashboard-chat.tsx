import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat-interface";
import { Bot, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { getAgentTheme } from "@/lib/config/themes";

export function DashboardChat() {
  const pathname = usePathname();
  const isComidaRoute = pathname.includes('/comida');
  const agentType = isComidaRoute ? 'comida' : 'salud';
  const agentTheme = getAgentTheme(agentType);

  const getAgentColor = (opacity = '1') => {
    // Convertir hex a rgba con la opacidad deseada
    const hex = agentTheme.primary.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div className="relative group h-full">
      {/* Fondo con gradiente sutil */}
      <div className="absolute inset-0 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{
             background: `linear-gradient(to bottom right, ${getAgentColor('0.05')}, ${getAgentColor('0.08')}, transparent)`
           }}>
      </div>

      <Card className="relative h-full bg-background/60 backdrop-blur-sm transition-all duration-300 overflow-hidden flex flex-col"
            style={{
              borderColor: getAgentColor('0.2'),
              zIndex: 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = getAgentColor('0.4');
              e.currentTarget.style.boxShadow = `0 10px 15px -3px ${getAgentColor('0.15')}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = getAgentColor('0.2');
              e.currentTarget.style.boxShadow = 'none';
            }}>

        {/* Línea decorativa superior */}
        <div className="absolute top-0 left-0 right-0 h-0.5"
             style={{
               background: `linear-gradient(to right, ${getAgentColor('0.6')}, transparent)`
             }}>
        </div>

        <CardHeader className="flex flex-row items-center gap-2 p-3 relative z-10"
                   style={{ borderBottom: `1px solid ${getAgentColor('0.1')}` }}>
          <div className="relative p-1.5 rounded-lg transition-all duration-300"
               style={{
                 backgroundColor: getAgentColor('0.05')
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = getAgentColor('0.1');
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = getAgentColor('0.05');
               }}>
            <Bot className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                 style={{ color: agentTheme.primary }} />
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                 style={{
                   background: `linear-gradient(to right, ${getAgentColor('0.2')}, transparent)`
                 }}>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-sm transition-all duration-300 group-hover:scale-105"
                style={{
                  background: `linear-gradient(to right, currentColor, ${agentTheme.primary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
              Chat de {agentTheme.name}
            </h3>
            <p className="text-xs text-muted-foreground transition-colors duration-300"
               onMouseEnter={(e) => {
                 e.currentTarget.style.color = getAgentColor('0.7');
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.color = '';
               }}>
              Conversaciones en tiempo real
            </p>
          </div>

          <div className="relative p-1.5 rounded-lg transition-all duration-300"
               style={{
                 backgroundColor: getAgentColor('0.05')
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = getAgentColor('0.1');
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = getAgentColor('0.05');
               }}>
            <MessageCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110"
                         style={{ color: agentTheme.primary }} />
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                 style={{
                   background: `linear-gradient(to right, ${getAgentColor('0.2')}, transparent)`
                 }}>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <ChatInterface />
        </CardContent>

        {/* Línea decorativa inferior */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
             style={{
               background: `linear-gradient(to right, ${agentTheme.primary}, transparent)`
             }}>
        </div>

        {/* Efecto de hover en toda la tarjeta */}
        <div className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"
             style={{
               background: `linear-gradient(to right, ${getAgentColor('0.1')}, ${getAgentColor('0.08')})`
             }}>
        </div>
      </Card>
    </div>
  );
}