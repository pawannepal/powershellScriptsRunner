import { Injectable, computed, effect, signal } from '@angular/core';
import { ScriptData, StatusMessage, TabType } from '../models/script.model';

declare global {
  interface Window {
    api: {
      selectDirectory: () => Promise<{canceled: boolean, filePath?: string}>;
      readDirectory: (path: string) => Promise<{success: boolean, scripts?: ScriptData[], error?: string}>;
      runScripts: (scripts: string[], baseDir: string) => Promise<{success: boolean, error?: string}>;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  // Signal-based state
  readonly activeTab = signal<TabType>('api');
  readonly apiDirectory = signal<string>('');
  readonly uiDirectory = signal<string>('');
  readonly baseDirectory = signal<string>('');
  readonly apiScripts = signal<ScriptData[]>([]);
  readonly uiScripts = signal<ScriptData[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly statusMessage = signal<StatusMessage | null>(null);
  readonly filterText = signal<string>('');

  // Computed values based on signals
  readonly currentDirectory = computed(() => 
    this.activeTab() === 'api' ? this.apiDirectory() : this.uiDirectory()
  );

  readonly currentScripts = computed(() => 
    this.activeTab() === 'api' ? this.apiScripts() : this.uiScripts()
  );

  readonly filteredScripts = computed(() => {
    const lowerFilter = this.filterText().toLowerCase();
    if (!lowerFilter) return this.currentScripts();
    
    return this.currentScripts().filter(script => 
      script.name.toLowerCase().includes(lowerFilter) || 
      script.content.toLowerCase().includes(lowerFilter)
    );
  });

  constructor() {
    // Example of an effect that logs state changes
    effect(() => {
      console.log(`Tab changed to: ${this.activeTab()}`);
    });
  }

  // Set the active tab
  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
    this.filterText.set('');
  }

  // Set filter text
  setFilterText(text: string): void {
    this.filterText.set(text);
  }

  // Select directory for scripts
  async selectDirectory(): Promise<void> {
    const result = await window.api.selectDirectory();
    
    if (!result.canceled && result.filePath) {
      if (this.activeTab() === 'api') {
        this.apiDirectory.set(result.filePath);
      } else {
        this.uiDirectory.set(result.filePath);
      }
      
      // Set base directory to be the same as script directory by default if not set
      if (!this.baseDirectory()) {
        this.baseDirectory.set(result.filePath);
      }
      
      await this.loadScripts(result.filePath);
    }
  }

  // Select base directory
  async selectBaseDirectory(): Promise<void> {
    const result = await window.api.selectDirectory();
    
    if (!result.canceled && result.filePath) {
      this.baseDirectory.set(result.filePath);
      this.showStatus(`Base directory set to: ${result.filePath}`, 'info');
    }
  }

  // Load scripts from selected directory
  async loadScripts(directoryPath: string): Promise<void> {
    if (!directoryPath) return;
    
    this.isLoading.set(true);
    this.showStatus('Loading scripts...', 'info');
    
    const result = await window.api.readDirectory(directoryPath);
    
    this.isLoading.set(false);
    
    if (result.success && result.scripts) {
      if (this.activeTab() === 'api') {
        this.apiScripts.set(result.scripts);
      } else {
        this.uiScripts.set(result.scripts);
      }
      
      if (result.scripts.length > 0) {
        this.showStatus(`Loaded ${result.scripts.length} scripts`, 'success');
      }
    } else {
      this.showStatus(`Failed to load scripts: ${result.error}`, 'error');
    }
  }

  // Refresh current directory
  refreshDirectory(): void {
    const currentDir = this.currentDirectory();
    if (currentDir) {
      this.loadScripts(currentDir);
    } else {
      this.showStatus('No directory selected', 'error');
    }
  }

  // Select all scripts
  selectAll(): void {
    if (this.activeTab() === 'api') {
      this.apiScripts.update(scripts => 
        scripts.map(script => ({...script, checked: true}))
      );
    } else {
      this.uiScripts.update(scripts => 
        scripts.map(script => ({...script, checked: true}))
      );
    }
    this.showStatus('All scripts selected', 'info');
  }

  // Deselect all scripts
  deselectAll(): void {
    if (this.activeTab() === 'api') {
      this.apiScripts.update(scripts => 
        scripts.map(script => ({...script, checked: false}))
      );
    } else {
      this.uiScripts.update(scripts => 
        scripts.map(script => ({...script, checked: false}))
      );
    }
    this.showStatus('All scripts deselected', 'info');
  }

  // Toggle script selection
  toggleScriptSelection(scriptPath: string): void {
    if (this.activeTab() === 'api') {
      this.apiScripts.update(scripts => 
        scripts.map(script => 
          script.path === scriptPath 
            ? {...script, checked: !script.checked} 
            : script
        )
      );
    } else {
      this.uiScripts.update(scripts => 
        scripts.map(script => 
          script.path === scriptPath 
            ? {...script, checked: !script.checked} 
            : script
        )
      );
    }
  }

  // Toggle accordion open/close
  toggleAccordion(scriptPath: string): void {
    if (this.activeTab() === 'api') {
      this.apiScripts.update(scripts => 
        scripts.map(script => 
          script.path === scriptPath 
            ? {...script, open: !script.open} 
            : script
        )
      );
    } else {
      this.uiScripts.update(scripts => 
        scripts.map(script => 
          script.path === scriptPath 
            ? {...script, open: !script.open} 
            : script
        )
      );
    }
  }

  // Start selected scripts
  async startSelectedScripts(): Promise<void> {
    const selectedScriptPaths = this.currentScripts()
      .filter(script => script.checked)
      .map(script => script.path);
    
    if (selectedScriptPaths.length === 0) {
      this.showStatus('No scripts selected!', 'error');
      return;
    }
    
    this.showStatus(`Starting ${selectedScriptPaths.length} scripts...`, 'info');
    
    // Use baseDirectory if specified, otherwise use current directory
    const result = await window.api.runScripts(
      selectedScriptPaths, 
      this.baseDirectory() || this.currentDirectory()
    );
    
    if (result.success) {
      this.showStatus(
        `Successfully launched ${selectedScriptPaths.length} scripts in Windows Terminal`, 
        'success'
      );
    } else {
      this.showStatus(`Error launching scripts: ${result.error}`, 'error');
    }
  }

  // Show status message
  showStatus(text: string, type: 'success' | 'error' | 'info'): void {
    this.statusMessage.set({ text, type });
    
    // Hide after 5 seconds for success and info messages
    if (type !== 'error') {
      setTimeout(() => {
        this.statusMessage.set(null);
      }, 5000);
    }
  }
}