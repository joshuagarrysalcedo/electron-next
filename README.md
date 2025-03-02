# Electron Next.js Cross-Platform App

This is a cross-platform application built with Electron and Next.js that can be deployed to:
- Desktop (Windows, macOS, Linux) via Electron
- iOS via Capacitor
- Android via Capacitor
- Web via Next.js

## Features

- 🖥️ Desktop application with Electron
- 📱 Mobile applications with Capacitor
- 🌐 Web application with Next.js
- 🔄 Shared codebase across all platforms
- 🎨 UI components with Shadcn UI
- 🔌 API abstraction layer for external services
- 🔒 Secure IPC communication between Electron main and renderer processes

## Prerequisites

- Node.js 18+ and npm
- For iOS: macOS with Xcode
- For Android: Android Studio
- For desktop builds: Relevant build tools (see Electron docs)

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run Next.js web app
npm run dev

# Run Electron app with Hot Reload
npm run electron:dev

# Run iOS app
npm run mobile:ios

# Run Android app
npm run mobile:android
```

### Building

```bash
# Build for all desktop platforms
npm run electron:build:all

# Build for specific platform
npm run electron:build:mac
npm run electron:build:win
npm run electron:build:linux

# Build for web
npm run build
```

## Project Structure

- `app/` - Next.js app pages
- `components/` - Reusable React components
- `electron/` - Electron main process files
  - `main.js` - Main Electron process
  - `preload.js` - Preload script for Electron
  - `api-handler.js` - API request handler for Electron
- `hooks/` - Custom React hooks
  - `use-electron.ts` - Hook to detect Electron environment
  - `use-mobile.ts` - Hook to detect mobile environment
- `lib/` - Utility functions and services
  - `api.ts` - API service for making API requests
- `templates/` - Template files for new components and pages
  - `api-endpoint.ts` - Template for adding new API endpoints
  - `page-template.tsx` - Template for adding new pages
  - `platform-component.tsx` - Template for platform-aware components
- `types/` - TypeScript type definitions

## Adding New API Endpoints

1. Duplicate the `templates/api-endpoint.ts` file to a new file in your desired location
2. Update the interface definitions for your specific API
3. Update the API_PATH constant
4. Implement any custom methods needed for this API

## Adding New Pages

1. Duplicate the `templates/page-template.tsx` file to a new file in the `app` directory
2. Update the component name and content
3. Implement your page-specific logic

## Platform-Specific Code

Use the provided hooks and components to handle platform-specific code:

```tsx
// Using hooks for platform detection
const { isElectron } = useElectron();
const { isCapacitor, isIOS, isAndroid } = useMobilePlatform();

// Using platform-specific components
<Desktop>
  <p>This only renders on desktop</p>
</Desktop>

<Mobile>
  <p>This only renders on mobile</p>
</Mobile>

<IOS>
  <p>This only renders on iOS</p>
</IOS>

<Android>
  <p>This only renders on Android</p>
</Android>

<Web>
  <p>This only renders on web</p>
</Web>
```

## API Requests

Use the API service to make requests to external APIs:

```tsx
import { useApi } from '../lib/api';
import { exampleApi } from '../api/example';

function MyComponent() {
  const { api } = useApi();
  
  const fetchData = async () => {
    // Using the generic API service
    const response = await api.get('/some/endpoint');
    
    // Using a specific API module
    const examples = await exampleApi.getAll();
  };
  
  // ...
}
```

## Next.js Resources

This project was originally bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Electron Documentation](https://www.electronjs.org/docs/latest/) - learn about Electron.
- [Capacitor Documentation](https://capacitorjs.com/docs) - learn about Capacitor for mobile.

## License

MIT
# electron-next
# electron-next
