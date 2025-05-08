# PowerShell Script Launcher

An Electron application built with Angular 18 to launch PowerShell scripts in Windows Terminal.

## Features

- Tabbed interface to manage API and UI scripts separately
- Select script directories and base execution directory
- Filter and select scripts to run
- Preview script contents
- Launch scripts in Windows Terminal

## Development

### Prerequisites

- Node.js 16+
- npm 8+
- Windows with PowerShell and Windows Terminal installed

### Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Package the application
npm run make
```

## Technology Stack

- Electron for cross-platform desktop application
- Angular 18 with standalone components
- Signal-based state management for reactive UI
- TypeScript for type safety
- SCSS for styling