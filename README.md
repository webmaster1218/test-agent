# Fábrica de Winners - AI Agent Testing Platform

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

**Fábrica de Winners** es una plataforma avanzada de pruebas para agentes de IA basada en Next.js 15. Cuenta con una interfaz en español, efectos visuales de plasma WebGL, funcionalidad de chat multi-agente y un panel de análisis con integración de webhooks de n8n en tiempo real.

---

## 🚀 Características Principales

### 🤖 Sistema Multi-Agente
- **Agente de Salud (Salud)**: Asistencia médica, programación de citas y recomendaciones basadas en síntomas.
- **Agente de Comida (Comida)**: Menú de restaurante, recomendaciones, toma de pedidos con análisis de comunas de Medellín.
- **Chat en Tiempo Real**: Integración con webhooks de n8n para procesamiento de mensajes.
- **Persistencia Local**: Mensajes guardados por agente en `localStorage` (`chat_messages_${agentId}`).

### 📊 Panel de Análisis (Dashboard)
- **Visualización de Datos**: Gráficos interactivos (barras, pastel, áreas, líneas) usando Recharts.
- **Procesamiento Dual**: Seguimiento de conversaciones y citas/pedidos.
- **Análisis de Sentimiento**: Clasificación automática basada en palabras clave en español.
- **Exportación Versátil**: Soporte para CSV, JSON, XML, PDF y TXT (usando html2canvas y jsPDF).
- **Filtros Avanzados**: Filtrado por rangos de fechas con soporte para locale en español.

### 🎨 Interfaz y Diseño
- **Efectos de Plasma WebGL**: Fondo interactivo basado en la librería OGL que reacciona al movimiento del ratón.
- **Tematización Dinámica**: Colores específicos por agente (Salud: Azul #2C8082, Comida: Naranja #FF6B35).
- **Componentes Premium**: Biblioteca completa de shadcn/ui con más de 37 componentes personalizados.

---

## 🛠️ Stack Tecnológico

- **Core**: Next.js 15 (App Router), React 19, TypeScript.
- **Estilos**: Tailwind CSS, shadcn/ui, Lucide Icons.
- **Estado**: Zustand (gestión de estado global).
- **Gráficos**: Recharts.
- **Efectos Visuales**: OGL (WebGL).
- **Utilidades**: date-fns (locale ES), html2canvas, jsPDF.
- **Backend/API**: Integración con n8n (Webhooks) y Supabase (opcional).

---

## 📂 Estructura del Proyecto

```text
/src
  /app           # Rutas de la aplicación (Páginas, Dashboards, Login)
  /components    # Componentes de UI (shadcn, chat, dashboard, charts)
  /hooks         # Custom hooks de React
  /lib           # Configuraciones, constantes, tipos y utilidades
    /config      # Constantes de app, temas y webhooks
    auth.ts      # Gestión de sesiones y credenciales
    supabase.ts  # Cliente de Supabase con fallback flexible
  /types         # Definiciones de tipos de TypeScript
/public          # Assets estáticos (Imágenes, logos)
```

---

## ⚙️ Configuración e Instalación

### Requisitos Previos
- Node.js (versión compatible con Next.js 15)
- npm o pnpm

### Pasos de Instalación
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   Copia el archivo `.env.example` a `.env.local` y configura las siguientes variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon Key de Supabase.

   *Nota: La aplicación funciona en modo desarrollo incluso sin estas credenciales.*

---

## 💻 Comandos de Desarrollo

| Comando | Descripción |
| :------- | :---------- |
| `npm run dev` | Inicia el servidor de desarrollo en el puerto 3000. |
| `npm run dev:turbopack` | Inicia el desarrollo con Turbopack (más rápido). |
| `npm run build` | Crea la versión de producción optimizada. |
| `npm run start` | Inicia el servidor de producción. |
| `npm run lint` | Ejecuta el linter (ESLint). |
| `npm run typecheck` | Verifica los tipos de TypeScript. |

---

## 🔐 Acceso al Dashboard

El acceso a los dashboards de administración está protegido por un sistema de credenciales estáticas:

- **Usuario**: `admin`
- **Contraseña**: `FB1218$`

Las sesiones se gestionan mediante `sessionStorage` y expiran automáticamente después de 24 horas. Cada agente tiene su propia clave de sesión independiente.

---

## 🔗 Integraciones Externas

### Webhooks de n8n
La comunicación con los agentes se realiza a través de las siguientes URLs configuradas en `src/lib/config/constants.ts`:
- **Salud**: `https://n8n.srv1054162.hstgr.cloud/webhook/29aad504-0017-47b9-b2b5-57800b5649f8`
- **Comida**: `https://n8n.srv1054162.hstgr.cloud/webhook/ff3f992e-bf39-432a-9dad-05ce3ec14d26`

### Supabase
Se utiliza para almacenar configuraciones de agentes en la tabla `configuraciones_agentes`. El sistema está diseñado para degradarse elegantemente si Supabase no está disponible, usando valores por defecto locales.

---

## 📝 Notas de Desarrollo
- Se ignoran los errores de tipado y ESLint durante el despliegue (configurado en `next.config.ts`) para garantizar la continuidad comercial.
- Los componentes de UI están basados en Shadcn UI y se encuentran en `src/components/ui`.
- La optimización de imágenes está configurada para dominios de Google Drive y n8n.
