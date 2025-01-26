import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
   {
      path: '',
      redirectTo: '/dashboard',
      pathMatch: 'full',
   },
   {
      path: '',
      component: LayoutComponent,
      children: [
         {
            path: 'dashboard',
            loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
         },
         {
            path: 'orders',
            loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent),
         },
         {
            path: 'customers',
            loadComponent: () => import('./customers/customers.component').then(m => m.CustomersComponent),
         },
         {
            path: 'transactions',
            loadComponent: () => import('./transactions/transactions.component').then(m => m.TransactionsComponent),
         },
         {
            path: 'settings',
            loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
         },
      ],
   },
];
