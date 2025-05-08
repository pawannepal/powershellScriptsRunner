import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

// Promisified file system functions
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

// Script data interface
interface ScriptData {
  name: string;
  path: string;
  content: string;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

/**
 * Window Management
 */
let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the index.html file
  mainWindow.loadFile(path.resolve(__dirname, 'renderer', 'index.html'));

  // Open DevTools in development
  if (process.env['NODE_ENV'] === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

// App lifecycle event handlers
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS, recreate a window when dock icon is clicked and no windows open
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, it's common to keep the app running until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * IPC Handlers
 */

// Handler for directory selection dialog
ipcMain.handle('select-directory', async () => {
  if (!mainWindow) return { canceled: true };

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Scripts Directory',
  });

  return result.canceled 
    ? { canceled: true } 
    : { canceled: false, filePath: result.filePaths[0] };
});

// Handler for reading directory contents
ipcMain.handle('read-directory', async (_, directoryPath: string) => {
  try {
    const scriptFiles = await getScriptFilesFromDirectory(directoryPath);
    return { success: true, scripts: scriptFiles };
  } catch (error) {
    console.error('Error reading directory:', error);
    return { success: false, error: String(error) };
  }
});

// Handler for running selected scripts
ipcMain.handle('run-scripts', async (_, scripts: string[], baseDir: string) => {
  try {
    if (scripts.length === 0) {
      return { success: false, error: 'No scripts selected' };
    }

    await launchScriptsInWindowsTerminal(scripts, baseDir);
    return { success: true };
  } catch (error) {
    console.error('Error running scripts:', error);
    return { success: false, error: String(error) };
  }
});

/**
 * Helper Functions
 */

// Get script files from a directory
async function getScriptFilesFromDirectory(directoryPath: string): Promise<ScriptData[]> {
  const files = await readdirAsync(directoryPath);
  const scriptFiles: ScriptData[] = [];
  const scriptExtensions = ['.ps1', '.bat', '.cmd', '.sh'];

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = await statAsync(filePath);
    
    // Filter for script files
    const fileExtension = path.extname(file).toLowerCase();
    if (stats.isFile() && scriptExtensions.includes(fileExtension)) {
      try {
        // Read first few lines for preview
        const buffer = await readFileAsync(filePath, { encoding: 'utf8' });
        const preview = buffer.split('\n').slice(0, 3).join('\n');
        
        scriptFiles.push({
          name: file,
          path: filePath,
          content: preview
        });
      } catch (error) {
        console.error(`Error reading file ${file}:`, error);
        scriptFiles.push({
          name: file,
          path: filePath,
          content: 'Could not read file content'
        });
      }
    }
  }

  return scriptFiles;
}

// Launch scripts in Windows Terminal
async function launchScriptsInWindowsTerminal(scriptPaths: string[], baseDir: string): Promise<void> {
  // Generate PowerShell script content
  const scriptContent = generatePowershellScript(scriptPaths, baseDir);
  
  // Write to temporary file
  const tempDir = app.getPath('temp');
  const tempScriptPath = path.join(tempDir, `run_scripts_${Date.now()}.ps1`);
  
  fs.writeFileSync(tempScriptPath, scriptContent, { encoding: 'utf8' });
  
  // Execute the PowerShell script
  return new Promise((resolve, reject) => {
    exec(`powershell.exe -ExecutionPolicy Bypass -File "${tempScriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing PowerShell: ${error}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`PowerShell stderr: ${stderr}`);
      }
      
      console.log(`PowerShell stdout: ${stdout}`);
      
      // Clean up temp file after a delay
      setTimeout(() => {
        try {
          fs.unlinkSync(tempScriptPath);
        } catch (err) {
          console.error('Failed to delete temp file:', err);
        }
      }, 10000);
      
      resolve();
    });
  });
}

// Generate PowerShell script for Windows Terminal script launching
function generatePowershellScript(scriptPaths: string[], baseDir: string): string {
  const scriptHeader = [
    `# Auto-generated script launcher`,
    `# Generated on ${new Date().toISOString()}`,
    ``,
    `# Base directory: ${baseDir}`,
    ``,
    `# Disable profile loading to avoid module errors`,
    `$env:PSModulePath = '';`,
    ``,
    `# Start scripts in Windows Terminal`,
    `$firstScript = $true`,
    ``
  ].join('\n');

  // Generate script array
  const scriptsArray = scriptPaths.map(scriptPath => {
    const scriptName = path.basename(scriptPath, path.extname(scriptPath))
      .replace(/^start_/, '');
    // Properly format the path to avoid extra spaces or escape characters
    const formattedPath = scriptPath.trim().replace(/\\/g, '\\\\');
    return `    @{ name = "${scriptName}"; path = "${formattedPath}" }`;
  }).join(',\n');

  const scriptBody = [
    `$scripts = @(`,
    scriptsArray,
    `)\n`,
    `foreach ($script in $scripts) {`,
    `    Write-Host "Starting $($script.name) script..."`,
    `    try {`,
    `        if ($firstScript) {`,
    `            # First tab (new window) using cmd.exe instead of pwsh`,
    `            wt.exe -d "${baseDir}" --title "$($script.name)" cmd.exe /k "PowerShell.exe -NoProfile -ExecutionPolicy Bypass -File "$($script.path)""`,
    `            $firstScript = $false`,
    `        } else {`,
    `            # Subsequent tabs in same window using cmd.exe`,
    `            wt.exe -w 0 nt --title "$($script.name)" -d "${baseDir}" cmd.exe /k "PowerShell.exe -NoProfile -ExecutionPolicy Bypass -File "$($script.path)""`,
    `        }`,
    `        Start-Sleep -Seconds 1`,
    `    } catch {`,
    `        Write-Error "Failed to start $($script.name) script: $_"`,
    `    }`,
    `}`
  ].join('\n');

  return scriptHeader + scriptBody;
}
