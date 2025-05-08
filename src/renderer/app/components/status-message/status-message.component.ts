import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusMessage } from '../../models/script.model';

@Component({
  selector: 'app-status-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="message" 
      class="status-message {{ message.type }}"
    >
      {{ message.text }}
    </div>
  `,
  styles: [`
    .status-message {
      margin-top: 20px;
      padding: 10px;
      border-radius: 5px;
    }
  `]
})
export class StatusMessageComponent {
  @Input() message: StatusMessage | null = null;
}