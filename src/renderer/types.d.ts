// Add this to the top of the file to make TypeScript aware of the window.api object
interface Window {
  api: {
    selectDirectory: () => Promise<{canceled: boolean, filePath?: string}>;
    readDirectory: (path: string) => Promise<{success: boolean, scripts?: ScriptData[], error?: string}>;
    runScripts: (scripts: string[], baseDir: string) => Promise<{success: boolean, error?: string}>;
  };
}

interface ScriptData {
  name: string;
  path: string;
  content: string;
  checked?: boolean;
  open?: boolean;
}