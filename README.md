# PowerShell Script Launcher

An Electron application built with Angular 18 to launch PowerShell scripts in Windows Terminal.

## Features

- Tabbed interface to manage API and UI scripts separately
- Select script directories and base execution directory
- Filter and select scripts to run
- Preview script contents
- Launch scripts in Windows Terminal
- Available as both installer and portable executable

## Usage

### Basic Operation

1. **Select Script Directory**:
   - Click the "Select Directory" button to choose a folder containing your PowerShell scripts
   - The application will scan for `.ps1`, `.bat`, `.cmd`, and `.sh` files

2. **Select Scripts to Run**:
   - Check the scripts you want to run in the list
   - Click on a script name to view its contents

3. **Launch Scripts**:
   - Click the "Start Selected Scripts" button to launch scripts in Windows Terminal
   - Each script will open in a separate tab

### Example Workflow

```
# Example folder structure
C:\Projects\MyApp\
  ├── scripts\
  │   ├── start_api.ps1
  │   ├── start_database.ps1
  │   └── start_ui.ps1
  └── src\
      ├── api\
      └── ui\
```

1. Select `C:\Projects\MyApp\scripts` as your script directory
2. Check the scripts you need (e.g., `start_api.ps1` and `start_ui.ps1`)
3. (Optional) Set `C:\Projects\MyApp` as your base directory
4. Click "Start Selected Scripts" 
5. Windows Terminal will open with each script in its own tab

### Tips

- Use the search box to filter scripts by name or content
- Toggle between API and UI tabs to organize different types of scripts
- The "Select All" and "Deselect All" buttons help manage multiple scripts
- Click on a script name to expand and view its content

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
# Build for production (installer)
npm run build

# Build portable executable
npm run build:portable

# Build both installer and portable versions
npm run build:all
```

### Building Portable Version

The portable version creates a standalone executable that doesn't require installation:

1. Run `npm run build:portable` to generate the portable executable
2. Find the executable in the `dist-electron` directory
3. The portable executable can be run directly from any location without installation

### Cleaning the Build

The project includes a custom cleaning script that:
- Removes previous build artifacts
- Terminates any running instances of the application
- Cleans up temporary files

Run this manually with:
```bash
npm run clean
```

## Technology Stack

- Electron for cross-platform desktop application
- Angular 18 with standalone components
- Signal-based state management for reactive UI
- TypeScript for type safety
- SCSS for styling
- Windows Terminal integration for launching scripts
- PowerShell script execution

## Directory Structure

```
scripts/             - Build and utility scripts
src/
  ├── main.ts        - Electron main process
  ├── preload.ts     - Preload script for secure IPC
  └── renderer/      - Angular application
      ├── app/       - Application code
      │   ├── components/   - UI components
      │   ├── models/       - Data models
      │   └── services/     - Application services
      └── assets/    - Application assets
```

## License

MIT