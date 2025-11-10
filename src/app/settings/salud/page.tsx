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
import { Save, BrainCircuit, Smile, PartyPopper, Heart, Upload, Settings, Info, MapPin, Phone, AlertCircle, CheckCircle, CalendarDays, Sparkles, Palette, MessageSquare, Clock, Bot, Store } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

// Importar temas desde el sistema centralizado
import { agentThemes, getAgentTheme } from '@/lib/config/themes';
// Importar Supabase
import { getConfiguracionAgente, saveConfiguracionAgente, ConfiguracionAgente } from '@/lib/supabase';

export default function SettingsSaludPage() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [mounted, setMounted] = useState(false);

  // Referencias para los campos del formulario
  const agentNameRef = useRef<HTMLInputElement>(null);
  const agentGreetingRef = useRef<HTMLTextAreaElement>(null);
  const agentRegionalismsRef = useRef<HTMLTextAreaElement>(null);
  const templateConfirmationRef = useRef<HTMLTextAreaElement>(null);
  const templateReminderRef = useRef<HTMLTextAreaElement>(null);
  const templateFallbackRef = useRef<HTMLTextAreaElement>(null);
  const workDaysRef = useRef<HTMLInputElement>(null);
  const workHoursRef = useRef<HTMLInputElement>(null);
  const lunchBreakRef = useRef<HTMLInputElement>(null);
  const businessAddressRef = useRef<HTMLInputElement>(null);
  const contactPhonesRef = useRef<HTMLInputElement>(null);
  const socialMediaRef = useRef<HTMLInputElement>(null);
  const cancellationPolicyRef = useRef<HTMLTextAreaElement>(null);

  // Inicializar el tema
  useEffect(() => {
    setMounted(true);
  }, []);

  // Obtener tema del agente desde el sistema centralizado
  const agentTheme = getAgentTheme('salud');

  // Helper para obtener el color según el agente
  const getAgentColor = (property: 'primary' | 'secondary' | 'accent' = 'primary') => {
    return agentTheme[property];
  };

  const [appointmentDuration, setAppointmentDuration] = useState([45]);
  const [appointmentBuffer, setAppointmentBuffer] = useState([15]);
  const [emojiLevel, setEmojiLevel] = useState('few');
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [sendReminders, setSendReminders] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState('friendly');
  const [responseLength, setResponseLength] = useState('moderate');
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Función para cargar configuración desde Supabase
  const loadConfiguracion = async () => {
    setLoadingConfig(true);
    try {
      const config = await getConfiguracionAgente('salud');
      if (config) {
        // Actualizar estados con la configuración cargada
        setSelectedPersonality(config.agente.personalidad);
        setEmojiLevel(config.agente.nivel_emojis);
        setResponseLength(config.agente.longitud_respuestas);
        setAppointmentDuration([config.negocio.duracion_citas]);
        setAppointmentBuffer([config.negocio.tiempo_entre_citas]);
        setAutoConfirm(config.negocio.confirmacion_automatica);
        setSendReminders(config.negocio.enviar_recordatorios);

        // Actualizar valores de los campos si existen las referencias
        setTimeout(() => {
          if (agentNameRef.current) agentNameRef.current.value = config.agente.nombre;
          if (agentGreetingRef.current) agentGreetingRef.current.value = config.agente.saludo;
          if (agentRegionalismsRef.current) agentRegionalismsRef.current.value = config.agente.regionalismos;
          if (templateConfirmationRef.current) templateConfirmationRef.current.value = config.agente.plantillas.confirmacion;
          if (templateReminderRef.current) templateReminderRef.current.value = config.agente.plantillas.recordatorio;
          if (templateFallbackRef.current) templateFallbackRef.current.value = config.agente.plantillas.escalamiento;
          if (workDaysRef.current) workDaysRef.current.value = config.negocio.dias_servicio;
          if (workHoursRef.current) workHoursRef.current.value = config.negocio.horario_atencion;
          if (lunchBreakRef.current) lunchBreakRef.current.value = config.negocio.horario_almuerzo;
          if (businessAddressRef.current) businessAddressRef.current.value = config.negocio.direccion;
          if (contactPhonesRef.current) contactPhonesRef.current.value = config.negocio.telefonos;
          if (socialMediaRef.current) socialMediaRef.current.value = config.negocio.redes_sociales;
          if (cancellationPolicyRef.current) cancellationPolicyRef.current.value = config.negocio.politica_cancelacion;
        }, 100);
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoadingConfig(false);
    }
  };

  // Cargar configuración al montar el componente
  useEffect(() => {
    if (mounted) {
      loadConfiguracion();
    }
  }, [mounted]);

  // Función para recolectar todos los datos del formulario en formato Supabase
  const collectFormDataForSupabase = (): ConfiguracionAgente => {
    return {
      agente: {
        nombre: agentNameRef.current?.value || 'Marcos',
        personalidad: selectedPersonality,
        saludo: agentGreetingRef.current?.value || '',
        regionalismos: agentRegionalismsRef.current?.value || '',
        nivel_emojis: emojiLevel,
        longitud_respuestas: responseLength,
        plantillas: {
          confirmacion: templateConfirmationRef.current?.value || '',
          recordatorio: templateReminderRef.current?.value || '',
          escalamiento: templateFallbackRef.current?.value || ''
        }
      },
      negocio: {
        dias_servicio: workDaysRef.current?.value || '',
        horario_atencion: workHoursRef.current?.value || '',
        horario_almuerzo: lunchBreakRef.current?.value || '',
        duracion_citas: appointmentDuration[0],
        tiempo_entre_citas: appointmentBuffer[0],
        confirmacion_automatica: autoConfirm,
        enviar_recordatorios: sendReminders,
        direccion: businessAddressRef.current?.value || '',
        telefonos: contactPhonesRef.current?.value || '',
        redes_sociales: socialMediaRef.current?.value || '',
        politica_cancelacion: cancellationPolicyRef.current?.value || ''
      }
    };
  };

  // Función para recolectar datos para webhook (formato original)
  const collectFormDataForWebhook = () => {
    return {
      agentType: 'salud',
      timestamp: new Date().toISOString(),
      configuration: {
        agent: {
          name: agentNameRef.current?.value || 'Marcos',
          personality: selectedPersonality,
          greeting: agentGreetingRef.current?.value || '',
          regionalisms: agentRegionalismsRef.current?.value || '',
          emojiLevel: emojiLevel,
          responseLength: responseLength,
          templates: {
            confirmation: templateConfirmationRef.current?.value || '',
            reminder: templateReminderRef.current?.value || '',
            fallback: templateFallbackRef.current?.value || ''
          }
        },
        business: {
          workDays: workDaysRef.current?.value || '',
          workHours: workHoursRef.current?.value || '',
          lunchBreak: lunchBreakRef.current?.value || '',
          appointmentDuration: appointmentDuration[0],
          appointmentBuffer: appointmentBuffer[0],
          autoConfirm: autoConfirm,
          sendReminders: sendReminders,
          address: businessAddressRef.current?.value || '',
          phones: contactPhonesRef.current?.value || '',
          socialMedia: socialMediaRef.current?.value || '',
          cancellationPolicy: cancellationPolicyRef.current?.value || ''
        }
      }
    };
  };

  // Función para enviar datos al webhook
  const sendToWebhook = async (data: any) => {
    const webhookUrl = 'https://n8n.srv1054162.hstgr.cloud/webhook/fafcc4ec-7a5c-4efa-978b-95b1f3d2bac2';

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Origin': 'https://fabricadewinners.com',
          'Referer': 'https://fabricadewinners.com/settings/salud',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error sending to webhook:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');

    try {
      // Recopilar datos del formulario para Supabase
      const supabaseData = collectFormDataForSupabase();

      // Guardar en Supabase
      const supabaseResult = await saveConfiguracionAgente('salud', supabaseData);

      if (supabaseResult) {
        // Recopilar datos para webhook
        const webhookData = collectFormDataForWebhook();

        // Enviar al webhook
        const webhookResult = await sendToWebhook(webhookData);

        if (webhookResult.success) {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
          setSaveStatus('error');
          console.error('Webhook error:', webhookResult.error);
          setTimeout(() => setSaveStatus('idle'), 3000);
        }
      } else {
        setSaveStatus('error');
        console.error('Error guardando en Supabase');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('Save error:', error);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 lg:p-8 pt-16 sm:pt-12">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Alerta de estado */}
        {saveStatus !== 'idle' && (
          <Alert className={`border-2 ${
            saveStatus === 'saved' ? 'border-text-blue-500/50 bg-text-blue-500/10' :
            saveStatus === 'saving' ? 'border-text-blue-500/50 bg-text-blue-500/10' :
            'border-red-500/50 bg-red-500/10'
          }`}>
            {saveStatus === 'saving' && (
              <>
                <AlertCircle style={{ color: getAgentColor('primary') }} className="h-4 w-4 animate-spin" />
                <AlertDescription className="text-blue-700">
                  Guardando configuración...
                </AlertDescription>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle style={{ color: getAgentColor('primary') }} className="h-4 w-4" />
                <AlertDescription className="text-blue-700">
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
        <header className="flex flex-col gap-4 mb-4 sm:mb-6">
          <div className="text-left">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">Ajustes de Agente de Salud</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Configuración del agente y del negocio</p>
          </div>

          {/* Controles */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                style={{ background: `linear-gradient(to right, ${getAgentColor('primary')}, ${getAgentColor('secondary')})` }}
                className="hover:opacity-90 shadow-lg w-1/2 text-sm px-3 sm:px-4 md:px-6 lg:px-6"
              >
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-4">
              <DialogHeader>
                <DialogTitle className="text-lg">Confirmar cambios</DialogTitle>
                <DialogDescription className="text-sm">
                  ¿Guardar todos los cambios en la configuración del agente de salud?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)} className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setShowSaveDialog(false);
                    handleSave();
                  }}
                  style={{ background: `linear-gradient(to right, ${getAgentColor('primary')}, ${getAgentColor('secondary')})` }}
                  className="w-full sm:w-auto"
                >
                  Confirmar y Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </header>

        <Tabs defaultValue="agent" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full max-w-xs grid-cols-2 h-11 sm:h-12 justify-start">
          <TabsTrigger value="agent" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
            <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Agente</span>
            <span className="sm:hidden">Agte</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
            <Store className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Negocio</span>
            <span className="sm:hidden">Neg</span>
          </TabsTrigger>
        </TabsList>

          {/* Pestaña de Configuración del Agente */}
        <TabsContent value="agent" className="mt-4 sm:mt-6 lg:mt-8 space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Identidad y Personalidad */}
              <Card className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br" style={{ background: `linear-gradient(to bottom right, ${getAgentColor('primary')}20, ${getAgentColor('secondary')}20)` }}>
                    <Palette style={{ color: getAgentColor('primary') }} className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground"><span style={{ color: getAgentColor('primary') }}>Identidad del Agente</span></p>
                    <p className="text-xs text-muted-foreground hidden sm:block">Nombre, avatar y personalidad</p>
                    <p className="text-xs text-muted-foreground sm:hidden">Nombre y personalidad</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="agent-name" style={{ color: getAgentColor('primary') }} className="font-medium">Nombre</Label>
                    <Input
                      ref={agentNameRef}
                      id="agent-name"
                      placeholder="Nombre del agente"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: getAgentColor('primary') }} className="font-medium">Avatar</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 border-2 border-text-blue-500/30">
                        <AvatarImage src="/agent-avatar.jpg" />
                        <AvatarFallback className="bg-gradient-to-br style={{ background: `linear-gradient(to bottom right, ${getAgentColor('primary')}20, ${getAgentColor('secondary')}20)` }}">
                          <BrainCircuit style={{ color: getAgentColor('primary') }} className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" className="border-text-blue-500/30 hover:bg-text-blue-500/10">
                        <Upload className="mr-2 h-4 w-4" />
                        Cambiar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label style={{ color: getAgentColor('primary') }} className="font-medium">Personalidad</Label>
                    <RadioGroup value={selectedPersonality} onValueChange={setSelectedPersonality} className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-text-blue-500/20 hover:bg-text-blue-500/5 transition-colors">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional" className="flex items-center gap-2 cursor-pointer">
                          <BrainCircuit style={{ color: getAgentColor('primary') }} className="h-4 w-4" />
                          <span>Profesional</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-text-blue-500/20 hover:bg-text-blue-500/5 transition-colors">
                        <RadioGroupItem value="friendly" id="friendly" />
                        <Label htmlFor="friendly" className="flex items-center gap-2 cursor-pointer">
                          <Smile style={{ color: getAgentColor('primary') }} className="h-4 w-4" />
                          <span>Amigable</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-text-blue-500/20 hover:bg-text-blue-500/5 transition-colors">
                        <RadioGroupItem value="charismatic" id="charismatic" />
                        <Label htmlFor="charismatic" className="flex items-center gap-2 cursor-pointer">
                          <PartyPopper style={{ color: getAgentColor('primary') }} className="h-4 w-4" />
                          <span>Carismático</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-text-blue-500/20 hover:bg-text-blue-500/5 transition-colors">
                        <RadioGroupItem value="empathetic" id="empathetic" />
                        <Label htmlFor="empathetic" className="flex items-center gap-2 cursor-pointer">
                          <Heart style={{ color: getAgentColor('primary') }} className="h-4 w-4" />
                          <span>Empático</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Card>

              {/* <span style={{ color: getAgentColor('primary') }}>Estilo de Comunicación</span> */}
              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br style={{ background: `linear-gradient(to bottom right, ${getAgentColor('primary')}20, ${getAgentColor('secondary')}20)` }}">
                    <MessageSquare style={{ color: getAgentColor('primary') }} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground"><span style={{ color: getAgentColor('primary') }}>Estilo de Comunicación</span></p>
                    <p className="text-xs text-muted-foreground">Tono, lenguaje y expresiones</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="agent-greeting" style={{ color: getAgentColor('primary') }} className="font-medium">Saludo Personalizado</Label>
                    <Textarea
                      ref={agentGreetingRef}
                      id="agent-greeting"
                      placeholder="Escribe el saludo personalizado del agente"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20 resize-none" style={{
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  scrollbarWidth: '0px',
  WebkitAppearance: 'none',
  MozAppearance: 'none'
}}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agent-regionalisms" style={{ color: getAgentColor('primary') }} className="font-medium">Expresiones Colombianas</Label>
                    <Textarea
                      ref={agentRegionalismsRef}
                      id="agent-regionalisms"
                      placeholder="Escribe expresiones colombianas características"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20 resize-none" style={{
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  scrollbarWidth: '0px',
  WebkitAppearance: 'none',
  MozAppearance: 'none'
}}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agent-emojis" style={{ color: getAgentColor('primary') }} className="font-medium">Nivel de Emojis</Label>
                    <Select value={emojiLevel} onValueChange={setEmojiLevel}>
                      <SelectTrigger className="border-text-blue-500/20 focus:border-text-blue-500">
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
                    <Label htmlFor="response-length" style={{ color: getAgentColor('primary') }} className="font-medium">Longitud de Respuestas</Label>
                    <Select value={responseLength} onValueChange={setResponseLength}>
                      <SelectTrigger className="border-text-blue-500/20 focus:border-text-blue-500">
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

            {/* <span style={{ color: getAgentColor('primary') }}>Plantillas de Mensajes</span> */}
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br style={{ background: `linear-gradient(to bottom right, ${getAgentColor('primary')}20, ${getAgentColor('secondary')}20)` }}">
                  <Sparkles style={{ color: getAgentColor('primary') }} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground"><span style={{ color: getAgentColor('primary') }}>Plantillas de Mensajes</span></p>
                  <p className="text-xs text-muted-foreground">Mensajes automáticos del sistema</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="template-confirmation" style={{ color: getAgentColor('primary') }} className="font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Confirmación
                    </Label>
                    <Textarea
                      ref={templateConfirmationRef}
                      id="template-confirmation"
                      placeholder="Plantilla de mensaje de confirmación"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20 resize-none font-mono text-sm"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-reminder" style={{ color: getAgentColor('primary') }} className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recordatorio
                    </Label>
                    <Textarea
                      ref={templateReminderRef}
                      id="template-reminder"
                      placeholder="Plantilla de mensaje de recordatorio"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20 resize-none" style={{
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  scrollbarWidth: '0px',
  WebkitAppearance: 'none',
  MozAppearance: 'none'
}}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-fallback" style={{ color: getAgentColor('primary') }} className="font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Escalación
                    </Label>
                    <Textarea
                      ref={templateFallbackRef}
                      id="template-fallback"
                      placeholder="Plantilla de mensaje de escalación"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20 resize-none" style={{
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  scrollbarWidth: '0px',
  WebkitAppearance: 'none',
  MozAppearance: 'none'
}}
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
              {/* <span style={{ color: getAgentColor('primary') }}>Horarios y Operación</span> */}
              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br style={{ background: `linear-gradient(to bottom right, ${getAgentColor('primary')}20, ${getAgentColor('secondary')}20)` }}">
                    <CalendarDays style={{ color: getAgentColor('primary') }} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground"><span style={{ color: getAgentColor('primary') }}>Horarios y Operación</span></p>
                    <p className="text-xs text-muted-foreground">Disponibilidad y gestión de citas</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="work-days" style={{ color: getAgentColor('primary') }} className="font-medium">Días de Servicio</Label>
                    <Input
                      ref={workDaysRef}
                      id="work-days"
                      placeholder="Días de servicio"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="work-hours" style={{ color: getAgentColor('primary') }} className="font-medium">Horario de Atención</Label>
                    <Input
                      ref={workHoursRef}
                      id="work-hours"
                      placeholder="Horario de atención"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lunch-break" style={{ color: getAgentColor('primary') }} className="font-medium">Horario de Almuerzo</Label>
                    <Input
                      ref={lunchBreakRef}
                      id="lunch-break"
                      placeholder="Horario de almuerzo"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label style={{ color: getAgentColor('primary') }} className="font-medium">Duración de Citas</Label>
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
                      <span style={{ color: getAgentColor('primary') }} className="font-medium">{appointmentDuration[0]} minutos</span>
                      <span>120 min</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label style={{ color: getAgentColor('primary') }} className="font-medium">Automatización</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-text-blue-500/20">
                        <div>
                          <Label htmlFor="auto-confirm" className="font-medium">Confirmación Automática</Label>
                          <p className="text-sm text-muted-foreground">Confirmar citas sin intervención manual</p>
                        </div>
                        <Switch
                          id="auto-confirm"
                          checked={autoConfirm}
                          onCheckedChange={setAutoConfirm}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-text-blue-500/20">
                        <div>
                          <Label htmlFor="send-reminders" className="font-medium">Recordatorios</Label>
                          <p className="text-sm text-muted-foreground">Notificar a los pacientes automáticamente</p>
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

              {/* <span style={{ color: getAgentColor('primary') }}>Información del Negocio</span> */}
              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br style={{ background: `linear-gradient(to bottom right, ${getAgentColor('primary')}20, ${getAgentColor('secondary')}20)` }}">
                    <MapPin style={{ color: getAgentColor('primary') }} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground"><span style={{ color: getAgentColor('primary') }}>Información del Negocio</span></p>
                    <p className="text-xs text-muted-foreground">Datos de contacto y ubicación</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="business-address" style={{ color: getAgentColor('primary') }} className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Dirección
                    </Label>
                    <Input
                      ref={businessAddressRef}
                      id="business-address"
                      placeholder="Dirección del negocio"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20"
                    />
                    <Badge variant="outline" className="bg-text-blue-500/10 text-blue-500 border-text-blue-500/20">
                      Ubicación configurada
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-phones" style={{ color: getAgentColor('primary') }} className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Teléfonos
                    </Label>
                    <Input
                      ref={contactPhonesRef}
                      id="contact-phones"
                      placeholder="Teléfonos de contacto"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" style={{ backgroundColor: `${getAgentColor('primary')}10`, color: getAgentColor('primary'), borderColor: `${getAgentColor('primary')}20` }}>WhatsApp</Badge>
                      <Badge variant="secondary" style={{ backgroundColor: `${getAgentColor('primary')}10`, color: getAgentColor('primary'), borderColor: `${getAgentColor('primary')}20` }}>Llamadas</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="social-media" style={{ color: getAgentColor('primary') }} className="font-medium">Redes Sociales</Label>
                    <Input
                      ref={socialMediaRef}
                      id="social-media"
                      placeholder="Redes sociales"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="border-text-blue-500/30">📷 Instagram</Badge>
                      <Badge variant="outline" className="border-text-blue-500/30">📘 Facebook</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="cancellation-policy" style={{ color: getAgentColor('primary') }} className="font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Política de Cancelación
                    </Label>
                    <Textarea
                      ref={cancellationPolicyRef}
                      id="cancellation-policy"
                      placeholder="Política de cancelación"
                      className="border-text-blue-500/20 focus:border-text-blue-500 focus:ring-text-blue-500/20 resize-none" style={{
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  scrollbarWidth: '0px',
  WebkitAppearance: 'none',
  MozAppearance: 'none'
}}
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