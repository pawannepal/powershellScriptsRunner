import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScriptData, TabType } from '../../models/script.model';

@Component({
  selector: 'app-script-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="script-list">
      <ng-container *ngIf="isLoading">
        <div class="loading">Loading scripts</div>
      </ng-container>
      
      <ng-container *ngIf="!isLoading && scripts.length === 0">
        <div class="no-scripts">
          No {{ activeTab.toUpperCase() }} scripts loaded. Please select a directory.
        </div>
      </ng-container>
      
      <ng-container *ngIf="!isLoading && scripts.length > 0">
        <div 
          *ngFor="let script of scripts" 
          class="script-item"
          [class.open]="script.open"
        >
          <div class="script-header">
            <div class="checkbox-container">
              <input 
                type="checkbox" 
                class="script-checkbox" 
                [checked]="script.checked ?? true" 
                (change)="toggleSelection.emit(script.path)"
                (click)="$event.stopPropagation()"
              />
            </div>
            <div 
              class="script-name"
              (click)="toggleAccordion.emit(script.path)"
            >
              {{ getCleanScriptName(script.name) }}
            </div>
            <div 
              class="accordion-toggle"
              (click)="toggleAccordion.emit(script.path)"
            >
              ▼
            </div>
          </div>
          <div class="script-content">
            <div class="script-path">{{ script.path }}</div>
            <pre>{{ script.content || 'No preview available' }}</pre>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .script-list {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
      margin-bottom: 20px;
      max-height: 500px;
      overflow-y: auto;
    }
    
    .script-item {
      margin-bottom: 6px;
      border: 1px solid #eee;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .script-header {
      display: flex;
      align-items: center;
      padding: 7px 10px;
      background-color: #f9f9f9;
      cursor: pointer;
      min-height: 20px;
    }
    
    .script-name {
      flex: 1;
      font-weight: bold;
      font-size: 13px;
    }
    
    .accordion-toggle {
      margin-left: 10px;
      font-size: 11px;
      color: #666;
      transition: transform 0.3s;
    }
    
    .script-content {
      background-color: #f5f5f5;
      padding: 10px;
      border-top: 1px solid #eee;
      font-family: monospace;
      font-size: 12px;
      white-space: pre-wrap;
      color: #555;
      overflow: auto;
      max-height: 150px;
      display: none;
    }
    
    .script-item.open .accordion-toggle {
      transform: rotate(180deg);
    }
    
    .script-item.open .script-content {
      display: block;
    }
    
    .script-path {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
      font-family: monospace;
    }
    
    .checkbox-container {
      margin-right: 10px;
      display: flex;
      align-items: center;
      height: 100%;
    }
    
    .no-scripts {
      text-align: center;
      padding: 20px;
      color: #777;
    }
    
    .loading {
      text-align: center;
      padding: 20px;
      color: #777;
    }
    
    .loading:after {
      content: "...";
      animation: dots 1.5s steps(5, end) infinite;
    }
    
    @keyframes dots {
      0%, 20% { content: "."; }
      40% { content: ".."; }
      60%, 100% { content: "..."; }
    }
  `]
})
export class ScriptListComponent {
  @Input() scripts: ScriptData[] = [];
  @Input() isLoading: boolean = false;
  @Input() activeTab: TabType = 'api';
  @Output() toggleSelection = new EventEmitter<string>();
  @Output() toggleAccordion = new EventEmitter<string>();

  // Helper method to clean script names without using regex in the template
  getCleanScriptName(name: string): string {
    // Remove file extension (.ps1, .bat, .cmd, .sh)
    return name.replace(/\.(ps1|bat|cmd|sh)$/, '');
  }
}