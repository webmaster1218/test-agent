# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Fábrica de Winners**, a Next.js-based AI agent testing platform with Spanish-language interface, WebGL plasma effects, multi-agent chat functionality, and analytics dashboard with real-time n8n webhook integration.

## Development Commands

```bash
# Development
npm run dev                    # Start development server on port 3000
npm run dev:turbopack          # Start with Turbopack (faster bundling)
npm run build                  # Create production build
npm run start                  # Start production server

# Code Quality
npm run lint                   # Run ESLint
npm run lint:fix               # Run ESLint with auto-fix
npm run typecheck              # TypeScript type checking
```

### Webhook Testing Commands
```bash
# Test n8n webhooks (requires curl or similar)
curl -X POST https://n8n.srv1054162.hstgr.cloud/webhook/29aad504-0017-47b9-b2b5-57800b5649f8 \
  -H "Content-Type: application/json" \
  -d '{"message": "test message", "conversationId": "test", "messageId": "test"}'
```

## Environment Setup

### Required Environment Variables
For development and deployment, configure these variables in your environment or Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

**Note**: The application gracefully handles missing Supabase credentials and works in development mode without them.

### Local Development
1. Copy `.env.example` to `.env.local` and configure Supabase variables
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development server on port 3000

## Development Notes

- Build errors are ignored for deployment (TypeScript and ESLint configured in next.config.ts)
- The application uses Turbopack for faster development builds
- Image optimization is configured for Google Drive and n8n domains
- Security headers are configured for production deployment
- All components use TypeScript with strict type checking
- **Vercel Environment Variables Required**: For deployment, configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel dashboard
- **shadcn/ui Configuration**: Uses CSS variables with slate base color and TypeScript support
- **Package Optimization**: Optimized imports for @radix-ui/react-icons, lucide-react, recharts

## Authentication & Access

The platform uses hardcoded credentials for dashboard access:
- **Username**: `admin`
- **Password**: `FB1218$`

Authentication sessions are managed via sessionStorage with 24-hour expiration. Each agent type (salud/comida) has separate session keys.

## Architecture

### Core Technology Stack
- **Next.js 15** with App Router and TypeScript
- **React 19** with Server Components
- **Tailwind CSS** with shadcn/ui components (37+ components)
- **Zustand** for state management
- **Recharts** for data visualization
- **OGL library** for WebGL plasma effects
- **date-fns** for date handling with Spanish locale
- **html2canvas + jsPDF** for PDF export functionality

### Application Structure

#### Main Application (`src/app/page.tsx`)
- Spanish interface "FÁBRICA DE WINNERS" with WebGL plasma background
- Agent selection system with localStorage persistence
- Dynamic theming based on selected agent (Salud: blue, Comida: orange)
- Dashboard access button linking to analytics platform

#### Chat System (`src/components/chat/Chat.tsx`)
- Multi-agent chat with n8n webhook integration
- Agent-specific localStorage message persistence (`chat_messages_${agentId}`)
- Google Drive image URL conversion and display
- JSON response parsing with text/image extraction
- Complex webhook payload structure with browser-mimicked headers
- Conversation ID management per agent session

#### Analytics Dashboard (`src/app/dashboard/page.tsx`)
- Comprehensive analytics with real-time n8n data fetching
- Dual-table processing system (conversations + appointments)
- Sentiment analysis with Spanish keyword classification
- Multiple export formats (CSV, JSON, XML, PDF, TXT)
- Date range filtering with Spanish locale support
- Interactive charts (bar, pie, area, line) with Recharts

