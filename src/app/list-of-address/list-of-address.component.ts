import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
   selector: 'app-list-of-address',
   standalone: true,
 
   providers: [ConfirmationService, MessageService],
   imports: [CommonModule, SkeletonModule, ButtonModule, ConfirmDialog, ToastModule],
   templateUrl: './list-of-address.component.html',
   styleUrl: './list-of-address.component.css'
})
export class ListOfAddressComponent {




   addressList: any[] = []; // The variable to store the address list
   loading: boolean = true; // Indicates whether data is currently loading
   searchQuery: any;
   displayDialog: boolean = false;
   addressToDeleteIndex: number | null = null;
   businessDetails: any;
   addressLists: any[] = [];
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
      private messageService: MessageService,
      private cdr: ChangeDetectorRef,
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
   filterAddress(): void {
      if (this.searchQuery.trim()) {
         this.addressLists = this.addressList.filter(item =>
            Object.values(item).some(value =>
               value && value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
            )
         );
         console.log('Filtered Orders:', this.addressList);  // Log filtered orders for debugging
      }
      else {
         this.addressLists = [...this.addressList];
         // this.addressLists = this.addressList
         // console.log('Filtered', this.addressList);
      }
   }
   /**
    * Fetches the address list from the API and populates the addressList array.
    * If a business ID is not found in localStorage, logs an error and stops loading.
    */
   navigateToEdit(id:any){
      this.router.navigate(['edit-address/', id]);
   }
   fetchAddressList(): void {
      const business = localStorage.getItem('bussinessDetails');
      const user = localStorage.getItem('userData');
      const businessId = business ? JSON.parse(business).id : 0;
      const user_id = user ? JSON.parse(user).id : 0;
      const page=1;
      const per_page=5000
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
payload.page=1
payload.per_page=5000

      this.apiService.getAddressList(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.addressList = response.data;
               this.addressList.sort((a, b) => {
                  const nameA = a.person_name ? a.person_name.toLowerCase() : '';
                  const nameB = b.person_name ? b.person_name.toLowerCase() : '';
                  return nameA.localeCompare(nameB);
               });

               console.log(this.addressList);
               this.addressLists = [...this.addressList];
               this.cdr.detectChanges();
               this.loading = false
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

   confirm2(event: Event, addressId: number) {

      console.log(event)
      this.confirmationService.confirm({
         target: event.target as EventTarget,
         message: 'Do you want to delete this record?',
         header: ' ',
         icon: 'pi pi-info-circle',
         closable: false,
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
            this.loading = true
            console.log(event.target)
            this.deleteAddress(addressId)

            // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
         },
         reject: () => {
            this.loading = false
            this.confirmationService.close();
         },
      });
   }
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

   sortAddressList() {
      this.addressList.sort((a, b) => a.person_name.toLowerCase().localeCompare(b.person_name.toLowerCase()));
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
         this.router.navigate(['orders/new-order/add-address/', 'drops']);
         console.error('Unknown route, no address saved');
      }


      // this.router.navigate(['orders/new-order/add-address/',key]);

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

      this.apiService.delete_address({ address_id: id, business_id: this.businessDetails ? this.businessDetails.id : 0 }).subscribe(
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

}

