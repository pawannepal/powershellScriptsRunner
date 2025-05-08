// Model definitions for PowerShell Script Launcher
export interface ScriptData {
  name: string;
  path: string;
  content: string;
  checked?: boolean;
  open?: boolean;
}

export type TabType = 'api' | 'ui';

export interface StatusMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}