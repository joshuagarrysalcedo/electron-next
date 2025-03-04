# CLAUDE.md - Configuration for Electron-Next Project

## Build Commands
- `npm run dev` - Start Next.js in development mode with Turbopack
- `npm run build` - Build Next.js application
- `npm run lint` - Run ESLint
- `npm run electron:dev` - Run Electron with Next.js in development mode
- `npm run electron:build` - Build Electron application
- `npm run electron:build:all` - Build for all platforms (macOS, Windows, Linux)
- `npm run mobile:android` - Build and open Android application
- `npm run mobile:ios` - Build and open iOS application

## Code Style Guidelines
- **Imports**: Use absolute imports with `@/` prefix. Group imports: React, external libraries, internal components
- **Components**: Use functional components with TypeScript. Follow shadcn/ui patterns
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Types**: Use strict TypeScript. Define explicit interfaces/types for props
- **CSS**: Use Tailwind with class-variance-authority (cva) for variants
- **Error Handling**: Use try/catch and provide clear error messages
- **State Management**: Prefer React hooks for local state, zustand for global state
- **File Structure**: Keep components in components/ui/ or components/reusable/
- **Next.js**: Use App Router conventions with page.tsx files