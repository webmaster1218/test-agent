import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la configuración
export interface ConfiguracionAgente {
  agente: {
    nombre: string
    personalidad: string
    saludo: string
    regionalismos: string
    nivel_emojis: string
    longitud_respuestas: string
    plantillas: {
      confirmacion: string
      recordatorio: string
      escalamiento: string
    }
  }
  negocio: {
    dias_servicio: string
    horario_atencion: string
    horario_almuerzo: string
    duracion_citas: number
    tiempo_entre_citas: number
    confirmacion_automatica: boolean
    enviar_recordatorios: boolean
    direccion: string
    telefonos: string
    redes_sociales: string
    politica_cancelacion: string
  }
}

export interface ConfiguracionRow {
  id: string
  tipo_agente: string
  configuracion: ConfiguracionAgente
  fecha_creacion: string
  fecha_actualizacion: string
  esta_activo: boolean
}

// Funciones para interactuar con Supabase
export async function getConfiguracionAgente(tipoAgente: string): Promise<ConfiguracionAgente | null> {
  try {
    console.log('Cargando configuración para:', tipoAgente)
    console.log('URL Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL)

    const { data, error } = await supabase
      .from('configuraciones_agentes')
      .select('configuracion')
      .eq('tipo_agente', tipoAgente)
      .eq('esta_activo', true)
      .order('fecha_actualizacion', { ascending: false })
      .limit(1)
      .single()

    console.log('Respuesta carga:', { data, error })

    if (error) {
      console.error('Error obteniendo configuración:', error)
      console.error('Detalles del error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return null
    }

    console.log('Configuración cargada exitosamente')
    return data?.configuracion || null
  } catch (error) {
    console.error('Error en getConfiguracionAgente:', error)
    console.error('Error completo:', error instanceof Error ? error.message : error)
    return null
  }
}

export async function saveConfiguracionAgente(tipoAgente: string, configuracion: ConfiguracionAgente): Promise<boolean> {
  try {
    console.log('=== INICIANDO GUARDADO EN SUPABASE ===')
    console.log('1. Tipo de agente:', tipoAgente)
    console.log('2. Configuración:', JSON.stringify(configuracion, null, 2))

    const testData = {
      tipo_agente: tipoAgente,
      configuracion: configuracion,
      esta_activo: true,
      fecha_actualizacion: new Date().toISOString()
    }

    console.log('3. Datos a guardar:', JSON.stringify(testData, null, 2))

    // Intentar actualizar primero
    const { data: updateData, error: updateError } = await supabase
      .from('configuraciones_agentes')
      .update(testData)
      .eq('tipo_agente', tipoAgente)
      .select()

    console.log('4. Respuesta update:', { data: updateData, error: updateError })

    // Si no existe o hay error, intentar insertar
    if (updateError) {
      console.log('4b. Intentando insertar porque update falló:', updateError.message)

      const { data: insertData, error: insertError } = await supabase
        .from('configuraciones_agentes')
        .insert(testData)
        .select()

      console.log('5. Respuesta insert:', { data: insertData, error: insertError })

      if (insertError) {
        console.error('=== ERROR EN INSERT ===')
        console.error('Error insert:', insertError)
        console.error('Message:', insertError.message)
        console.error('Code:', insertError.code)
        return false
      }

      console.log('=== INSERT EXITOSO ===')
      return true
    }

    console.log('=== UPDATE EXITOSO ===')
    return true
  } catch (error) {
    console.error('=== ERROR EN CATCH ===')
    console.error('Error completo:', error)
    console.error('Tipo de error:', typeof error)
    if (error instanceof Error) {
      console.error('Error.message:', error.message)
    }
    return false
  }
}