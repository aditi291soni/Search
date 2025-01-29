import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../services/api.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
   selector: 'app-orders',
   imports: [CommonModule, ButtonModule, RouterModule, SkeletonModule],
   templateUrl: './orders.component.html',
   styleUrl: './orders.component.css',
   standalone: true
})
export class OrdersComponent {
   loading: boolean = false;
   userInfo: any;
   businessDetails: any;
   order: any;


   /**
    * Creates an instance of DashboardComponent.
    * @param {ApiService} apiService - The service to interact with the API.
    */
   constructor(private apiService: ApiService,private router: Router) {
      this.userInfo = this.apiService.getLocalValueInJSON(localStorage.getItem('userInfo'));
      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));

   }

   /**
    * Lifecycle hook that runs after the component is initialized.
    * Initiates fetching the business list and manages the loading state.
    */
   ngOnInit(): void {
      this.fetchOrderList();
   }

   /**
    * Fetches the list of businesses from the API and updates the component state.
    */
   fetchOrderList(): void {
      this.loading = true;
      let payload: any = {};
      payload.business_id = this.businessDetails.id;


      this.apiService.getOrderList(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.order = response.data;
            } else {
               console.error('Error fetching list of business:', response.message);
               this.loading = false;
            }
         },
         error: (err) => {
            console.error('Error fetching list of business:', err);
         },
         complete: () => {
            this.loading = false;
         },
      });
   }
   navigateToOrderDetails(orderId: any) {
      // localStorage.setItem('orderDetails', JSON.stringify(orderId));
      this.router.navigate(['/orders/order-view/', orderId]);
   }
}
