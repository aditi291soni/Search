import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import Noir from '../themes/mypreset';
import { authInterceptor } from './auth.interceptor'; // Import the interceptor
import { MessageService } from 'primeng/api'; // Import MessageService
import { ToastModule } from 'primeng/toast';
import { provideServiceWorker } from '@angular/service-worker';  // Import ToastModule

export const appConfig: ApplicationConfig = {
   providers: [
      provideAnimationsAsync(),
      providePrimeNG({
         theme: {
            preset: Noir,
         },
      }),
      provideRouter(routes),
      provideHttpClient(withInterceptors([authInterceptor])), // Register the interceptor here
      MessageService, provideAnimationsAsync(), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),  // Provide MessageService globally
      // ToastModule,     // Ensure ToastModule is available globally
   ],
};
