'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, BrainCircuit, Smile, PartyPopper, Heart, Upload, Settings, Info, MapPin, Phone, AlertCircle, CheckCircle, CalendarDays, ChefHat, Sparkles, Palette, MessageSquare, Clock, Bot, Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

// Importar temas desde el sistema centralizado
import { agentThemes, getAgentTheme } from '@/lib/config/themes';

export default function SettingsComidaPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Inicializar el tema
  useEffect(() => {
    setMounted(true);
  }, []);

  // Obtener tema del agente desde el sistema centralizado
  const agentTheme = getAgentTheme('comida');

  // Helper para obtener el color según el agente
  const getAgentColor = (property: 'primary' | 'secondary' | 'accent' = 'primary') => {
    return agentTheme[property];
  };

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [appointmentDuration, setAppointmentDuration] = useState([45]);
  const [appointmentBuffer, setAppointmentBuffer] = useState([15]);
  const [emojiLevel, setEmojiLevel] = useState('few');
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [sendReminders, setSendReminders] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <ScrollArea className="h-full">
        <div className="max-w-7xl mx-auto space-y-6">
  
          {/* Alerta de estado */}
          {saveStatus !== 'idle' && (
            <Alert className={`border-2 ${
              saveStatus === 'saved' ? 'border-[#FF6B35]/50 bg-[#FF6B35]/10' :
              saveStatus === 'saving' ? 'border-blue-500/50 bg-blue-500/10' :
              'border-red-500/50 bg-red-500/10'
            }`}>
              {saveStatus === 'saving' && (
                <>
                  <AlertCircle className="h-4 w-4 animate-spin text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Guardando configuración...
                  </AlertDescription>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle className="h-4 w-4 text-[#FF6B35]" />
                  <AlertDescription className="text-[#FF6B35]">
                    ¡Configuración guardada exitosamente!
                  </AlertDescription>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    Error al guardar. Inténtalo nuevamente.
                  </AlertDescription>
                </>
              )}
            </Alert>
          )}

          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Ajustes de Agente de Comida</h1>
              <p className="text-sm text-muted-foreground mt-1">Configuración del agente y del negocio</p>
            </div>

            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] shadow-lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar cambios</DialogTitle>
                  <DialogDescription>
                    ¿Guardar todos los cambios en la configuración del agente de comida?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSaveDialog(false);
                      handleSave();
                    }}
                    className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]"
                  >
                    Confirmar y Guardar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
          </header>

          <Tabs defaultValue="agent" className="space-y-6">
          <TabsList className="grid w-48 grid-cols-2">
            <TabsTrigger value="agent" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Agente
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Negocio
            </TabsTrigger>
          </TabsList>

            {/* Pestaña de Configuración del Agente */}
            <TabsContent value="agent" className="mt-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Identidad y Personalidad */}
                <Card className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                      <Palette className="h-5 w-5 text-[#FF6B35]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Identidad del Agente</p>
                      <p className="text-xs text-muted-foreground">Nombre, avatar y personalidad</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="agent-name" className="text-[#FF6B35] font-medium">Nombre</Label>
                      <Input
                        id="agent-name"
                        defaultValue="Marcos Comida"
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#FF6B35] font-medium">Avatar</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 border-2 border-[#FF6B35]/30">
                          <AvatarImage src="/agent-avatar-comida.jpg" />
                          <AvatarFallback className="bg-gradient-to-br from-[#FF6B35]/20 to-[#FF8C42]/20">
                            <ChefHat className="w-8 h-8 text-[#FF6B35]" />
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" className="border-[#FF6B35]/30 hover:bg-[#FF6B35]/10">
                          <Upload className="mr-2 h-4 w-4" />
                          Cambiar
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[#FF6B35] font-medium">Personalidad</Label>
                      <RadioGroup defaultValue="friendly" className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-[#FF6B35]/20 hover:bg-[#FF6B35]/5 transition-colors">
                          <RadioGroupItem value="professional" id="professional" />
                          <Label htmlFor="professional" className="flex items-center gap-2 cursor-pointer">
                            <BrainCircuit className="h-4 w-4 text-[#FF6B35]" />
                            <span>Profesional</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-[#FF6B35]/20 hover:bg-[#FF6B35]/5 transition-colors">
                          <RadioGroupItem value="friendly" id="friendly" />
                          <Label htmlFor="friendly" className="flex items-center gap-2 cursor-pointer">
                            <Smile className="h-4 w-4 text-[#FF6B35]" />
                            <span>Amigable</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-[#FF6B35]/20 hover:bg-[#FF6B35]/5 transition-colors">
                          <RadioGroupItem value="charismatic" id="charismatic" />
                          <Label htmlFor="charismatic" className="flex items-center gap-2 cursor-pointer">
                            <PartyPopper className="h-4 w-4 text-[#FF6B35]" />
                            <span>Carismático</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-[#FF6B35]/20 hover:bg-[#FF6B35]/5 transition-colors">
                          <RadioGroupItem value="empathetic" id="empathetic" />
                          <Label htmlFor="empathetic" className="flex items-center gap-2 cursor-pointer">
                            <Heart className="h-4 w-4 text-[#FF6B35]" />
                            <span>Empático</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </Card>

                {/* Estilo de Comunicación */}
                <Card className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                      <MessageSquare className="h-5 w-5 text-[#FF6B35]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estilo de Comunicación</p>
                      <p className="text-xs text-muted-foreground">Tono, lenguaje y expresiones</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="agent-greeting" className="text-[#FF6B35] font-medium">Saludo Personalizado</Label>
                      <Textarea
                        id="agent-greeting"
                        placeholder="¡Hola! Soy tu asistente de comida. ¿Qué te gustaría ordenar?"
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agent-regionalisms" className="text-[#FF6B35] font-medium">Expresiones Colombianas</Label>
                      <Textarea
                        id="agent-regionalisms"
                        placeholder="¡Qué más pues!, Con mucho gusto, ¡Listo pues!"
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agent-emojis" className="text-[#FF6B35] font-medium">Nivel de Emojis</Label>
                      <Select value={emojiLevel} onValueChange={setEmojiLevel}>
                        <SelectTrigger className="border-[#FF6B35]/20 focus:border-[#FF6B35]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            <div className="flex items-center gap-2">
                              <span>Ninguno</span>
                              <Badge variant="outline">😐</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="few">
                            <div className="flex items-center gap-2">
                              <span>Pocos</span>
                              <Badge variant="outline">😊</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="moderate">
                            <div className="flex items-center gap-2">
                              <span>Moderado</span>
                              <Badge variant="outline">🎉</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="abundant">
                            <div className="flex items-center gap-2">
                              <span>Abundante</span>
                              <Badge variant="outline">🌟</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="response-length" className="text-[#FF6B35] font-medium">Longitud de Respuestas</Label>
                      <Select defaultValue="moderate">
                        <SelectTrigger className="border-[#FF6B35]/20 focus:border-[#FF6B35]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brief">Breve</SelectItem>
                          <SelectItem value="moderate">Moderada</SelectItem>
                          <SelectItem value="detailed">Detallada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Plantillas de Mensajes */}
              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                    <Sparkles className="h-5 w-5 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Plantillas de Mensajes</p>
                    <p className="text-xs text-muted-foreground">Mensajes automáticos del sistema</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="template-confirmation" className="text-[#FF6B35] font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Confirmación
                      </Label>
                      <Textarea
                        id="template-confirmation"
                        placeholder="Tu pedido está confirmado para..."
                        defaultValue="🍽️ Pedido confirmado con éxito. Te esperamos a la hora programada."
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 resize-none"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-reminder" className="text-[#FF6B35] font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Recordatorio
                      </Label>
                      <Textarea
                        id="template-reminder"
                        placeholder="Te recordamos tu pedido..."
                        defaultValue="¡Hola! Solo para recordarte tu pedido de hoy a las [HORA]. ¡Te esperamos!"
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 resize-none"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-fallback" className="text-[#FF6B35] font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Escalación
                      </Label>
                      <Textarea
                        id="template-fallback"
                        placeholder="Cuando necesito ayuda..."
                        defaultValue="Te voy a conectar con un especialista para mejor atender tu solicitud."
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 resize-none"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Pestaña de Configuración de Negocio */}
            <TabsContent value="business" className="mt-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Horarios y Operación */}
                <Card className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                      <CalendarDays className="h-5 w-5 text-[#FF6B35]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Horarios y Operación</p>
                      <p className="text-xs text-muted-foreground">Disponibilidad y tiempos de servicio</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="work-days" className="text-[#FF6B35] font-medium">Días de Servicio</Label>
                      <Input
                        id="work-days"
                        defaultValue="Lunes a Domingo"
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="work-hours" className="text-[#FF6B35] font-medium">Horario de Atención</Label>
                      <Input
                        id="work-hours"
                        defaultValue="8:00 AM - 10:00 PM"
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="booking-lead-time" className="text-[#FF6B35] font-medium">Tiempo Mínimo de Pedido</Label>
                      <Input
                        id="booking-lead-time"
                        defaultValue="30 minutos"
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[#FF6B35] font-medium">Tiempo de Preparación</Label>
                      <Slider
                        value={appointmentDuration}
                        onValueChange={setAppointmentDuration}
                        max={120}
                        min={15}
                        step={15}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>15 min</span>
                        <span className="font-medium text-[#FF6B35]">{appointmentDuration[0]} minutos</span>
                        <span>120 min</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label className="text-[#FF6B35] font-medium">Automatización</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-[#FF6B35]/20">
                          <div>
                            <Label htmlFor="auto-confirm" className="font-medium">Confirmación Automática</Label>
                            <p className="text-sm text-muted-foreground">Confirmar pedidos sin intervención manual</p>
                          </div>
                          <Switch
                            id="auto-confirm"
                            checked={autoConfirm}
                            onCheckedChange={setAutoConfirm}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-[#FF6B35]/20">
                          <div>
                            <Label htmlFor="send-reminders" className="font-medium">Recordatorios</Label>
                            <p className="text-sm text-muted-foreground">Notificar a los clientes automáticamente</p>
                          </div>
                          <Switch
                            id="send-reminders"
                            checked={sendReminders}
                            onCheckedChange={setSendReminders}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Información del Negocio */}
                <Card className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                      <MapPin className="h-5 w-5 text-[#FF6B35]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Información del Negocio</p>
                      <p className="text-xs text-muted-foreground">Datos de contacto y ubicación</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="business-address" className="text-[#FF6B35] font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Dirección
                      </Label>
                      <Input
                        id="business-address"
                        defaultValue="Cra. 80A #32ee-72, Local 123 Laureles - Estadio, Medellín"
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                      />
                      <Badge variant="outline" className="bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20">
                        Ubicación configurada
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-phones" className="text-[#FF6B35] font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Teléfonos
                      </Label>
                      <Input
                        id="contact-phones"
                        defaultValue="+57 300 123 4567, +57 312 456 7890"
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                      />
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20">WhatsApp</Badge>
                        <Badge variant="secondary" className="bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20">Llamadas</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="social-media" className="text-[#FF6B35] font-medium">Redes Sociales</Label>
                      <Input
                        id="social-media"
                        defaultValue="Instagram: @comida_deliciosa, Facebook: /comida_deliciosa"
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                      />
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="border-[#FF6B35]/30">📷 Instagram</Badge>
                        <Badge variant="outline" className="border-[#FF6B35]/30">📘 Facebook</Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="cancellation-policy" className="text-[#FF6B35] font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Política de Cancelación
                      </Label>
                      <Textarea
                        id="cancellation-policy"
                        defaultValue="Las cancelaciones deben realizarse con al menos 1 hora de anticipación para evitar cargos. Cancelaciones en el último momento tendrán un cargo del 30% del valor del pedido."
                        className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}