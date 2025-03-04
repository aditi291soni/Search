import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { NoDataFoundComponent } from '../no-data-found/no-data-found.component';
import { CorouselComponent } from '../corousel/corousel.component';
import { environment } from '../../environments/environment';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [CommonModule, ButtonModule, RouterModule, SkeletonModule, NoDataFoundComponent],
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
   /**
    * List of businesses fetched from the API.
    * @type {any[]}
    */
   business: any[] = [];

   /**
    * Indicates whether data is currently loading.
    * @type {boolean}
    */
   loading: boolean = false;
   userInfo: any;
   businessDetails: any;
   order: any[] = [];
   orderstatus: any[] = [];

   /**
    * Creates an instance of DashboardComponent.
    * @param {ApiService} apiService - The service to interact with the API.
    */
   constructor(private apiService: ApiService, private router: Router, private cdr: ChangeDetectorRef,) {
      this.userInfo = this.apiService.getLocalValueInJSON(localStorage.getItem('userData'));
      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      this.orderstatus = this.apiService.getLocalValueInJSON(localStorage.getItem('order-status'));
      // this.orderStatus = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
   }

   /**
    * Lifecycle hook that runs after the component is initialized.
    * Initiates fetching the business list and manages the loading state.
    */
   ngOnInit(): void {

      this.fetchOrderList();
      this.getOrderStatus();
      this.clearLocal();
      this.cdr.detectChanges();




      // this.fetchOrderList();

      // this.getOrderStatus()
      // this.clearLocal()
      // this.cdr.detectChanges();
   }

   /**
    * Fetches the list of businesses from the API and updates the component state.
    */
   fetchOrderList(): void {
      this.loading = true;
      let payload: any = {};
      payload.business_id = 983;
      if (this.businessDetails && this.businessDetails.id) {
         payload.for_business_id = this.businessDetails.id
      } else {
         payload.for_user_id = this.userInfo.id
      }
      // payload.for_business_id = 161;
      // payload.per_page = 3
      payload.page = 1

      this.apiService.getOrderDelivery(payload).subscribe({
         next: (response) => {
            if (response.status == true) {
               // this.order = response.data;
               this.cdr.detectChanges();



               // Ensure orders have order_status.id matched correctly
               this.order = response.data
                  .filter((order: any) => order.order_no && order.order_status_id !== 35)
                  .slice(0, 3)
                  .map((order: any) => ({
                     ...order,
                     status_name: this.getDynamicStatusName(order?.order_status_id)
                  }));
               this.cdr.detectChanges();
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
   clearLocal() {
      localStorage.removeItem('selectedPickup');
      localStorage.removeItem('selectedDrop');
      localStorage.removeItem('new-order');
   }

   getOrderStatus(): void {
      let payload = {
         super_admin_id: environment.superAdminId,
      };

      this.apiService.getOrderStatus(payload).subscribe({
         next: (response) => {
            if (response.status == true) {
               this.orderstatus = response.data;
               localStorage.setItem('order-status', JSON.stringify(this.orderstatus));
               this.cdr.detectChanges();
            } else {
               console.error('Error fetching order status:', response.message);
            }
         },
         error: (err) => console.error('Error fetching order status:', err),
         complete: () => (this.loading = false),
      });
   }
   getDynamicStatusName(statusId: number): string {
      const status = this.orderstatus.find(s => s.id == statusId);
      console.log("kk", statusId, status)
      this.cdr.detectChanges();
      return status ? status.name_for_user : "N/A"; // Return status name if found, else 'Unknown'
   }
}
