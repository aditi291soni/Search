import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
   {
      path: '',
      redirectTo: '/dashboard',
      pathMatch: 'full',

   },
   {
      path: '',
      component: LayoutComponent,
      canActivate: [authGuard],

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
         {
            path: 'support',
            loadComponent: () => import('../support/support.component').then(m => m.SupportComponent),
         },
         {
            path: 'customers/new-customer',
            loadComponent: () => import('./new-customer/new-customer.component').then(m => m.NewCustomerComponent),
         },
         {
            path: 'orders/new-order',
            loadComponent: () => import('./new-order/new-order.component').then(m => m.NewOrderComponent),
         },
         {
            path: 'orders/new-order/select-pickup',
            loadComponent: () => import('./address-select/address-select.component').then(m => m.AddressSelectComponent),
         },
         {
            path: 'address/list-of-address',
            loadComponent: () => import('./list-of-address/list-of-address.component').then(m => m.ListOfAddressComponent),
         },
         {
            path: 'orders/new-order/select-drop',
            loadComponent: () => import('./address-select/address-select.component').then(m => m.AddressSelectComponent),
         },
         {
            path: 'orders/new-order/order-preview/:delivery_id',
            loadComponent: () => import('./address-preview/address-preview.component').then(m => m.AddressPreviewComponent),
         },
         {
            path: 'add-business',
            loadComponent: () => import('./add-business/add-business.component').then(m => m.AddBusinessComponent),
         },
         {
            path: 'edit-business',
            loadComponent: () => import('./add-business/add-business.component').then(m => m.AddBusinessComponent),
         },
         {
            path: 'wallet',
            loadComponent: () => import('./wallet-transaction/wallet-transaction.component').then(m => m.WalletTransactionComponent),
         },
         {
            path: 'edit-business/:id',
            loadComponent: () => import('./add-business/add-business.component').then(m => m.AddBusinessComponent),
         },
         {
            path: 'edit-address/:id',
            loadComponent: () => import('./edit-address/edit-address.component').then(m => m.EditAddressComponent),
         },
         {
            path: 'list-of-business',
            loadComponent: () => import('./business-list/business-list.component').then(m => m.BusinessListComponent),
         },
         {
            path: 'list-of-coupan',
            loadComponent: () => import('./list-of-coupan/list-of-coupan.component').then(m => m.ListOfCoupanComponent),
         },
         {
            path: 'orders/order-view/:invoice_id',
            loadComponent: () => import('./order-view/order-view.component').then(m => m.OrderViewComponent),
         },
         {
            path: 'orders/new-order/add-address/:type',
            loadComponent: () => import('./add-address/add-address.component').then(m => m.AddAddressComponent),
         },

      ],
   },
   {
      path: 'auth',
      component: AuthLayoutComponent,
      children: [
         {
            path: 'sign-in',
            loadComponent: () => import('./signin/signin.component').then(m => m.SigninComponent),
         },
         {
            path: 'sign-up',
            loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent),
         },
         {
            path: '**',
            loadComponent: () => import('./signin/signin.component').then(m => m.SigninComponent),
         },
      ]
   }
];
