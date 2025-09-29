# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js-based chat application with AI agents** called "Fábrica de Winners" that features multiple specialized AI assistants (Salud, Comida) with real-time chat functionality and interactive WebGL plasma effects. The application combines modern web graphics with conversational AI capabilities.

## Development Commands

```bash
# Development
npm run dev                    # Start development server with Turbopack

# Build & Production
npm run build                  # Create production build with Turbopack
npm run start                  # Start production server

# Code Quality
npm run lint                   # Run ESLint
```

## Architecture

### Core Structure
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **OGL library** for WebGL graphics rendering
- **Main directories**: `src/app/` (routes), `src/components/` (UI components)

### Key Components
1. **Main Application** (`src/app/page.tsx`): Spanish-language interface with agent selection and chat interface
2. **Chat Component** (`src/components/Chat.tsx`): Real-time chat with localStorage persistence and webhook integration
3. **Agent Selector** (`src/components/AgentSelector.tsx`): Interactive dropdown for switching between AI agents
4. **Plasma Effects** (`src/components/Plasma.tsx`): WebGL-based background plasma effects with mouse interaction

### Technical Features
- **Multi-Agent System**: Specialized AI assistants for different domains (Salud, Comida)
- **Real-time Chat**: WebSocket-like experience with typing indicators
- **Persistent Storage**: Messages saved to localStorage per agent
- **Webhook Integration**: External n8n webhooks for AI agent processing
- **Interactive Visual Effects**: Mouse-responsive WebGL plasma effects
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Uses Turbopack for fast builds and development

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
- **Message Persistence**: Messages stored in localStorage with agent-specific keys
- **Conversation Management**: Unique conversation IDs per agent session
- **Error Handling**: Comprehensive error handling for webhook failures
- **Real-time Updates**: Immediate UI updates with smooth animations
- **Message Processing**: Supports both webhook and local agent responses

### Agent Selection System
- **Dynamic Agent Loading**: Agents defined in configuration array
- **State Management**: Selected agent persisted to localStorage
- **UI/UX Features**: Hover tooltips, smooth transitions, visual feedback
- **Extensible Design**: Easy to add new agents with custom capabilities

### Plasma Effects
- **WebGL Shaders**: Custom GLSL vertex and fragment shaders
- **Interactive Controls**: Mouse position affects plasma movement
- **Customizable Props**: Color, speed, direction, scale, opacity
- **Performance**: Optimized with requestAnimationFrame and proper cleanup
- **Responsive**: Handles window resizing and device pixel ratio

## File Structure Patterns

- Components follow PascalCase naming (`Chat.tsx`, `AgentSelector.tsx`)
- Pages located in `src/app/` following App Router convention
- TypeScript interfaces defined inline with components
- CSS animations in separate `Plasma.css` file
- Custom utility functions for hex-to-RGB conversion
- Component-specific styles with Tailwind classes

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