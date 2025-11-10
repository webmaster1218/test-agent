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

## Development Notes

- Build errors are ignored for deployment (TypeScript and ESLint configured in next.config.ts)
- The application uses Turbopack for faster development builds
- Image optimization is configured for Google Drive and n8n domains
- Security headers are configured for production deployment
- All components use TypeScript with strict type checking
- **Vercel Environment Variables Required**: For deployment, configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel dashboard

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
- **Dashboard Analytics**: `https://n8n.vivefelizsindolor.com/webhook/dda6a613-7df4-4c2c-86d9-ad213a155c9c`
- **Health Agent**: `https://n8n.srv1054162.hstgr.cloud/webhook/564531df-e16b-40e4-8e1c-522aa0529631`
- **Food Agent**: `https://n8n.vivefelizsindolor.com/webhook/ff3f992e-bf39-432a-9dad-05ce3ec14d26`

#### Configuration Files
- **`src/lib/config/constants.ts`**: Webhook URLs and application config
- **`src/lib/config/themes.ts`**: Agent-specific color themes with plasma effects
- **`src/lib/types.ts`**: Minimal TypeScript interfaces (Message interface)
- **`src/lib/auth.ts`**: Authentication utilities and session management
- **`src/app/actions.ts`**: Server-side sentiment analysis using Spanish keywords

### Key Technical Details

#### Webhook Payload Structure
Complex payload mimicking browser requests with:
- Full browser headers (user-agent, accept headers, etc.)
- Conversation and message ID management
- Timestamp handling with ISO format
- Response parsing for multiple data formats (JSON arrays/objects)

#### Message Processing Pipeline
1. User input → localStorage persistence (`chat_messages_${agentId}`)
2. Webhook POST with complex payload structure mimicking browser headers
3. Response parsing with JSON extraction for text and images
4. Google Drive URL conversion (drive.google.com → lh3.googleusercontent.com)
5. Display with formatted timestamps and typing indicators

#### Data Processing for Dashboard
- Raw webhook data → normalized conversation/appointment records (dual-table system)
- Sentiment analysis using Spanish keywords (bueno, excelente, malo, terrible, etc.)
- Time-based metrics calculation (response times, conversation duration)
- Date range filtering with Spanish locale (date-fns with `es` locale)
- Export functionality with html2canvas and jsPDF for PDF generation

#### State Management Patterns
- Agent selection persisted to localStorage
- Chat messages stored per agent with unique keys (`chat_messages_${agentId}`)
- Conversation IDs managed per agent session
- Theme switching with smooth CSS transitions
- Authentication sessions in sessionStorage per dashboard type

### Development Notes

#### Configuration Features
- **Turbopack**: Enabled for faster development builds
- **Build Optimization**: Package imports optimization for @radix-ui/react-icons, lucide-react, recharts
- **Security Headers**: Custom headers for production (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- **Image Optimization**: Remote patterns for Google Drive (lh3.googleusercontent.com, drive.google.com) and n8n domains
- **ESLint/TypeScript**: Build errors ignored for deployment (configured in next.config.ts)
- **shadcn/ui**: Configured with CSS variables, slate base color, TypeScript support
- **Component Library**: 37+ shadcn/ui components including charts, forms, data display components

#### Agent System
- **Health Agent (salud)**: Medical assistance, appointment scheduling, symptom-based recommendations
- **Food Agent (comida)**: Restaurant menu, recommendations, order taking
- **Extensible Design**: Easy to add new agents with custom themes and webhook endpoints
- **Agent Routing**: Separate login pages and dashboards per agent type

#### Performance Considerations
- WebGL plasma effects may impact performance on lower-end devices
- Large datasets in dashboard require efficient filtering and pagination
- Image loading from Google Drive needs error handling and fallback URLs
- Authentication sessions expire after 24 hours for security

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
- **`/src/lib/`**: Configuration, utilities, authentication, types, and constants

### Key Configuration Files
- **`components.json`**: shadcn/ui configuration with CSS variables and TypeScript
- **`tailwind.config.ts`**: Tailwind CSS setup with custom animations and agent themes
- **`next.config.ts`**: Build optimization, security headers, and image patterns
- **`tsconfig.json`**: TypeScript configuration with Next.js paths