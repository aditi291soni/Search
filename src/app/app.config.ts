import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router'; // Import provideRouter
import { routes } from './app.routes'; // Import your routes
import Noir from '../themes/mypreset';

export const appConfig: ApplicationConfig = {
   providers: [
      provideAnimationsAsync(),
      providePrimeNG({
         theme: {
            preset: Noir
         }
      }),
      provideRouter(routes), // Add provideRouter with your routes configuration
   ]
};
