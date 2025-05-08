import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actions-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="actions-section">
      <div class="select-actions">
        <button (click)="selectAll.emit()">Select All</button>
        <button (click)="deselectAll.emit()">Deselect All</button>
        <button (click)="refresh.emit()">Refresh</button>
      </div>
      <div class="filter-section">
        <input 
          type="text" 
          placeholder="Filter scripts..." 
          [ngModel]="filterText"
          (ngModelChange)="filterChange.emit($event)"
        />
      </div>
    </div>
  `,
  styles: [`
    .actions-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    
    .select-actions {
      display: flex;
      gap: 10px;
    }
    
    .filter-section {
      display: flex;
      align-items: center;
    }
    
    input[type="text"] {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 200px;
    }
  `]
})
export class ActionsBarComponent {
  @Input() filterText: string = '';
  @Output() selectAll = new EventEmitter<void>();
  @Output() deselectAll = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  @Output() filterChange = new EventEmitter<string>();
}