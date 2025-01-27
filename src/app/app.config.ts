import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import Noir from '../themes/mypreset';
import { authInterceptor } from './auth.interceptor'; // Import the interceptor

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
   ],
};
