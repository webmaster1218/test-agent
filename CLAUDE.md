# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Fábrica de Winners**, a Next.js-based AI agent testing platform that features a Spanish-language interface with WebGL plasma effects, multi-agent chat functionality, and an analytics dashboard. The application integrates with n8n webhooks for real AI agent responses.

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

### MCP Server Configuration

The project includes Model Context Protocol (MCP) server configuration for shadcn/ui components:

**Configuration File**: `.mcp.json`
- **shadcn MCP Server**: Provides access to shadcn/ui component registry and examples
- **Command**: `npx shadcn@latest mcp`

**Usage**:
- Search components: `mcp__shadcn__search_items_in_registries`
- Get examples: `mcp__shadcn__get_item_examples_from_registries`
- Add components: `mcp__shadcn__get_add_command_for_items`

### Testing Infrastructure

**Current Status**: No testing infrastructure is implemented.

**Recommended Setup**:
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom

# Add to package.json scripts:
# "test": "jest",
# "test:watch": "jest --watch",
# "test:coverage": "jest --coverage"
```

**Priority Testing Areas**:
- Chat component interactions and localStorage persistence
- Dashboard data processing and webhook integration
- Theme switching and agent selection functionality
- Export functionality and sentiment analysis
- WebGL plasma effects rendering (visual testing)

## Architecture

### Core Technology Stack
- **Next.js 15** with App Router and TypeScript
- **React 19** with Server Components and Client Components
- **Tailwind CSS** with shadcn/ui components
- **Zustand** for client-side state management
- **Recharts** for data visualization
- **next-themes** for dark/light mode theming
- **OGL library** for WebGL graphics rendering
- **Supabase** for database and real-time features
- **React Hook Form** with Zod validation

### Key Components & Architecture

#### 1. **Main Application** (`src/app/page.tsx`)
- Spanish-language interface "FÁBRICA DE WINNERS"
- Interactive WebGL plasma effects background using OGL library
- Agent selection with localStorage persistence and theme switching
- Dashboard access button linking to analytics platform

#### 2. **Chat System Architecture**
- **Chat Interface** (`src/components/chat-interface.tsx`): n8n webhook integration with message persistence
- **Dashboard Chat** (`src/components/dashboard-chat.tsx`): Context-aware dashboard assistant
- **Chat Components**: Specialized components for messages, input, header, and welcome screens
  - `src/components/chat-messages.tsx`: Message display with typing indicators
  - `src/components/chat-input.tsx`: User input handling with multimedia support
  - `src/components/chat-header.tsx`: Agent-specific header with theme integration
  - `src/components/chat-welcome.tsx`: Welcome screen for new conversations
- **State Management**: Messages persisted to localStorage with agent-specific keys (`chat_messages_${agentId}`)
- **Conversation Management**: Unique conversation IDs per agent session (`conversationId_${agentId}`)

#### 3. **UI Component System**
- **shadcn/ui Components**: Comprehensive UI component library (35+ components)
- **Core App Components**:
  - `src/components/app-content.tsx`: Main application wrapper
  - `src/components/conditional-app-content.tsx`: Conditional rendering logic
  - `src/components/theme-provider.tsx`: Theme management with system detection
  - `src/components/theme-toggle.tsx`: Dark/light mode switching
- **Specialized Components**:
  - `src/components/logo.tsx` & `src/components/logo-emiliano.tsx`: Brand components
  - `src/components/chart-area-gradient.tsx`: Custom chart visualization
  - `src/components/chat-flow-wave-chart.tsx`: Interactive flow visualization
- **Theme System** (`src/lib/config/themes.ts`): Agent-specific color themes (Salud: blue, Comida: orange)

#### 4. **Analytics Dashboard** (`src/app/dashboard/page.tsx`)
- Comprehensive analytics dashboard with real-time data fetching from n8n webhooks
- **Dashboard Components**: Modular dashboard architecture
  - `src/components/dashboard-chat.tsx`: Integrated chat assistant
  - `src/components/dashboard-data-table.tsx`: Data table with filtering and export
  - `src/components/dashboard-filters.tsx`: Date range and sentiment filtering
  - `src/components/dashboard-metrics.tsx`: KPI displays and trend indicators
- **Visualization**: Multiple chart types (bar, pie, area, line, wave) with interactive features
- **Export Functionality**: CSV, JSON, XML, PDF, TXT formats with html2canvas and jsPDF
- **Data Processing**: Dual-table system for conversations and appointments data
- **Date Range Filtering**: Spanish locale support with flexible date selection
- **Sentiment Analysis Integration**: Real-time processing with visual indicators

#### 5. **Server Actions & Configuration**
- **Constants** (`src/lib/config/constants.ts`): Webhook endpoints and application configuration
  - Agent-specific webhook URLs and complex payload structures
  - Message ID generation and session management utilities
- **Types** (`src/lib/types.ts`): Minimal TypeScript interfaces for messages
- **Themes** (`src/lib/config/themes.ts`): Agent-specific theme configurations
- **Sentiment Analysis** (`src/app/actions.ts`): Server-side keyword-based sentiment classification
- **Settings Page** (`src/app/settings/page.tsx`): Application configuration interface

### External Integrations & Webhooks

#### n8n Workflow Integration
- **Dashboard Analytics Webhook**: `https://n8n.vivefelizsindolor.com/webhook/dda6a613-7df4-4c2c-86d9-ad213a155c9c`
- **Agent Webhooks**:
  - Salud agent: `https://n8n.srv1054162.hstgr.cloud/webhook/564531df-e16b-40e4-8e1c-522aa0529631`
  - Comida agent: `https://n8n.vivefelizsindolor.com/webhook/ff3f992e-bf39-432a-9dad-05ce3ec14d26`

