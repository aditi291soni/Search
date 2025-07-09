import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import {
   FormBuilder,
   FormGroup,
   FormsModule,
   ReactiveFormsModule,
   Validators,
} from '@angular/forms';
import { environment } from '../../environments/environment';
import { MapGeocoder } from '@angular/google-maps';
import { ToastNotificationService } from '../services/toast-notification.service';
import { MatIconModule } from '@angular/material/icon';
import { TextareaModule } from 'primeng/textarea';
interface Location {
   person_name: string;
   person_phone_no: string;
   house_no: string;
   landmark: string;
   address_details: string;
}

@Component({
   selector: 'app-new-order',
   standalone: true,
   imports: [
      CommonModule,
      SkeletonModule,
      ButtonModule,
      ReactiveFormsModule,
      FormsModule,
      MatIconModule,
      TextareaModule,
   ],
   templateUrl: './new-order.component.html',
   styleUrls: ['./new-order.component.css'],
})
export class NewOrderComponent {
   vehicleTypeList: any[] = [];
   loading: boolean = true;
   loading_button: boolean = false;
   selectedVehicle: number | null = null;
   // pickupLocation: Location | null = JSON.parse(localStorage.getItem('pickupLocation') || 'null');
   // dropLocation: Location | null = JSON.parse(localStorage.getItem('dropLocation') || 'null');
   addressList: any[] = []; // List of available addresses for pickup/drop
   submitted = false;
   form: FormGroup;
   businessDetails: any;
   pickupLocation: any;
   dropLocation: any;
   newOrder: any;
   private distanceMatrixService: google.maps.DistanceMatrixService;
   distance: any;
   distanceResult: string = '';
   categories: string[] = [
      'Food',
      'Book',
      'Medicines',
      'Cake',
      'Documents',
      'Grocery',
      'Other',
   ];
   superAdminId: any;
   super_business: any;

   constructor(
      private cdr: ChangeDetectorRef,
      private apiService: ApiService,
      private router: Router,
      private fb: FormBuilder,
      private toastService: ToastNotificationService
   ) {
      this.distanceMatrixService = new google.maps.DistanceMatrixService();
      this.pickupLocation = this.apiService.getLocalValueInJSON(
         localStorage.getItem('selectedPickup')
      );
      this.dropLocation = this.apiService.getLocalValueInJSON(
         localStorage.getItem('selectedDrop')
      );
      this.businessDetails = this.apiService.getLocalValueInJSON(
         localStorage.getItem('bussinessDetails')
      );
      this.superAdminId = this.apiService.getLocalValueInJSON(
         localStorage.getItem('super_admin')
      );
      this.super_business = this.apiService.getLocalValueInJSON(
         localStorage.getItem('super_business')
      );

      this.newOrder = this.apiService.getLocalValueInJSON(
         localStorage.getItem('new-order')
      );
      this.form = this.fb.group({
         vehicle_type_id: ['', Validators.required],
         pickup_address: [
            this.pickupLocation ? this.pickupLocation.house_no : '',
            Validators.required,
         ],
         drop_address: [
            this.dropLocation ? this.dropLocation.house_no : '',
            Validators.required,
         ],
         instructions: [''],
         drop_longitude: [this.dropLocation?.long_val],
         drop_latitude: [this.dropLocation?.lat_val],
         pickup_latitude: [this.pickupLocation?.lat_val],
         pickup_longitude: [this.pickupLocation?.long_val],
         package_details: ['', Validators.required],
         status: ['1'],
         pickup_address_id: [
            this.pickupLocation ? this.pickupLocation.id : '',
            Validators.required,
         ],
         drop_address_id: [
            this.dropLocation ? this.dropLocation.id : '',
            Validators.required,
         ],
      });
   }

