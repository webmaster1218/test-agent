# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js-based chat application with AI agents** called "Fábrica de Winners" that features multiple specialized AI assistants (Salud, Comida) with real-time chat functionality and interactive WebGL plasma effects. The application combines modern web graphics with conversational AI capabilities.

## Development Commands

```bash
# Development
npm run dev                    # Start development server (Next.js with hot reload)

# Build & Production
npm run build                  # Create production build
npm run start                  # Start production server

# Code Quality
npm run lint                   # Run ESLint for code quality checks
```

## Architecture

### Core Structure
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 3** for styling
- **OGL library** for WebGL graphics rendering
- **Main directories**: `src/app/` (routes), `src/components/` (UI components), `src/lib/` (config and utilities), `src/types/` (TypeScript types)

### Key Components
1. **Main Application** (`src/app/page.tsx`): Spanish-language interface with agent selection and chat interface
2. **Chat Component** (`src/components/chat/Chat.tsx`): Real-time chat with localStorage persistence and webhook integration
3. **Agent Selector** (`src/components/ui/AgentSelector.tsx`): Interactive dropdown for switching between AI agents with capability tooltips
4. **Plasma Effects** (`src/components/ui/Plasma.tsx`): WebGL-based background plasma effects with mouse interaction using OGL library
5. **Theme System** (`src/lib/config/themes.ts`): Agent-specific color themes and visual styling
6. **Constants** (`src/lib/config/constants.ts`): Application configuration and webhook URLs

### Technical Features
- **Multi-Agent System**: Specialized AI assistants for different domains (Salud, Comida) with unique capabilities
- **Real-time Chat**: WebSocket-like experience with typing indicators and message history
- **Persistent Storage**: Messages and conversation IDs saved to localStorage per agent
- **Webhook Integration**: External n8n webhooks for real AI agent processing with conversation tracking
- **Interactive Visual Effects**: Mouse-responsive WebGL plasma effects using GLSL shaders
- **Responsive Design**: Mobile-first approach with Tailwind CSS and custom animations
- **Error Handling**: Comprehensive error handling for webhook failures and UI states
- **Theme System**: Dynamic theming based on selected agent with smooth transitions

### External Integrations
- **n8n Webhooks**:
  - Salud agent: `https://n8n.vivefelizsindolor.com/webhook/d25d94ff-e996-4044-88e9-9a108118f0f4`
  - Comida agent: `https://n8n.vivefelizsindolor.com/webhook/ff3f992e-bf39-432a-9dad-05ce3ec14d26`
- **WebGL 2**: Required for advanced plasma effects

### Configuration Notes
- **TypeScript**: Path aliases configured (`@/*` → `src/*`)
- **ESLint**: Next.js configuration with TypeScript support
- **Tailwind CSS**: Modern CSS framework with custom styling
- **Next.js**: Image optimization and performance features enabled
- **WebGL 2**: Required for plasma effects

## Development Workflow

1. Use `npm run dev` for development with hot reload and Turbopack
2. Run `npm run lint` for code quality checks before committing
3. Build with `npm run build` for production deployment
4. Test chat functionality and visual effects in browser

## Key Technical Details

### Chat System Architecture
- **Message Persistence**: Messages stored in localStorage with agent-specific keys (`chat_messages_${agentId}`)
- **Conversation Management**: Unique conversation IDs per agent session (`conversationId_${agentId}`)
- **Webhook Integration**: Complex payload structure with headers mimicking browser requests
- **Real-time Updates**: Immediate UI updates with smooth CSS animations and transitions
- **Message Processing**: Supports both webhook responses and local fallback responses
- **Error Recovery**: Graceful degradation with user-friendly error messages

### Agent Selection System
- **Agent Configuration**: Agents defined in `AgentSelector.tsx` with capabilities array
- **State Management**: Selected agent persisted to localStorage with theme updates
- **UI/UX Features**: Capability tooltips, hover states, smooth transitions, visual feedback
- **Extensible Design**: Easy to add new agents with custom themes and capabilities

### Plasma Effects System
- **WebGL Implementation**: Uses OGL library with WebGL 2 for advanced shader effects
- **GLSL Shaders**: Custom vertex and fragment shaders for plasma generation
- **Interactive Controls**: Mouse position affects plasma movement via uniform variables
- **Customizable Props**: Color, speed, direction, scale, opacity, mouse interaction
- **Performance**: Optimized with requestAnimationFrame, ResizeObserver, and proper cleanup
- **Responsive**: Handles window resizing and device pixel ratio automatically

## File Structure Patterns

- **Components**: Follow PascalCase naming, organized by feature (`src/components/chat/`, `src/components/ui/`)
- **Pages**: Located in `src/app/` following Next.js App Router convention
- **Types**: Centralized in `src/types/index.ts` with TypeScript interfaces
- **Configuration**: Separate config files in `src/lib/config/` for themes and constants
- **Utilities**: Custom utility functions (hex-to-RGB conversion in Plasma component)
- **Styling**: Component-specific styles with Tailwind classes and inline CSS variables for theming

## Important Notes

- **WebGL Requirements**: Modern browsers with WebGL 2 support required
- **Spanish Language**: UI text is in Spanish, reflecting the target audience
- **Agent Specialization**: Each agent has domain-specific capabilities and behaviors
- **Performance**: WebGL effects may impact performance on lower-end devices
- **Testing**: Manual testing required for visual effects and chat interactions
- **Error Handling**: Comprehensive error handling for webhook failures and UI states

## Current Implementation Status

The application is fully functional with:
- Working chat interface for Salud and Comida agents
- Interactive plasma effects background
- Agent selection with localStorage persistence
- Webhook integration for real AI agent responses
- Responsive design across device sizes
- Modern UI with smooth animations and transitions