#### AI Model & Graphics Integration
- **WebGL 2**: Required for advanced plasma effects using OGL library
- **GLSL Shaders**: Custom vertex and fragment shaders for plasma generation
- **Google Drive Integration**: Image handling and URL conversion for agent responses

## Environment Configuration

Create `.env.local` in project root:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Model Integration
ZAI_API_KEY=your-glm46-api-key
NEXT_PUBLIC_ZAI_API_KEY=your-public-glm46-key
```

### Configuration System

#### Application Configuration
- **TypeScript**: Path aliases configured (`@/*` → `src/*`) in `components.json`
- **ESLint**: Next.js configuration with TypeScript support, strict type checking enabled
- **Security Headers**: Custom headers in `next.config.ts` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- **Image Optimization**: Remote patterns for Google Drive and n8n domains
- **Build Optimization**: Turbopack support and package imports optimization
- **shadcn/ui**: Configured with default style, RSC enabled, and CSS variables

#### Build Optimization

The project uses Next.js 15 with optimization features:
- **Turbopack**: Faster development builds (`npm run dev:turbopack`)
- **Package Optimization**: Specific packages optimized (`@radix-ui/react-icons`, `lucide-react`, `recharts`)
- **Security Headers**: Custom headers for production deployment
- **Image Optimization**: Remote patterns for Google Drive and n8n domains
- **Bundle Analysis**: Code splitting and optimization enabled

**Production Build**:
```bash
npm run build    # Creates production build
npm start        # Starts production server
```

## Key Technical Details

### Data Processing Pipeline
- **Dual-Table System**: Processes both conversations and appointments data from webhook responses
- **Real-Time Data Flow**: n8n Webhook → Data Processing → Sentiment Analysis → Dashboard Visualization
- **Metrics Calculation**: Automatic calculation of satisfaction rates, response times, and engagement metrics
- **Date Range Filtering**: Spanish locale support with flexible date selection

### Chat System Architecture
- **Message Persistence**: Messages stored in localStorage with agent-specific keys (`chat_messages_${agentId}`)
- **Conversation Management**: Unique conversation IDs per agent session (`conversationId_${agentId}`)
- **Webhook Integration**: Complex payload structure with headers mimicking browser requests
- **Image Support**: Google Drive URL conversion and JSON parsing for multimedia responses

### Plasma Effects System
- **WebGL Implementation**: Uses OGL library with WebGL 2 for advanced shader effects
- **Custom Shaders**: Vertex and fragment GLSL shaders for plasma generation
- **Performance Optimization**: requestAnimationFrame, ResizeObserver, proper cleanup
- **Interactive Controls**: Customizable props for color, speed, direction, scale, opacity, mouse interaction

### Agent Selection System
- **Multi-Agent Support**: Health (Salud) and Food (Comida) specialized assistants
- **Theme Configuration**: Dynamic theming based on selected agent with color schemes
- **State Persistence**: Selected agent saved to localStorage across sessions
- **Extensible Design**: Easy to add new agents with custom themes and capabilities

### Theme System
- **Dark/Light Mode Toggle**: Full theme switching with system preference detection
- **Agent-Specific Themes**: Dynamic color schemes for Salud and Comida agents
- **Persistent Settings**: Theme preferences saved to localStorage
- **Smooth Transitions**: Animated theme changes with CSS transitions

### Sentiment Analysis System
- **Server-Side Processing**: Keyword-based classification in `src/app/actions.ts`
- **Real-Time Integration**: Sentiment data extracted from webhook responses
- **Visual Representation**: Color-coded indicators (Positivo/Neutro/Negativo) with percentages
- **Metrics Calculation**: Satisfaction rate based on sentiment distribution

## Project Structure

### Directory Organization
```
src/
├── app/                    # Next.js App Router pages
│   ├── actions.ts         # Server-side sentiment analysis
│   ├── chat/              # Chat-specific pages
│   ├── dashboard/         # Analytics dashboard
│   ├── settings/          # Application settings
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components (35+)
│   ├── chat-*.tsx        # Chat system components
│   ├── dashboard-*.tsx   # Dashboard components
│   └── theme-*.tsx       # Theme management
├── lib/                  # Utilities and configuration
│   ├── config/           # Constants, themes, webhooks
│   ├── types.ts          # TypeScript interfaces
│   └── utils.ts          # Utility functions
└── assets/               # Static assets
```

### File Structure Patterns
- **Components**: Follow PascalCase naming, organized by feature
- **Pages**: Located in `src/app/` following Next.js App Router convention
- **Types**: Minimal interfaces in `src/lib/types.ts`
- **Configuration**: Centralized in `src/lib/config/` for themes, constants, and webhooks
- **Utilities**: Custom utility functions in `src/lib/utils.ts`
- **Styling**: Component-specific styles with Tailwind classes and CSS variables

### Key Configuration Files

- **`components.json`**: shadcn/ui configuration with path aliases (`@/*` → `src/*`)
- **`src/lib/config/constants.ts`**: Webhook endpoints and application configuration
- **`src/lib/config/themes.ts`**: Agent-specific color themes (Salud: blue, Comida: orange)
- **`src/app/actions.ts`**: Server-side sentiment analysis (keyword-based Spanish sentiment)
- **`src/lib/types.ts`**: Minimal TypeScript interfaces for messages

## Important Notes

- **WebGL Requirements**: Modern browsers with WebGL 2 support required for plasma effects
- **Spanish Language**: UI text primarily in Spanish, reflecting target audience
- **Agent Specialization**: Each agent has domain-specific capabilities and behaviors
- **Performance**: WebGL effects may impact performance on lower-end devices
- **Testing**: Manual testing required for visual effects and chat interactions
- **Error Handling**: Comprehensive error handling for webhook failures and UI states
- **Data Dependencies**: Dashboard functionality depends on n8n webhook availability

## Development Workflow

1. **Development Setup**: `npm run dev` for hot reload development (port 3000)
2. **Type Safety**: `npm run typecheck` before commits (strict TypeScript enabled)
3. **Code Quality**: `npm run lint` and `npm run lint:fix` for code formatting
4. **Build Testing**: `npm run build` to verify production readiness
5. **Browser Testing**: Test chat functionality and visual effects

## Environment Setup

Create `.env.local` in project root:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Model Integration (GLM-4.6)
ZAI_API_KEY=your-glm46-api-key
NEXT_PUBLIC_ZAI_API_KEY=your-public-glm46-key
```

## Current Implementation Status

The application is fully functional with:
- **Multi-Agent Chat System**: Working chat interface for Salud and Comida agents with image support
- **Interactive Visual Effects**: Plasma effects background with WebGL and mouse interaction
- **Advanced Analytics Dashboard**: Real-time data processing with multiple chart types
- **Agent Selection System**: localStorage persistence with dynamic theming
- **Webhook Integration**: Real AI agent responses with JSON parsing and error handling
- **Google Drive Integration**: Image URL conversion and display capabilities
- **Theme System**: Complete dark/light mode support with system preference detection
- **Sentiment Analysis**: Real-time sentiment processing and visualization
- **Export Functionality**: Multiple format support (CSV, JSON, XML, PDF, TXT)
- **Robust Error Handling**: Comprehensive fallback systems and user-friendly error messages
- **TypeScript Configuration**: Strict type checking and comprehensive path aliases
- **Performance Optimizations**: Code splitting, image optimization, and bundle analysis

**Development Gaps**:
- **No Testing Infrastructure**: No test files, Jest configuration, or test scripts
- **Missing Environment Templates**: No `.env.local.example` template for required API keys
- **No Deployment Configuration**: No Docker, Vercel, or CI/CD setup

**Key Dependencies**:
- **React 19** + **Next.js 15** with App Router and TypeScript
- **shadcn/ui** (35+ components) with Radix UI primitives
- **Tailwind CSS** with CSS variables and animations
- **State Management**: Zustand for client-side state
- **Visualization**: Recharts for analytics, OGL for WebGL plasma effects
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS, clsx, tailwind-merge
- **Export**: jsPDF, html2canvas for dashboard exports
- **Themes**: next-themes for dark/light mode
- **Database**: Supabase for real-time features
- **Development**: ESLint, TypeScript strict mode