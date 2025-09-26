# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js-based visual effects landing page** that demonstrates modern web graphics capabilities using WebGL shaders. The application features plasma effects with interactive mouse controls and uses a clean, flat color design approach.

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
1. **Main Landing Page** (`src/app/page.tsx`): Spanish-language landing page with flat color backgrounds and feature cards
2. **Plasma Effects Component** (`src/components/Plasma.tsx`): WebGL-based plasma effects with interactive mouse controls

### Technical Features
- **WebGL Shaders**: Custom vertex and fragment shaders for plasma effects
- **Interactive Mouse Controls**: Real-time mouse interaction with plasma effects
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Uses Turbopack for fast builds and development
- **Customizable Effects**: Configurable colors, speed, direction, scale, and opacity
- **Flat Color Design**: All colors use solid, flat colors without gradients

### Configuration Notes
- **TypeScript**: Path aliases configured (`@/*` → `src/*`)
- **ESLint**: Next.js configuration with TypeScript support
- **Tailwind CSS**: Modern CSS framework for styling
- **Next.js**: Image optimization and performance features enabled
- **WebGL 2**: Required for advanced graphics features
- **Design Philosophy**: Strict use of flat colors only - no gradients allowed

## Development Workflow

1. Use `npm run dev` for development with hot reload and Turbopack
2. Run `npm run lint` for code quality checks before committing
3. Build with `npm run build` for production deployment
4. Test visual effects on the main landing page

## File Structure Patterns

- Components follow PascalCase naming (`Plasma.tsx`)
- Pages located in `src/app/` following App Router convention
- TypeScript types inferred from component props
- CSS animations and transitions defined inline using Tailwind classes
- WebGL shaders embedded as template literals in components
- Color classes use flat colors only (no gradient-to-r classes)

## Important Notes

- **Performance**: WebGL effects require modern browsers with WebGL 2 support
- **Accessibility**: Visual effects may require accessibility considerations
- **Mobile**: Responsive design works across device sizes
- **Dependencies**: OGL library handles low-level WebGL operations
- **Testing**: Visual effects require manual testing in browser
- **Shaders**: Complex mathematical functions for plasma generation in `src/components/Plasma.tsx`
- **Color Policy**: Strict adherence to flat colors - all gradients must be replaced with solid colors

## Plasma Component Details

The Plasma component (`src/components/Plasma.tsx`) is the core visual effect:

- **WebGL Rendering**: Uses OGL library for efficient WebGL operations
- **Shader Programs**: Custom GLSL shaders for plasma generation
- **Interactive Features**: Mouse position affects plasma movement
- **Customization**: Props for color, speed, direction, scale, opacity
- **Performance**: Optimized with requestAnimationFrame and proper cleanup
- **Responsive**: Handles window resizing and device pixel ratio
- **Current Color**: Configured to use `#4229FF` (blue-purple flat color)

The plasma effect is generated using complex mathematical functions that create organic, flowing patterns with customizable colors and interactive mouse controls. All UI elements use flat colors without gradients.