import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../services/api.service';
import { SkeletonModule } from 'primeng/skeleton';
import { NoDataFoundComponent } from '../no-data-found/no-data-found.component';

@Component({
   selector: 'app-orders',
   imports: [CommonModule, ButtonModule, RouterModule, SkeletonModule, NoDataFoundComponent],
   templateUrl: './orders.component.html',
   styleUrl: './orders.component.css',
   standalone: true
})
export class OrdersComponent {
   loading: boolean = false;
   userInfo: any;
   businessDetails: any;
   order: any[] = [];
   searchQuery: any;


   /**
    * Creates an instance of DashboardComponent.
    * @param {ApiService} apiService - The service to interact with the API.
    */
   constructor(private apiService: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private cdRef: ChangeDetectorRef

   ) {
      this.userInfo = this.apiService.getLocalValueInJSON(localStorage.getItem('userInfo'));
      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));

   }

   /**
    * Lifecycle hook that runs after the component is initialized.
    * Initiates fetching the business list and manages the loading state.
    */
   ngOnInit(): void {
      this.fetchOrderList();
      this.activatedRoute.queryParams.subscribe(params => {
         this.searchQuery = params['search'] || '';  // Default to empty string if no 'search' param is found
         console.log('Search Query:', this.searchQuery);  // Log search query for debugging
         this.filterOrders();  // Trigger the filter after the search query is updated
      });

   }
   ngOnChange() {
      this.activatedRoute.queryParams.subscribe(params => {
         this.searchQuery = params['search'] || ''; // Default to empty string if 'search' param is not found
      });
      console.log('order', this.searchQuery)
      this.filterOrders();
   }
   filterOrders(): void {
      if (this.searchQuery.trim()) {
         this.order = this.order.filter(item =>
            Object.values(item).some(value =>
               value && value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
            )
         );
         console.log('Filtered Orders:', this.order);  // Log filtered orders for debugging
      }
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

               // localStorage.setItem('order', JSON.stringify(this.order));

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
