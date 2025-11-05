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
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, BrainCircuit, Smile, PartyPopper, Heart, Upload, Settings, Info, MapPin, Phone, AlertCircle, CheckCircle, CalendarDays, ChefHat } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsComidaPage() {
  // Aplicar tema de comida
  useEffect(() => {
    // Aplicar atributo data-theme al elemento html
    document.documentElement.setAttribute('data-theme', 'comida');

    // Limpiar al desmontar el componente
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);
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
    <div className="p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Fondo con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/1 via-transparent to-[#FF6B35]/0.5 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Alerta de estado */}
        {saveStatus !== 'idle' && (
          <div className="mb-4">
            {saveStatus === 'saving' && (
              <Alert>
                <AlertCircle className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Guardando cambios...
                  <Progress value={66} className="mt-2 h-2" />
                </AlertDescription>
              </Alert>
            )}
            {saveStatus === 'saved' && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  ¡Cambios guardados exitosamente para el agente de comida!
                </AlertDescription>
              </Alert>
            )}
            {saveStatus === 'error' && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  Error al guardar los cambios. Por favor intenta nuevamente.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Header Premium */}
        <div className="relative flex items-center justify-center gap-1 mb-8">
          {/* Fondo con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/5 via-[#FF6B35]/10 to-transparent rounded-xl -z-10"></div>

          {/* Título con efecto de brillo */}
          <div className="relative group">
            <h2 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-[#FF6B35] to-[#FF4500] bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              Configuración del Sistema - Agente Comida
              <Badge variant="secondary" className="ml-2 text-xs">
                v2.0
              </Badge>
            </h2>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF6B35] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Línea divisora animada */}
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/30 to-transparent"></div>
        </div>

        <Tabs defaultValue="agent" className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <TabsList className="mb-4 md:mb-0 bg-gradient-to-r from-[#FF6B35]/10 to-[#1f5a5c]/10 border border-[#FF6B35]/20 backdrop-blur-sm">
              <TabsTrigger value="agent" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B35] data-[state=active]:to-[#1f5a5c] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#FF6B35]/25 transition-all duration-300">
                Configuración del Agente
              </TabsTrigger>
              <TabsTrigger value="business" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B35] data-[state=active]:to-[#1f5a5c] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#FF6B35]/25 transition-all duration-300">
                Configuración de Negocio
              </TabsTrigger>
            </TabsList>
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#FF6B35] to-[#1f5a5c] hover:from-[#236667] hover:to-[#1a4546] shadow-lg shadow-[#FF6B35]/25 hover:shadow-[#FF6B35]/40 transition-all duration-300">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar cambios</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que deseas guardar todos los cambios realizados en la configuración del agente de comida?
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
                    className="bg-gradient-to-r from-[#FF6B35] to-[#1f5a5c]"
                  >
                    Confirmar y Guardar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Pestaña de Configuración del Agente */}
          <TabsContent value="agent" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="p-2 rounded-md bg-primary/10">
                      <BrainCircuit className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Identidad y Personalidad</p>
                      <p className="text-xs text-muted-foreground">Define identidad visual y tono del agente</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="agent-name" className="text-[#FF6B35] font-medium">Nombre del agente</Label>
                      <Input id="agent-name" defaultValue="Marcos Comida" className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agent-avatar" className="text-[#FF6B35] font-medium">Foto/Avatar</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 border-2 border-[#FF6B35]/30">
                          <AvatarImage src="/agent-avatar-comida.jpg" alt="Avatar del agente de comida" />
                          <AvatarFallback className="bg-gradient-to-br from-[#FF6B35]/20 to-[#1f5a5c]/20">
                            <BrainCircuit className="w-8 h-8 text-[#FF6B35]" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Input id="agent-avatar" type="file" className="hidden" />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('agent-avatar')?.click()}
                            className="border-[#FF6B35]/30 hover:bg-gradient-to-r hover:from-[#FF6B35]/10 hover:to-transparent hover:border-[#FF6B35] transition-all duration-300"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Cambiar Imagen
                          </Button>
                          <p className="text-xs text-gray-500 mt-1">
                            Formatos: JPG, PNG. Máximo 2MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[#FF6B35] font-medium">Personalidad (Control Emocional)</Label>
                      <RadioGroup defaultValue="friendly" className="grid grid-cols-2 gap-4">
                        <Label className="flex flex-col items-center justify-center rounded-xl border-2 border-[#FF6B35]/20 bg-gradient-to-br from-white/50 to-white/10 p-4 hover:bg-gradient-to-r hover:from-[#FF6B35]/10 hover:to-transparent peer-data-[state=checked]:border-[#FF6B35] peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-[#FF6B35]/20 peer-data-[state=checked]:to-transparent cursor-pointer transition-all duration-300">
                          <RadioGroupItem value="professional" id="personality-professional" className="sr-only" />
                          <BrainCircuit className="mb-3 h-6 w-6 text-[#FF6B35]" />
                          <span className="text-sm font-medium">Profesional y Formal</span>
                        </Label>
                        <Label className="flex flex-col items-center justify-center rounded-xl border-2 border-[#FF6B35]/20 bg-gradient-to-br from-white/50 to-white/10 p-4 hover:bg-gradient-to-r hover:from-[#FF6B35]/10 hover:to-transparent peer-data-[state=checked]:border-[#FF6B35] peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-[#FF6B35]/20 peer-data-[state=checked]:to-transparent cursor-pointer transition-all duration-300">
                          <RadioGroupItem value="friendly" id="personality-friendly" className="sr-only" />
                          <Smile className="mb-3 h-6 w-6 text-[#FF6B35]" />
                          <span className="text-sm font-medium">Amigable y Cercano</span>
                        </Label>
                        <Label className="flex flex-col items-center justify-center rounded-xl border-2 border-[#FF6B35]/20 bg-gradient-to-br from-white/50 to-white/10 p-4 hover:bg-gradient-to-r hover:from-[#FF6B35]/10 hover:to-transparent peer-data-[state=checked]:border-[#FF6B35] peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-[#FF6B35]/20 peer-data-[state=checked]:to-transparent cursor-pointer transition-all duration-300">
                          <RadioGroupItem value="charismatic" id="personality-charismatic" className="sr-only" />
                          <PartyPopper className="mb-3 h-6 w-6 text-[#FF6B35]" />
                          <span className="text-sm font-medium">Carismático y Divertido</span>
                        </Label>
                        <Label className="flex flex-col items-center justify-center rounded-xl border-2 border-[#FF6B35]/20 bg-gradient-to-br from-white/50 to-white/10 p-4 hover:bg-gradient-to-r hover:from-[#FF6B35]/10 hover:to-transparent peer-data-[state=checked]:border-[#FF6B35] peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-[#FF6B35]/20 peer-data-[state=checked]:to-transparent cursor-pointer transition-all duration-300">
                          <RadioGroupItem value="empathetic" id="personality-empathetic" className="sr-only" />
                          <Heart className="mb-3 h-6 w-6 text-[#FF6B35]" />
                          <span className="text-sm font-medium">Empático y Cálido</span>
                        </Label>
                      </RadioGroup>
                    </div>
                  </div>
                </Card>

                <div className="flex flex-col gap-6">
                  <Card className="p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 rounded-md bg-primary/10">
                        <Smile className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Comunicación y Estilo</p>
                        <p className="text-xs text-muted-foreground">Define cómo se expresa el agente</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="agent-greeting" className="text-[#FF6B35] font-medium">Frases de saludo personalizadas</Label>
                        <Textarea
                          id="agent-greeting"
                          placeholder="Ej: ¡Hola! Soy tu asistente virtual de comida. ¿Qué te gustaría ordenar hoy?"
                          className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300 resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agent-regionalisms" className="text-[#FF6B35] font-medium">Expresiones regionales (colombianismos)</Label>
                        <Textarea
                          id="agent-regionalisms"
                          placeholder="Ej: '¡Qué más pues!', 'Con mucho gusto'"
                          className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300 resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="agent-emojis" className="text-[#FF6B35] font-medium">Nivel de emojis</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Info className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">Niveles de emojis:</h4>
                                <div className="text-sm space-y-1">
                                  <p><strong>Ninguno:</strong> Sin emojis en las respuestas</p>
                                  <p><strong>Pocos:</strong> 1-2 emojis por mensaje</p>
                                  <p><strong>Moderado:</strong> 3-5 emojis por mensaje</p>
                                  <p><strong>Abundante:</strong> 6+ emojis por mensaje</p>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Select value={emojiLevel} onValueChange={setEmojiLevel}>
                          <SelectTrigger id="agent-emojis" className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300">
                            <SelectValue placeholder="Selecciona un nivel" />
                          </SelectTrigger>
                          <SelectContent className="border-[#FF6B35]/20 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm">
                            <SelectItem value="none" className="hover:bg-[#FF6B35]/10">
                              <div className="flex items-center gap-2">
                                <span>Ninguno</span>
                                <Badge variant="outline">😐</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="few" className="hover:bg-[#FF6B35]/10">
                              <div className="flex items-center gap-2">
                                <span>Pocos</span>
                                <Badge variant="outline">😊</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="moderate" className="hover:bg-[#FF6B35]/10">
                              <div className="flex items-center gap-2">
                                <span>Moderado</span>
                                <Badge variant="outline">🎉</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="abundant" className="hover:bg-[#FF6B35]/10">
                              <div className="flex items-center gap-2">
                                <span>Abundante</span>
                                <Badge variant="outline">🌟</Badge>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 rounded-md bg-primary/10">
                        <Settings className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Comportamiento Conversacional</p>
                        <p className="text-xs text-muted-foreground">Ajusta cómo interactúa el agente</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="response-length" className="text-[#FF6B35] font-medium">Longitud de respuestas</Label>
                        <Select defaultValue="moderate">
                          <SelectTrigger id="response-length" className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-[#FF6B35]/20 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm">
                            <SelectItem value="brief" className="hover:bg-[#FF6B35]/10">Breve</SelectItem>
                            <SelectItem value="moderate" className="hover:bg-[#FF6B35]/10">Moderada</SelectItem>
                            <SelectItem value="detailed" className="hover:bg-[#FF6B35]/10">Detallada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <Card className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Save className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mensajes Automáticos</p>
                    <p className="text-xs text-muted-foreground">Edita plantillas de mensajes clave</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-confirmation" className="text-[#FF6B35] font-medium">Confirmación de pedido</Label>
                    <Textarea
                      id="template-confirmation"
                      placeholder="Tu pedido está confirmado para..."
                      rows={10}
                      defaultValue={`🍽️ PEDIDO CONFIRMADO - SISTEMA DE COMIDA

👤 Informacion del Cliente:
Nombre: [NOMBRE_COMPLETO]
Telefono: [TELEFONO_RECOLECTADO]
Email: [EMAIL_RECOLECTADO]

📋 Detalles del Pedido:
Fecha: [DÍA, NÚMERO de MES de AÑO]
Hora: [HORA con a. m. o p. m.]
Tipo: [TIPO DE COMIDA]
Precio: [PRECIO TOTAL]
Abono para confirmar: [VALOR ABONO] (tienes 24 horas para dejarlo y asegurar tu reserva)
Modalidad: [PRESENCIAL/DELIVERY]`}
                      className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300 resize-none font-mono text-sm"
                    />
                    <Button variant="outline" size="sm" className="border-[#FF6B35]/30 hover:bg-gradient-to-r hover:from-[#FF6B35]/10 hover:to-transparent transition-all duration-300">Editar</Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-reminder" className="text-[#FF6B35] font-medium">Recordatorio de pedido</Label>
                    <Textarea
                      id="template-reminder"
                      placeholder="Te recordamos tu pedido de hoy..."
                      defaultValue="¡Hola! Solo para recordarte tu pedido de hoy a las [HORA]. ¡Te esperamos!"
                      className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300 resize-none"
                    />
                    <Button variant="outline" size="sm" className="border-[#FF6B35]/30 hover:bg-gradient-to-r hover:from-[#FF6B35]/10 hover:to-transparent transition-all duration-300">Editar</Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-fallback" className="text-[#FF6B35] font-medium">Cuando no puedo ayudar (escalación)</Label>
                    <Textarea
                      id="template-fallback"
                      placeholder="En un momento te contacto con..."
                      defaultValue="Entendido. Para ayudarte mejor con este pedido, te voy a comunicar con un especialista de nuestro equipo."
                      className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300 resize-none"
                    />
                    <Button variant="outline" size="sm" className="border-[#FF6B35]/30 hover:bg-gradient-to-r hover:from-[#FF6B35]/10 hover:to-transparent transition-all duration-300">Editar</Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Pestaña de Configuración de Negocio */}
          <TabsContent value="business" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-2 rounded-md bg-primary/10">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Horarios y Disponibilidad</p>
                    <p className="text-xs text-muted-foreground">Configura horarios y gestión de pedidos</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="work-days" className="text-[#FF6B35] font-medium">Días laborales</Label>
                    <Input id="work-days" defaultValue="Lunes a Domingo. Servicio completo todos los días" className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="work-hours" className="text-[#FF6B35] font-medium">Horarios de atención</Label>
                    <Input id="work-hours" defaultValue="8:00 AM - 10:00 PM" className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-lead-time" className="text-[#FF6B35] font-medium">Tiempo mínimo de anticipación para pedidos</Label>
                    <Input id="booking-lead-time" defaultValue="30 minutos" className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="appointment-duration" className="text-[#FF6B35] font-medium">Tiempo promedio de preparación</Label>
                    <div className="px-3">
                      <Slider
                        value={appointmentDuration}
                        onValueChange={setAppointmentDuration}
                        max={120}
                        min={15}
                        step={15}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>15 min</span>
                        <span className="font-medium text-[#FF6B35]">{appointmentDuration[0]} minutos</span>
                        <span>120 min</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <Label className="text-[#FF6B35] font-medium">Configuración Automática</Label>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-confirm" className="text-sm font-medium">Confirmación automática</Label>
                        <p className="text-xs text-gray-500">Confirmar pedidos automáticamente</p>
                      </div>
                      <Switch
                        id="auto-confirm"
                        checked={autoConfirm}
                        onCheckedChange={setAutoConfirm}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="send-reminders" className="text-sm font-medium">Enviar recordatorios</Label>
                        <p className="text-xs text-gray-500">Notificar automáticamente a los clientes</p>
                      </div>
                      <Switch
                        id="send-reminders"
                        checked={sendReminders}
                        onCheckedChange={setSendReminders}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Información de Contacto y Políticas</p>
                    <p className="text-xs text-muted-foreground">Datos clave del negocio</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-address" className="text-[#FF6B35] font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Dirección completa
                    </Label>
                    <Input
                      id="business-address"
                      placeholder="Ej: Cra. 80A #32ee-72, Local 123 Laureles - Estadio, Medellín"
                      defaultValue="Cra. 80A #32ee-72, Local 123 Laureles - Estadio, Medellín"
                      className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300"
                    />
                    <Badge variant="outline" className="text-xs">
                      📍 Ubicación actual configurada
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phones" className="text-[#FF6B35] font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Teléfonos de contacto
                    </Label>
                    <Input
                      id="contact-phones"
                      placeholder="Ej: +57 300 123 4567"
                      defaultValue="+57 300 123 4567, +57 312 456 7890"
                      className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">WhatsApp</Badge>
                      <Badge variant="secondary" className="text-xs">Llamadas</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social-media" className="text-[#FF6B35] font-medium">Redes sociales</Label>
                    <Input
                      id="social-media"
                      placeholder="Ej: Instagram: @comida_deliciosa, Facebook: /comida_deliciosa"
                      defaultValue="Instagram: @comida_deliciosa, Facebook: /comida_deliciosa"
                      className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">📷 Instagram</Badge>
                      <Badge variant="outline" className="text-xs">📘 Facebook</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="cancellation-policy" className="text-[#FF6B35] font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Políticas de cancelación
                    </Label>
                    <Textarea
                      id="cancellation-policy"
                      placeholder="Describe la política de cancelación de pedidos."
                      defaultValue="Las cancelaciones deben realizarse con al menos 1 hora de anticipación para evitar cargos. Cancelaciones en el último momento tendrán un cargo del 30% del valor del pedido."
                      className="border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20 transition-all duration-300 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}