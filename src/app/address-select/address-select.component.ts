import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

/**
 * Component to select an address from a list and save it to localStorage.
 */
@Component({
   selector: 'app-address-select',
   standalone: true,
   imports: [CommonModule, SkeletonModule, ButtonModule, ConfirmDialog, ToastModule],
   providers: [ConfirmationService, MessageService],
   templateUrl: './address-select.component.html',
   styleUrls: ['./address-select.component.css'],
})
export class AddressSelectComponent {
   addressList: any[] = []; // The variable to store the address list
   addressLists: any[] = [];
   loading: boolean = true; // Indicates whether data is currently loading
   searchQuery: any;
   displayDialog: boolean = false;
   addressToDeleteIndex: number | null = null;
   businessDetails: any;
   userData: any;
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
      private router: Router,
      private confirmationService: ConfirmationService,
      private messageService: MessageService
   ) {

      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      this.userData = this.apiService.getLocalValueInJSON(localStorage.getItem('userData'));

   }

   /**
    * Lifecycle hook that runs on component initialization.
    * Calls the method to fetch the address list from the API.
    */
   ngOnInit(): void {
      this.fetchAddressList();
      this.sortAddressList();
      this.activatedRoute.queryParams.subscribe(params => {
         this.searchQuery = params['search'] || '';  // Default to empty string if no 'search' param is found
         console.log('Search Query:', this.searchQuery);  // Log search query for debugging
         this.filterAddress();  // Trigger the filter after the search query is updated
      });
   }
   confirm2(event: Event, addressId: number) {

      console.log("ll", event)
      this.confirmationService.confirm({
         target: event.target as EventTarget,
         message: 'Do you want to delete this record?',
         header: ' ',
         icon: 'pi pi-info-circle',
         rejectLabel: 'Cancel',
         rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
         },
         acceptButtonProps: {
            label: 'Delete',
            severity: 'danger',
         },

         accept: () => {
            console.log(event.target)
            this.deleteAddress(addressId)

            // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
         },
         reject: () => {
            this.confirmationService.close();
         },
      });
   }
   openDeleteConfirmation(index: number) {
      // Store the index of the address to be deleted
      this.addressToDeleteIndex = index;
      this.displayDialog = true;
   }

   cancelDelete() {
      // Close the confirmation dialog
      this.displayDialog = false;
   }


   deleteAddress(id: any) {
      // if (this.addressToDeleteIndex !== null) {
      // Call the delete API

      this.apiService.delete_address({ address_id: id, business_id: this.businessDetails.id }).subscribe(
         (response) => {
            console.log('Address deleted successfully:', response);
            // Close the dialog and update the UI if necessary
            this.displayDialog = false;
            this.confirmationService.close();
            this.fetchAddressList();
            this.sortAddressList();
         },
         (error) => {
            console.error('Error deleting address:', error);
         }
      );
      // }
   }
   removeAddress(index: number) {
      this.addressList.splice(index, 1);
   }
   filterAddress(): void {
      if (this.searchQuery.trim()) {
         this.addressLists = this.addressList.filter(item =>
            Object.values(item).some(value =>
               value && value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
            )
         );
         console.log('Filtered Orders:', this.addressList);  // Log filtered orders for debugging
      } else {
         this.addressLists = [...this.addressList];
      }
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

      }
      let payload: any = {}
      if (this.businessDetails) {
         payload.business_id = this.businessDetails ? this.businessDetails.id : 0;
      } else {
         payload.user_id = this.userData ? this.userData.id : 0;
      }
      payload.page=1;
      payload.per_page=1000
      this.apiService.getAddressList(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.addressList = response.data || [];
               this.addressList.sort((a, b) => {
                  const nameA = a.person_name ? a.person_name.toLowerCase() : '';
                  const nameB = b.person_name ? b.person_name.toLowerCase() : '';
                  return nameA.localeCompare(nameB);
               });

               console.log(this.addressList);
               this.addressLists = [...this.addressList];

               // localStorage.setItem('address', JSON.stringify(this.addressList));
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
         this.router.navigate(['orders/new-order']);
      } else if (currentRoute.includes('select-drop')) {
         localStorage.setItem('selectedDrop', JSON.stringify(address));
         this.router.navigate(['orders/new-order']);
      } else {
         console.error('Unknown route, no address saved');
      }
   
      // Navigate back to the previous route
      // this.router.navigateByUrl(this.router.url).then(() => {
      //    window.history.back();
      // });
   }

   sortAddressList() {
      this.addressLists.sort((a, b) => a.person_name.toLowerCase().localeCompare(b.person_name.toLowerCase()));
      console.log(this.addressList)
   }
   addPickUpAddress() {

      const currentRoute = this.router.url;




      // Check the current route and save the address accordingly
      if (currentRoute.includes('select-pickup')) {
         this.router.navigate(['orders/new-order/add-address/', 'pickup']);
      } else if (currentRoute.includes('select-drop')) {
         this.router.navigate(['orders/new-order/add-address/', 'drop']);
      } else {
         console.error('Unknown route, no address saved');
      }


      // this.router.navigate(['orders/new-order/add-address/',key]);

   }
}
