/**
 * Clean script for PowerShell Script Launcher
 * Removes build artifacts and terminates running processes that might lock files
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to clean
const directories = [
  'dist-electron',
  'dist-electron-*',
  'portable-build',
  'win-unpacked'
];

// Kill any running instances of the app
console.log('Terminating any running instances of the app...');
try {
  // Try to kill any PowerShell Script Launcher processes
  execSync('taskkill /F /IM "PowerShell Script Launcher.exe" /T 2>nul || exit /b 0', { 
    stdio: 'pipe', 
    shell: true 
  });
  console.log('All app processes terminated.');
} catch (error) {
  // It's okay if no processes were found
  console.log('No running app processes found.');
}

// Clean directories
console.log('Cleaning build directories...');
directories.forEach(dirPattern => {
  const basePath = path.resolve(__dirname, '..');
  
  // Handle glob patterns
  if (dirPattern.includes('*')) {
    const baseDir = dirPattern.split('*')[0];
    const basePattern = dirPattern.split('*')[1];
    
    try {
      const baseFullPath = path.join(basePath, baseDir);
      if (fs.existsSync(baseFullPath)) {
        const items = fs.readdirSync(baseFullPath);
        items.forEach(item => {
          const fullPath = path.join(baseFullPath, item);
          if (fs.statSync(fullPath).isDirectory() && 
              (basePattern === '' || item.endsWith(basePattern))) {
            console.log(`Removing directory: ${fullPath}`);
            try {
              fs.rmSync(fullPath, { recursive: true, force: true });
            } catch (err) {
              console.error(`Error removing ${fullPath}:`, err.message);
            }
          }
        });
      }
    } catch (err) {
      console.error(`Error processing pattern ${dirPattern}:`, err.message);
    }
  } else {
    // Normal directory
    const fullPath = path.join(basePath, dirPattern);
    if (fs.existsSync(fullPath)) {
      console.log(`Removing directory: ${fullPath}`);
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
      } catch (err) {
        console.error(`Error removing ${fullPath}:`, err.message);
      }
    }
  }
});

console.log('Cleanup completed successfully!');