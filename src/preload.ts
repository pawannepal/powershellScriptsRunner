import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  readDirectory: (path: string) => ipcRenderer.invoke('read-directory', path),
  runScripts: (scripts: string[], baseDir: string) => ipcRenderer.invoke('run-scripts', scripts, baseDir)
});