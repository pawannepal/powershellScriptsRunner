import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-directory-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="directory-section">
      <div class="directory-path">
        {{ currentDirectory || 'No directory selected' }}
      </div>
      <button (click)="selectScriptDir.emit()">
        Select Scripts Directory
      </button>
    </div>
    
    <div class="directory-section">
      <div class="directory-path">
        {{ baseDirectory || 'Same as scripts directory' }}
      </div>
      <button (click)="selectBaseDir.emit()">
        Select Base Directory
      </button>
    </div>
  `,
  styles: [`
    .directory-section {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      gap: 10px;
    }
    
    .directory-path {
      background-color: #f0f0f0;
      padding: 10px;
      border-radius: 4px;
      flex-grow: 1;
      font-family: monospace;
      word-break: break-all;
      min-height: 20px;
    }
  `]
})
export class DirectorySelectorComponent {
  @Input() currentDirectory: string = '';
  @Input() baseDirectory: string = '';
  @Output() selectScriptDir = new EventEmitter<void>();
  @Output() selectBaseDir = new EventEmitter<void>();
}