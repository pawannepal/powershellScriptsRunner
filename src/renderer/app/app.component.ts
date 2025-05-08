import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScriptService } from './services/script.service';
import { ScriptListComponent } from './components/script-list/script-list.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { DirectorySelectorComponent } from './components/directory-selector/directory-selector.component';
import { ActionsBarComponent } from './components/actions-bar/actions-bar.component';
import { StatusMessageComponent } from './components/status-message/status-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScriptListComponent,
    TabsComponent,
    DirectorySelectorComponent,
    ActionsBarComponent,
    StatusMessageComponent
  ],
  template: `
    <div class="container">
      <h1>PowerShell Script Launcher</h1>
      
      <app-tabs></app-tabs>
      
      <app-directory-selector 
        [currentDirectory]="scriptService.currentDirectory()" 
        [baseDirectory]="scriptService.baseDirectory()"
        (selectScriptDir)="scriptService.selectDirectory()"
        (selectBaseDir)="scriptService.selectBaseDirectory()"
      ></app-directory-selector>
      
      <app-actions-bar
        (selectAll)="scriptService.selectAll()"
        (deselectAll)="scriptService.deselectAll()"
        (refresh)="scriptService.refreshDirectory()"
        (filterChange)="scriptService.setFilterText($event)"
        [filterText]="scriptService.filterText()"
      ></app-actions-bar>
      
      <app-script-list
        [isLoading]="scriptService.isLoading()"
        [scripts]="scriptService.filteredScripts()"
        [activeTab]="scriptService.activeTab()"
        (toggleSelection)="scriptService.toggleScriptSelection($event)"
        (toggleAccordion)="scriptService.toggleAccordion($event)"
      ></app-script-list>
      
      <div class="button-container">
        <button 
          (click)="scriptService.startSelectedScripts()"
          [disabled]="!scriptService.currentDirectory() || scriptService.currentScripts().length === 0"
        >
          Start Selected {{ scriptService.activeTab().toUpperCase() }} Scripts
        </button>
      </div>
      
      <app-status-message
        [message]="scriptService.statusMessage()"
      ></app-status-message>
    </div>
  `,
  styles: [`
    .button-container {
      text-align: center;
      margin-top: 20px;
    }
    
    .button-container button {
      background-color: #4CAF50;
      padding: 10px 20px;
      font-size: 16px;
    }
    
    .button-container button:hover {
      background-color: #45a049;
    }
  `]
})
export class AppComponent {
  constructor(public scriptService: ScriptService) {}
}