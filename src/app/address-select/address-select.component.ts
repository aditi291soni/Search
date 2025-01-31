import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';

/**
 * Component to select an address from a list and save it to localStorage.
 */
@Component({
   selector: 'app-address-select',
   standalone: true,
   imports: [CommonModule, SkeletonModule,ButtonModule],
   templateUrl: './address-select.component.html',
   styleUrls: ['./address-select.component.css'],
})
export class AddressSelectComponent {
   addressList: any[] = []; // The variable to store the address list
   loading: boolean = true; // Indicates whether data is currently loading

   /**
    * Constructor to inject the necessary services.
    * 
    * @param {ApiService} apiService - The API service to fetch the address list.
    * @param {ActivatedRoute} activatedRoute - The route that is currently active.
    * @param {Router} router - The router to access the current URL for routing logic.
    */
   constructor(
      private apiService: ApiService,
      private activatedRoute: ActivatedRoute,
      private router: Router
   ) { 


      
   }

   /**
    * Lifecycle hook that runs on component initialization.
    * Calls the method to fetch the address list from the API.
    */
   ngOnInit(): void {
      this.fetchAddressList();
   }

   /**
    * Fetches the address list from the API and populates the addressList array.
    * If a business ID is not found in localStorage, logs an error and stops loading.
    */
   fetchAddressList(): void {
      const business = localStorage.getItem('bussinessDetails');
      const businessId = business ? JSON.parse(business).id : null;

      if (!businessId) {
         console.error('Business ID not found in localStorage');
         this.loading = false;
         return;
      }

      this.apiService.getAddressList(businessId).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.addressList = response.data || [];
            } else {
               console.error('Error fetching list of business:', response.message);
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

   /**
    * Saves the selected address to localStorage based on the current route.
    * If the current route is "select-pickup", saves the address as 'selectedPickup',
    * otherwise, if the route is "select-drop", saves the address as 'selectedDrop'.
    * 
    * @param {any} address - The selected address to be saved to localStorage.
    */
   saveAddressToLocalStorage(address: any): void {
      const currentRoute = this.router.url;

      console.log('address', currentRoute, address);


      // Check the current route and save the address accordingly
      if (currentRoute.includes('select-pickup')) {
         localStorage.setItem('selectedPickup', JSON.stringify(address));
      } else if (currentRoute.includes('select-drop')) {
         localStorage.setItem('selectedDrop', JSON.stringify(address));
      } else {
         console.error('Unknown route, no address saved');
      }

      // Navigate back to the previous route
      this.router.navigateByUrl(this.router.url).then(() => {
         window.history.back();
      });
   }
   addPickUpAddress(){
      
         const currentRoute = this.router.url;
   
         
   
   
         // Check the current route and save the address accordingly
         if (currentRoute.includes('select-pickup')) {
            this.router.navigate(['orders/new-order/add-address/','pickup']);
         } else if (currentRoute.includes('select-drop')) {
            this.router.navigate(['orders/new-order/add-address/','drop']);
         } else {
            console.error('Unknown route, no address saved');
         }
   
       
         // this.router.navigate(['orders/new-order/add-address/',key]);
        
       }
}