#### UI Component System
- **shadcn/ui**: Complete component library (37+ components including charts, forms, data display)
- **Plasma Effects**: WebGL-based interactive background using OGL library with mouse interaction
- **Theme System**: Agent-specific dynamic theming with CSS variables (Salud: blue #2C8082, Comida: orange #FF6B35)
- **Authentication**: Protected dashboard routes with AuthGuard component and session management
- **Conditional Rendering**: Dynamic app content based on route and authentication state

### External Integrations

#### n8n Webhooks
- **Health Agent**: `https://n8n.srv1054162.hstgr.cloud/webhook/29aad504-0017-47b9-b2b5-57800b5649f8`
- **Food Agent**: `https://n8n.srv1054162.hstgr.cloud/webhook/ff3f992e-bf39-432a-9dad-05ce3ec14d26`

**Configuration Location**: Webhook URLs are defined in `src/lib/config/constants.ts` and `src/lib/constants.ts`

#### Configuration Files
- **`src/lib/config/constants.ts`**: Application configuration (APP_CONFIG, WEBHOOK_CONFIG, CHAT_CONFIG)
- **`src/lib/constants.ts`**: Webhook URLs and complex WebhookPayload interface for n8n integration
- **`src/lib/config/themes.ts`**: Agent-specific color themes with plasma effects
- **`src/lib/types.ts`**: Minimal TypeScript interfaces (Message interface)
- **`src/lib/auth.ts`**: Authentication utilities and session management with AdminCredentials interface
- **`src/lib/supabase.ts`**: Supabase client integration with graceful fallback and ConfiguracionAgente interface
- **`src/lib/pedidos-utils.ts`**: Order processing utilities for food agent with Medellín commune mapping and geographic data analysis
- **`src/app/actions.ts`**: Server-side sentiment analysis using Spanish keywords

### Key Technical Details

#### Webhook Payload Structure (`src/lib/constants.ts:14-81`)
Complex payload mimicking browser requests with:
- Full browser headers (user-agent, accept headers, etc.)
- Nested body structure with conversation and message ID management
- Timestamp handling with ISO format
- Response parsing for multiple data formats (JSON arrays/objects)
- WebhookPayload interface for type-safe request handling

#### Authentication System (`src/lib/auth.ts:1-104`)
Hardcoded credential system with:
- AdminCredentials interface and ADMIN_CREDENTIALS constant
- Session keys per dashboard type (salud/comida)
- sessionStorage management with 24-hour expiration
- Authentication validation and redirect utilities
- Login/logout functionality per dashboard

#### Message Processing Pipeline (`src/components/chat/Chat.tsx`)
1. **Input**: User message stored to localStorage with agent-specific key (`chat_messages_${agentId}`)
2. **Webhook Call**: POST to agent-specific n8n endpoint with complex browser-mimicking payload
3. **Response Processing**: JSON parsing for multiple data formats (text, images, arrays, objects)
4. **Image Handling**: Google Drive URL conversion (drive.google.com → lh3.googleusercontent.com)
5. **Display**: Formatted timestamps, typing indicators, and message persistence
6. **State Management**: Conversation IDs and message IDs managed per agent session

#### Data Processing for Dashboard
- Raw webhook data → normalized conversation/appointment records (dual-table system)
- Sentiment analysis using Spanish keywords (bueno, excelente, malo, terrible, etc.)
- Time-based metrics calculation (response times, conversation duration)
- Date range filtering with Spanish locale (date-fns with `es` locale)
- Export functionality with html2canvas and jsPDF for PDF generation

#### Supabase Integration (`src/lib/supabase.ts:1-161`)
- **Graceful Fallback**: Application works without Supabase credentials (development mode)
- **Configuration Storage**: Agent settings stored in `configuraciones_agentes` table
- **Type-safe**: Full TypeScript interfaces (ConfiguracionAgente, ConfiguracionRow)
- **Error Handling**: Comprehensive error logging and fallback mechanisms
- **CRUD Operations**: getConfiguracionAgente() and saveConfiguracionAgente() functions

#### State Management Patterns
- Agent selection persisted to localStorage
- Chat messages stored per agent with unique keys (`chat_messages_${agentId}`)
- Conversation IDs managed per agent session
- Theme switching with smooth CSS transitions
- Authentication sessions in sessionStorage per dashboard type

### Build & Deployment Configuration

#### Next.js Configuration (`next.config.ts`)
- **Turbopack**: Enabled for faster development builds
- **Build Error Handling**: TypeScript and ESLint errors ignored for deployment
- **Package Optimization**: Optimized imports for @radix-ui/react-icons, lucide-react, recharts
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy configured
- **Image Optimization**: Remote patterns for Google Drive (lh3.googleusercontent.com, drive.google.com) and n8n domains

#### Deployment Notes
- Application builds successfully despite TypeScript errors (intentionally configured)
- Uses experimental package optimization for better performance
- Security headers applied in production environment
- Image optimization configured for external services (Google Drive, n8n)

### Development Notes

#### Component Architecture
- **shadcn/ui**: Complete component library with 37+ components, CSS variables, slate base color, TypeScript support
- **Components Location**: All UI components in `/src/components/ui/`, charts in `/src/components/charts/`, dashboard components in `/src/components/dashboard-*`
- **Component Configuration**: `components.json` configures shadcn/ui with path aliases (`@/components`, `@/lib/utils`)
- **Tailwind CSS**: Custom animations, agent themes, and complete design system configured in `tailwind.config.js`

#### Agent System
- **Health Agent (salud)**: Medical assistance, appointment scheduling, symptom-based recommendations
- **Food Agent (comida)**: Restaurant menu, recommendations, order taking with geographic order analysis by Medellín communes
- **Extensible Design**: Easy to add new agents with custom themes and webhook endpoints
- **Agent Routing**: Separate login pages and dashboards per agent type

#### Performance Considerations
- WebGL plasma effects may impact performance on lower-end devices
- Large datasets in dashboard require efficient filtering and pagination
- Image loading from Google Drive needs error handling and fallback URLs
- Authentication sessions expire after 24 hours for security

## Key Architecture Concepts

### Multi-Agent System
- **Agent Types**: Health (salud) and Food (comida) agents with independent webhook endpoints
- **Agent Routing**: URL structure supports both generic and agent-specific routes (/login/[agent], /dashboard/[agent], etc.)
- **Theme System**: Dynamic CSS theming per agent (Salud: blue #2C8082, Comida: orange #FF6B35)
- **State Isolation**: Each agent maintains separate localStorage keys, sessions, and conversation IDs

### Data Flow Architecture
1. **Frontend Input** → localStorage persistence → webhook call to n8n
2. **n8n Processing** → webhook response → JSON parsing and display
3. **Dashboard Analytics** → real-time n8n data fetching → sentiment analysis → visualization
4. **Configuration** → Supabase storage (optional) → local fallbacks → graceful degradation

### Performance & Optimization
- **Turbopack**: Faster development builds with `npm run dev:turbopack`
- **Package Optimization**: Optimized imports for UI libraries (@radix-ui, lucide-react, recharts)
- **Build Configuration**: TypeScript/ESLint errors ignored for deployment reliability
- **WebGL Effects**: OGL library for plasma backgrounds with performance considerations

## Project Structure

### Route Organization
```
/                          # Main app with agent selection and chat
/login/[agent]             # Agent-specific login pages
/dashboard                 # Health agent dashboard (protected)
/dashboard/[agent]         # Agent-specific dashboards (protected)
/chat                      # Dedicated chat interface
/chat/[agent]              # Agent-specific chat interfaces
/settings/[agent]          # Agent-specific settings pages
```

### Component Architecture
- **`/src/components/chat/`**: Complete chat system with messages, input, header, and AgentSelector
- **`/src/components/ui/`**: shadcn/ui component library (37+ components)
- **`/src/components/charts/`**: Custom chart components for dashboard analytics
- **`/src/components/dashboard-*`**: Analytics dashboard components with real-time data
- **`/src/lib/`**: Configuration, utilities, authentication, types, Supabase integration, and constants

### Key Configuration Files
- **`components.json`**: shadcn/ui configuration with CSS variables, TypeScript support, and path aliases
- **`tailwind.config.js`**: Tailwind CSS setup with custom animations and agent themes
- **`next.config.ts`**: Build optimization, security headers, image patterns, and Turbopack configuration
- **`tsconfig.json`**: TypeScript configuration with Next.js paths
- **`Package Dependencies**: Includes Zustand for state management, date-fns for Spanish locale, html2canvas + jsPDF for PDF export, OGL for WebGL effects