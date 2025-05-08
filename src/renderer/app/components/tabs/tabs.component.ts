import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScriptService } from '../../services/script.service';
import { TabType } from '../../models/script.model';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tabs">
      <div 
        class="tab" 
        [class.active]="scriptService.activeTab() === 'api'"
        (click)="scriptService.setActiveTab('api')"
      >
        API Scripts
      </div>
      <div 
        class="tab" 
        [class.active]="scriptService.activeTab() === 'ui'"
        (click)="scriptService.setActiveTab('ui')"
      >
        UI Scripts
      </div>
    </div>
  `,
  styles: [`
    .tabs {
      display: flex;
      border-bottom: 1px solid #ddd;
      margin-bottom: 20px;
    }
    
    .tab {
      padding: 10px 20px;
      cursor: pointer;
      border: 1px solid transparent;
      border-bottom: none;
      margin-right: 5px;
      border-radius: 5px 5px 0 0;
      background-color: #f5f5f5;
      transition: all 0.2s ease;
    }
    
    .tab:hover {
      background-color: #e9e9e9;
    }
    
    .tab.active {
      background-color: #0078d7;
      color: white;
      border-color: #0078d7;
    }
  `]
})
export class TabsComponent {
  constructor(public scriptService: ScriptService) {}
}