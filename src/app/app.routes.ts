import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
   {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full',
   },
   {
      path: '',
      component: LayoutComponent,
      children: [
         {
            path: 'home',
            loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
         },
         {
            path: 'about',
            loadComponent: () => import('./about/about.component').then(m => m.AboutComponent),
         },
      ],
   },
];
