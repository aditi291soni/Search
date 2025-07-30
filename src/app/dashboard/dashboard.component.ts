import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { NoDataFoundComponent } from '../no-data-found/no-data-found.component';
import { CorouselComponent } from '../corousel/corousel.component';
import { environment } from '../../environments/environment';
import { CarouselModule } from 'primeng/carousel';
import { TokenService } from '../services/token.service';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [CommonModule, ButtonModule, RouterModule, SkeletonModule, NoDataFoundComponent, CarouselModule],
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
   /**
    * List of businesses fetched from the API.
    * @type {any[]}
    */
   business: any[] = [];
   responsiveOptions = [
      {
         breakpoint: '1024px',
         numVisible: 1,
         numScroll: 1
      },
      {
         breakpoint: '768px',
         numVisible: 1,
         numScroll: 1
      },
      {
         breakpoint: '560px',
         numVisible: 1,
         numScroll: 1
      }
   ];
   /**
    * Indicates whether data is currently loading.
    * @type {boolean}
    */
   loading: boolean = false;
   userInfo: any;
   businessDetails: any;
   order: any[] = [];
   orderstatus: any[] = [];
   orderComplete: any;
   listofBanner: any;
   superAdminId: any;
   super_business: any;

   /**
    * Creates an instance of DashboardComponent.
    * @param {ApiService} apiService - The service to interact with the API.
    */
   constructor(private apiService: ApiService, private router: Router, private cdr: ChangeDetectorRef,private tokenService :TokenService) {
      this.userInfo = this.apiService.getLocalValueInJSON(localStorage.getItem('userData'));
      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      this.superAdminId = this.apiService.getLocalValueInJSON(localStorage.getItem('super_admin'));
      this.super_business= this.apiService.getLocalValueInJSON(localStorage.getItem('super_business'));

      this.orderstatus = this.apiService.getLocalValueInJSON(localStorage.getItem('order-status'));
      this.orderComplete = this.apiService.getLocalValueInJSON(localStorage.getItem('orderComplete'));
   }

   /**
    * Lifecycle hook that runs after the component is initialized.
    * Initiates fetching the business list and manages the loading state.
    */
   ngOnInit(): void {

      this.fetchOrderList();
      this.getOrderStatus();
      this.getlistofBanner()
      // this.refreshToken()
      this.clearLocal();
      // this.tryTokenRefreshOnAppLoad();
      this.cdr.detectChanges();
      this.cdr.detectChanges();

      // localStorage.setItem('contact', JSON.stringify([
      //    {
      //      "displayName": "Aditi Soni",
      //      "phoneNumbers": ["9998887771"]
      //    },
      //    {
      //      "displayName": "Rohan Mehra",
      //      "phoneNumbers": ["9123456789", "9012345678"]
      //    },
      //    {
      //      "displayName": "Sneha Kapoor",
      //      "phoneNumbers": ["9988776655"]
      //    },
      //    {
      //      "displayName": "Arjun Sharma",
      //      "phoneNumbers": ["9876543210"]
      //    },
      //    {
      //      "displayName": "Neha Gupta",
      //      "phoneNumbers": ["9765432109"]
      //    }
      //  ]));



      // this.fetchOrderList();

      // this.getOrderStatus()
      // this.clearLocal()
      // this.cdr.detectChanges();
   }
   // refreshToken() {
   //    this.loading = true
   //    try {
   //       this.apiService.refresh_token().subscribe({
   //          next: (data: any) => {
   //             if (data.status) {
   //                let ApiResponse: any = data;
   //                console.log(data?.data.token)
   //                localStorage.setItem('authToken', data?.data.token);
   //             }

   //          },
   //          error: (error: any) => {

   //             console.log('Error fetching data', error);
   //          }
   //       });
   //    } catch (error) {
   //       console.log('Error in the catch block', error);
   //    }
   // }
   getlistofBanner() {
      this.loading = true
      try {
         this.apiService.list_of_banner({ super_admin_id:  this.superAdminId }).subscribe({
            next: (data: any) => {
               if (data.status) {
                  let ApiResponse: any = data;
                  // this.listofBanner = ApiResponse.data;

                  this.listofBanner = ApiResponse.data
                     // .filter((banner: any) =>

                     //    banner.super_admin_id == this.superAdminId  && banner.plat_from == 'vendor-app'
                     // )
                     // .map((banner: any) => banner.image + '?tr=w-300,h-120');
                     .map((banner: any) => ({
                        image: banner.image + '?tr=w-300,h-120',
                        link: banner.link_url  // Make sure `banner.link` exists in the response
                      }));
                  console.log("banner", this.listofBanner)


               } else {

                  this.loading = false
               }

            },
            error: (error: any) => {

               console.log('Error fetching data', error);
            }
         });
      } catch (error) {
         console.log('Error in the catch block', error);
      }
   }
   // tryTokenRefreshOnAppLoad() {
   //    const token = localStorage.getItem('authToken');
   //    const refreshToken = localStorage.getItem('refreshToken');

   //    if (token ) {
   //      this.apiService.refresh_token().subscribe({
   //        next: (data) => {
   //          console.log("token",data.data.token)
   //          localStorage.setItem('authToken', data.data?.token);
   //          localStorage.setItem('refreshToken', data.data?.token);
   //          this.tokenService.setToken(data.data.token);
   //          console.log('Token refreshed on app load',data.data.token);
   //          this.ngOnInit()
   //        },
   //        error: (err) => {
   //          console.warn('Failed to refresh token on app load', err);
   //          if(localStorage){
   //             localStorage.clear();
   //                     sessionStorage.clear();
   //                     }

   //                     this.router.navigate(['/auth/sign-in']);
   //          // Optionally logout
   //        }
   //      });}}
   editDeliveries(data: any) {
      console.log("data", data)


      let payload = {

         business_id: data.business_id,
         status: data.status,
         order_delivery_details_id: data.id,
         master_order_status_id: 10, // Update only order_status_id
      };
      try {
         this.apiService.edit_order_delivery_details(payload).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;
               localStorage.setItem('orderComplete', 'true');


            },
            error: (error: any) => {
               console.log('Error fetching data', error);

               this.cdr.detectChanges();
            }
         });
      } catch (error) {
         console.log('Error in the catch block', error);
      }
   }
   /**
    * Fetches the list of businesses from the API and updates the component state.
    */

   fetchOrderList(): void {

      this.loading = true;
      let payload: any = {};
      payload.business_id =  this.super_business;
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

                  .filter((order: any) => order.order_no && order.master_order_status_id !== 21)
                  .slice(0, 3)
                  .map((order: any) => ({
                     ...order,
                     status_name: this.getDynamicStatusName(order?.master_order_status_id)
                  }));
               // if (!this.orderComplete) {
               //    this.editDeliveries(this.order[0]


               //    )
               // }
               this.cdr.detectChanges();
            } else {

               console.error('Error fetching list of business:', response.message);
               this.loading = false;
            }
         },
         error: (err) => {
            console.log("e",err)
            if(err =='Error: Token invalid.'){
               console.log("e")
               // this.tryTokenRefreshOnAppLoad()
            }
            // console.error('Error fetching list of business:', err);
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
         super_admin_id: this.superAdminId ,
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
   navigateTo(link: string): void {
      if (link && link.startsWith('http')) {
         window.open(link, '_blank'); // Open external URL in new tab
       } else {
         console.warn('Invalid or missing URL:', link);
       }
    }
   getDynamicStatusName(statusId: number): string {
      const status = this.orderstatus.find(s => s.id == statusId);
      console.log("kk", statusId, status)
      this.cdr.detectChanges();
      return status ? status.order_status_name : "N/A"; // Return status name if found, else 'Unknown'
   }
}
