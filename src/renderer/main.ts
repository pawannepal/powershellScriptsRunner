import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '../renderer/app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';

// Bootstrap the Angular application
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations()
  ]
}).catch(err => console.error(err));