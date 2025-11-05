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
import { Save, BrainCircuit, Smile, PartyPopper, Heart, Upload, Settings, Info, MapPin, Phone, AlertCircle, CheckCircle, CalendarDays } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
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
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C8082]/1 via-transparent to-[#1f5a5c]/1 pointer-events-none"></div>

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
                  ¡Cambios guardados exitosamente!
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C8082]/5 via-[#2C8082]/10 to-transparent rounded-xl -z-10"></div>

          {/* Título con efecto de brillo */}
          <div className="relative group">
            <h2 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-[#2C8082] to-[#1f5a5c] bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración del Sistema
              <Badge variant="secondary" className="ml-2 text-xs">
                v2.0
              </Badge>
            </h2>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#2C8082] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Línea divisora animada */}
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#2C8082]/30 to-transparent"></div>
        </div>

        <Tabs defaultValue="agent" className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <TabsList className="mb-4 md:mb-0 bg-gradient-to-r from-[#2C8082]/10 to-[#1f5a5c]/10 border border-[#2C8082]/20 backdrop-blur-sm">
              <TabsTrigger value="agent" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2C8082] data-[state=active]:to-[#1f5a5c] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#2C8082]/25 transition-all duration-300">
                Configuración del Agente
              </TabsTrigger>
              <TabsTrigger value="business" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2C8082] data-[state=active]:to-[#1f5a5c] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#2C8082]/25 transition-all duration-300">
                Configuración de Negocio
              </TabsTrigger>
            </TabsList>
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#2C8082] to-[#1f5a5c] hover:from-[#236667] hover:to-[#1a4546] shadow-lg shadow-[#2C8082]/25 hover:shadow-[#2C8082]/40 transition-all duration-300">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar cambios</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que deseas guardar todos los cambios realizados en la configuración?
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
                    className="bg-gradient-to-r from-[#2C8082] to-[#1f5a5c]"
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
                      <p className="text-xs text-muted-foreground">Define la identidad visual y tono del agente</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="agent-name" className="text-[#2C8082] font-medium">Nombre del agente</Label>
                      <Input id="agent-name" defaultValue="Marcos" className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agent-avatar" className="text-[#2C8082] font-medium">Foto/Avatar</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 border-2 border-[#2C8082]/30">
                          <AvatarImage src="/agent-avatar.jpg" alt="Avatar del agente" />
                          <AvatarFallback className="bg-gradient-to-br from-[#2C8082]/20 to-[#1f5a5c]/20">
                            <BrainCircuit className="w-8 h-8 text-[#2C8082]" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Input id="agent-avatar" type="file" className="hidden" />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('agent-avatar')?.click()}
                            className="border-[#2C8082]/30 hover:bg-gradient-to-r hover:from-[#2C8082]/10 hover:to-transparent hover:border-[#2C8082] transition-all duration-300"
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
                      <Label className="text-[#2C8082] font-medium">Personalidad (Control Emocional)</Label>
                      <RadioGroup defaultValue="friendly" className="grid grid-cols-2 gap-4">
                        <Label className="flex flex-col items-center justify-center rounded-xl border-2 border-[#2C8082]/20 bg-gradient-to-br from-white/50 to-white/10 p-4 hover:bg-gradient-to-r hover:from-[#2C8082]/10 hover:to-transparent peer-data-[state=checked]:border-[#2C8082] peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-[#2C8082]/20 peer-data-[state=checked]:to-transparent cursor-pointer transition-all duration-300">
                          <RadioGroupItem value="professional" id="personality-professional" className="sr-only" />
                          <BrainCircuit className="mb-3 h-6 w-6 text-[#2C8082]" />
                          <span className="text-sm font-medium">Profesional y Formal</span>
                        </Label>
                        <Label className="flex flex-col items-center justify-center rounded-xl border-2 border-[#2C8082]/20 bg-gradient-to-br from-white/50 to-white/10 p-4 hover:bg-gradient-to-r hover:from-[#2C8082]/10 hover:to-transparent peer-data-[state=checked]:border-[#2C8082] peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-[#2C8082]/20 peer-data-[state=checked]:to-transparent cursor-pointer transition-all duration-300">
                          <RadioGroupItem value="friendly" id="personality-friendly" className="sr-only" />
                          <Smile className="mb-3 h-6 w-6 text-[#2C8082]" />
                          <span className="text-sm font-medium">Amigable y Cercano</span>
                        </Label>
                        <Label className="flex flex-col items-center justify-center rounded-xl border-2 border-[#2C8082]/20 bg-gradient-to-br from-white/50 to-white/10 p-4 hover:bg-gradient-to-r hover:from-[#2C8082]/10 hover:to-transparent peer-data-[state=checked]:border-[#2C8082] peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-[#2C8082]/20 peer-data-[state=checked]:to-transparent cursor-pointer transition-all duration-300">
                          <RadioGroupItem value="charismatic" id="personality-charismatic" className="sr-only" />
                          <PartyPopper className="mb-3 h-6 w-6 text-[#2C8082]" />
                          <span className="text-sm font-medium">Carismático y Divertido</span>
                        </Label>
                        <Label className="flex flex-col items-center justify-center rounded-xl border-2 border-[#2C8082]/20 bg-gradient-to-br from-white/50 to-white/10 p-4 hover:bg-gradient-to-r hover:from-[#2C8082]/10 hover:to-transparent peer-data-[state=checked]:border-[#2C8082] peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-[#2C8082]/20 peer-data-[state=checked]:to-transparent cursor-pointer transition-all duration-300">
                          <RadioGroupItem value="empathetic" id="personality-empathetic" className="sr-only" />
                          <Heart className="mb-3 h-6 w-6 text-[#2C8082]" />
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
                        <Label htmlFor="agent-greeting" className="text-[#2C8082] font-medium">Frases de saludo personalizadas</Label>
                        <Textarea
                          id="agent-greeting"
                          placeholder="Ej: ¡Hola! Soy Marcos, tu asistente virtual. ¿En qué puedo ayudarte hoy?"
                          className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300 resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agent-regionalisms" className="text-[#2C8082] font-medium">Expresiones regionales (colombianismos)</Label>
                        <Textarea
                          id="agent-regionalisms"
                          placeholder="Ej: '¡Qué más pues!', 'Con mucho gusto'"
                          className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300 resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="agent-emojis" className="text-[#2C8082] font-medium">Nivel de emojis</Label>
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
                          <SelectTrigger id="agent-emojis" className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300">
                            <SelectValue placeholder="Selecciona un nivel" />
                          </SelectTrigger>
                          <SelectContent className="border-[#2C8082]/20 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm">
                            <SelectItem value="none" className="hover:bg-[#2C8082]/10">
                              <div className="flex items-center gap-2">
                                <span>Ninguno</span>
                                <Badge variant="outline">😐</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="few" className="hover:bg-[#2C8082]/10">
                              <div className="flex items-center gap-2">
                                <span>Pocos</span>
                                <Badge variant="outline">😊</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="moderate" className="hover:bg-[#2C8082]/10">
                              <div className="flex items-center gap-2">
                                <span>Moderado</span>
                                <Badge variant="outline">🎉</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="abundant" className="hover:bg-[#2C8082]/10">
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
                        <Label htmlFor="response-length" className="text-[#2C8082] font-medium">Longitud de respuestas</Label>
                        <Select defaultValue="moderate">
                          <SelectTrigger id="response-length" className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-[#2C8082]/20 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm">
                            <SelectItem value="brief" className="hover:bg-[#2C8082]/10">Breve</SelectItem>
                            <SelectItem value="moderate" className="hover:bg-[#2C8082]/10">Moderada</SelectItem>
                            <SelectItem value="detailed" className="hover:bg-[#2C8082]/10">Detallada</SelectItem>
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
                    <Label htmlFor="template-confirmation" className="text-[#2C8082] font-medium">Confirmación de cita</Label>
                    <Textarea
                      id="template-confirmation"
                      placeholder="Tu cita está confirmada para..."
                      rows={10}
                      defaultValue={`🏥 CONSULTA DE VALORACION - VIVE FELIZ SIN DOLOR

👤 Informacion del Cliente:
Nombre: [NOMBRE_COMPLETO]
Telefono: [TELEFONO_RECOLECTADO]
Email: [EMAIL_RECOLECTADO]

📋 Detalles de la Consulta:
Fecha: [DÍA, NÚMERO de MES de AÑO]
Hora: [HORA con a. m. o p. m.]
Duracion: 45 minutos
Precio: $150,000 COP
Abono para confirmar: $30.000 COP (tienes 24 horas para dejarlo y asegurar tu reserva)
Ubicacion: Cra. 80A #32ee-72, consultorio 1015 Laureles - Estadio, Medellín
Modalidad: Presencial`}
                      className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300 resize-none font-mono text-sm"
                    />
                    <Button variant="outline" size="sm" className="border-[#2C8082]/30 hover:bg-gradient-to-r hover:from-[#2C8082]/10 hover:to-transparent transition-all duration-300">Editar</Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-reminder" className="text-[#2C8082] font-medium">Recordatorio de cita</Label>
                    <Textarea
                      id="template-reminder"
                      placeholder="Te recordamos tu cita de mañana..."
                      defaultValue="¡Hola! Solo para recordarte tu cita de mañana a las [HORA]. ¡Te esperamos!"
                      className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300 resize-none"
                    />
                    <Button variant="outline" size="sm" className="border-[#2C8082]/30 hover:bg-gradient-to-r hover:from-[#2C8082]/10 hover:to-transparent transition-all duration-300">Editar</Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-fallback" className="text-[#2C8082] font-medium">Cuando no puedo ayudar (escalación)</Label>
                    <Textarea
                      id="template-fallback"
                      placeholder="En un momento te contacto con..."
                      defaultValue="Entendido. Para ayudarte mejor con esto, te voy a comunicar con un especialista de nuestro equipo."
                      className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300 resize-none"
                    />
                    <Button variant="outline" size="sm" className="border-[#2C8082]/30 hover:bg-gradient-to-r hover:from-[#2C8082]/10 hover:to-transparent transition-all duration-300">Editar</Button>
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
                    <p className="text-xs text-muted-foreground">Configura horarios y gestión de citas</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="work-days" className="text-[#2C8082] font-medium">Días laborales</Label>
                    <Input id="work-days" defaultValue="Lunes a Sábado. Valoraciones: Lunes, Miércoles y Viernes" className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="work-hours" className="text-[#2C8082] font-medium">Horarios de atención</Label>
                    <Input id="work-hours" defaultValue="8:00 AM - 4:00 PM" className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lunch-break" className="text-[#2C8082] font-medium">Horario de almuerzo</Label>
                    <Input id="lunch-break" defaultValue="12:00 PM - 1:00 PM" className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-lead-time" className="text-[#2C8082] font-medium">Tiempo mínimo de anticipación para citas</Label>
                    <Input id="booking-lead-time" defaultValue="1 día" className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="appointment-duration" className="text-[#2C8082] font-medium">Duración de citas</Label>
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
                        <span className="font-medium text-[#2C8082]">{appointmentDuration[0]} minutos</span>
                        <span>120 min</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="appointment-buffer" className="text-[#2C8082] font-medium">Buffer entre citas</Label>
                    <div className="px-3">
                      <Slider
                        value={appointmentBuffer}
                        onValueChange={setAppointmentBuffer}
                        max={60}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0 min</span>
                        <span className="font-medium text-[#2C8082]">{appointmentBuffer[0]} minutos</span>
                        <span>60 min</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <Label className="text-[#2C8082] font-medium">Configuración Automática</Label>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-confirm" className="text-sm font-medium">Confirmación automática</Label>
                        <p className="text-xs text-gray-500">Confirmar citas automáticamente</p>
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
                        <p className="text-xs text-gray-500">Notificar automáticamente a los pacientes</p>
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
                    <Label htmlFor="business-address" className="text-[#2C8082] font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Dirección completa
                    </Label>
                    <Input
                      id="business-address"
                      placeholder="Ej: Cra. 80A #32ee-72, consultorio 1015 Laureles - Estadio, Medellín"
                      defaultValue="Cra. 80A #32ee-72, consultorio 1015 Laureles - Estadio, Medellín"
                      className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300"
                    />
                    <Badge variant="outline" className="text-xs">
                      📍 Ubicación actual configurada
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phones" className="text-[#2C8082] font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Teléfonos de contacto
                    </Label>
                    <Input
                      id="contact-phones"
                      placeholder="Ej: +57 300 123 4567"
                      defaultValue="+57 300 123 4567, +57 312 456 7890"
                      className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">WhatsApp</Badge>
                      <Badge variant="secondary" className="text-xs">Llamadas</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social-media" className="text-[#2C8082] font-medium">Redes sociales</Label>
                    <Input
                      id="social-media"
                      placeholder="Ej: Instagram: @vivesindolor, Facebook: /vivesindolor"
                      defaultValue="Instagram: @vivesindolor, Facebook: /vivesindolor"
                      className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">📷 Instagram</Badge>
                      <Badge variant="outline" className="text-xs">📘 Facebook</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="cancellation-policy" className="text-[#2C8082] font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Políticas de cancelación
                    </Label>
                    <Textarea
                      id="cancellation-policy"
                      placeholder="Describe la política de cancelación de citas."
                      defaultValue="Las cancelaciones deben realizarse con al menos 24 horas de anticipación para evitar cargos. Cancelaciones el mismo día tendrán un cargo del 50% del valor de la consulta."
                      className="border-[#2C8082]/20 focus:border-[#2C8082] focus:ring-[#2C8082]/20 transition-all duration-300 resize-none"
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