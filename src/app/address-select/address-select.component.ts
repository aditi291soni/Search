import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
   selector: 'app-address-select',
   imports: [CommonModule],
   templateUrl: './address-select.component.html',
   styleUrl: './address-select.component.css'
})
export class AddressSelectComponent {
   addressList: any[] = []; // The variable to store the address list
   loading: boolean = true; // Indicates whether data is currently loading

   /**
       * Creates an instance of NewOrderComponent.
       * @param {ApiService} apiService - The service to interact with the API.
       */
   constructor(private apiService: ApiService) { }

   ngOnInit(): void {
      this.fetchAddressList();
   }

   /**
       * Fetches the list of addresses for a specific business using its ID from localStorage.
       */
   fetchAddressList(): void {
      const business = localStorage.getItem('defaultBusiness');
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
}