   ngOnInit(): void {
      this.fetchVehicleTypeList();
      if (this.newOrder) {
         this.form.patchValue({
            vehicle_type_id: this.newOrder?.vehicle_type_id,
            pickup_address: this.pickupLocation?.address_details,
            drop_address: this.dropLocation?.address_details,
            instructions: this.newOrder?.instructions,
            package_details: this.newOrder?.package_details,
         });
      }
      if (this.dropLocation) {
         localStorage.removeItem('savedAddressForm');
         localStorage.removeItem('selectedContact');
         this.cdr.detectChanges();
         this.form.patchValue({
            drop_address: this.dropLocation.address_details,
         });
      }
      if (this.pickupLocation) {
         localStorage.removeItem('savedAddressForm');
         localStorage.removeItem('selectedContact');
         this.cdr.detectChanges();
         this.form.patchValue({
            pickup_address: this.pickupLocation.address_details,
         });
      }
      if (this.newOrder.vehicle_type_id) {
         this.form.patchValue({
            vehicle_type_id: this.newOrder?.vehicle_type_id,
         });
         this.selectedVehicle = this.newOrder?.vehicle_type_id;
      }
   }

   fetchVehicleTypeList(): void {
      const superAdminId = this.superAdminId;
      console.log('Super admin id', superAdminId);

      this.apiService.getVehicleTypeList(superAdminId).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.vehicleTypeList = response.data || [];

               // if (!this.newOrder) {
               //    this.selectedVehicle = response.data[0].id;

               //    this.form.get('vehicle_type_id')?.setValue(response.data[0].id);

               // } else {
               this.selectedVehicle = this.newOrder.vehicle_type_id;

               this.form
                  .get('vehicle_type_id')
                  ?.setValue(this.newOrder.vehicle_type_id);
               // }
            } else {
               console.error('Error fetching vehicle types:', response.message);
            }
         },
         error: (err) => {
            console.error('Error fetching vehicle types:', err);
         },
         complete: () => {
            this.loading = false;
         },
      });
   }

   selectVehicle(vehicleId: number): void {
      this.selectedVehicle = vehicleId;
      this.form.get('vehicle_type_id')?.setValue(vehicleId);
      console.log(this.form.value, vehicleId);
      localStorage.setItem('new-order', JSON.stringify(this.form.value));
   }
   setParcel(category: string): void {
      this.form.get('package_details')?.setValue(category);
   }
   addDelivery() {
      if (!this.form.valid) {
         this.loading_button = false;
         // this.toastService.showError('Please fill in all required fields correctly.');
         // Show an error message for invalid form
         //   this.messageService.showError('Please fill in all required fields correctly.', 'Error');
         return; // Stop further execution
      }

      let payload = this.form.value;
      // if (this.businessDetails) {
      //    payload.business_id = this.businessDetails ? this.businessDetails.id : 488;
      // }
      payload.business_id = this.super_business;

      payload.pickup_person_name = this.pickupLocation.person_name;
      payload.drop_person_name = this.dropLocation.person_name;
      payload.pickup_phone_no = this.pickupLocation.person_phone_no;
      payload.drop_phone_no = this.dropLocation.person_phone_no;
      payload.delivery_staff_id = 0;
      payload.distance = this.distance;

      // payload.distance = this.twoWay();
      localStorage.setItem('new-order', JSON.stringify(payload));
      try {
         this.apiService.createDelivery(payload).subscribe({
            next: (data: any) => {
               if (data.status) {
                  this.router.navigate([
                     'orders/new-order/order-preview',
                     data?.data?.id,
                  ]);
                  localStorage.setItem(
                     'delivery_id',
                     JSON.stringify(data?.data?.id)
                  );
                  let ApiResponse: any = data;
               } else {
                  this.toastService.showError(data.msg);
                  this.loading_button = false;
               }
               //       this.delivery_id=data.data.id
               //       localStorage.setItem('delivery_id', JSON.stringify(this.delivery_id));
               //   if(data.status){
               //     if(data.status){
               //       this.isLoading=false}
               //     if(this.userId){
               //     console.log('1')
               //       this.router.navigate(['new-orders', this.userId?this.userId:this.userInfo.id,this.delivery_id ]);
               //     }else{
               //       console.log('2',this.delivery_id)
               //       this.router.navigate(['new-orders', this.delivery_id ]);
               //     }
               //   }else{
               //     this.messageService.showError(data.msg, 'Error')
               //   }
            },
            error: (error: any) => {
               console.log('Error fetching data', error);
               this.loading_button = false;
            },
         });
      } catch (error) {
         console.log('Error in the catch block', error);
         this.loading_button = false;
      }
   }

   navigateToPickupSelect(): void {
      this.router.navigate(['orders/new-order/select-pickup']);
   }

   navigateToDropSelect(): void {
      this.router.navigate(['orders/new-order/select-drop']);
   }

   saveAddressToLocalStorage(address: any): void {
      if (this.pickupLocation) {
         localStorage.setItem('selectedPickup', JSON.stringify(address));
         this.pickupLocation = address;
      } else if (this.dropLocation) {
         localStorage.setItem('selectedDrop', JSON.stringify(address));
         this.dropLocation = address;
      }
   }

   calculateDistanceNews(): void {
      // if (this.addresses.length !== 2) {
      //   alert("Please add exactly two addresses to calculate the distance.");
      //   return;
      // }
      this.submitted = true;
      if (!this.pickupLocation && !this.dropLocation) {
         this.loading_button = false;
         // this.toastService.showError('Please add exactly two addresses to calculate the distance.');
         // alert("Please add exactly two addresses to calculate the distance.");
         return;
      }
      this.loading_button = true;

      const origin = new google.maps.LatLng(
         this.pickupLocation?.lat_val,
         this.pickupLocation?.long_val
      );
      const destination = new google.maps.LatLng(
         this.dropLocation?.lat_val,
         this.dropLocation?.long_val
      );

      const service = new google.maps.DistanceMatrixService();

      service.getDistanceMatrix(
         {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
         },
         (response, status) => {
            console.log(response, status);
            if (status === google.maps.DistanceMatrixStatus.OK) {
               this.distance = response
                  ? response.rows[0].elements[0].distance.text
                  : 'N/A';
               const duration = response
                  ? response.rows[0].elements[0].duration.text
                  : 'N/A';

               this.distanceResult = `Distance: ${this.distance}, Duration: ${duration}`;
               console.log(this.distanceResult);
               this.addDelivery();
            } else {
               this.loading_button = false;
               console.error('Error calculating distance:', status);
               this.toastService.showError('Please Select the correct address');
               // alert("Error calculating the distance. Please try again.");
            }
         }
      );
   }
   createDelivery(): void {
      this.loading = true;
      let payload: any = this.form.value;
      if (this.businessDetails) {
         payload.business_id = this.businessDetails.id;
      }

      this.apiService.createDelivery(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.router.navigate(['orders/new-order/order-preview']);
               this.submitted = false;
            } else {
               console.error(
                  'Error fetching list of business:',
                  response.message
               );
               this.loading = false;
            }
         },
         error: (err) => {
            console.error('Error fetching list of business:', err);
            this.loading_button = false;
         },
         complete: () => {
            this.loading = false;
         },
      });
   }
   clearPickupAddress(): void {
      this.pickupLocation = null;
      localStorage.removeItem('selectedPickup');
      // this.form.get('pickupLocation')?.reset();
   }

   clearDropAddress(): void {
      this.dropLocation = null;
      localStorage.removeItem('selectedDrop');
      // this.form.get('dropLocation')?.reset();
   }
   addPickUpAddress(key: string) {
      console.log(key);
      this.router.navigate(['orders/new-order/add-address/', key]);
   }
   cancel() {
      this.clearDropAddress();
      this.clearPickupAddress();
      localStorage.removeItem('selectedPickup');
      localStorage.removeItem('selectedDrop');
      localStorage.removeItem('new-order');
      this.router.navigate(['/dashboard']);
   }
}
