import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { MapGeocoder } from '@angular/google-maps';
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
   imports: [CommonModule, SkeletonModule, ButtonModule, ReactiveFormsModule, FormsModule],
   templateUrl: './new-order.component.html',
   styleUrls: ['./new-order.component.css'],
})
export class NewOrderComponent {
   vehicleTypeList: any[] = [];
   loading: boolean = true;
   selectedVehicle: number | null = null;
   // pickupLocation: Location | null = JSON.parse(localStorage.getItem('pickupLocation') || 'null');
   // dropLocation: Location | null = JSON.parse(localStorage.getItem('dropLocation') || 'null');
   addressList: any[] = []; // List of available addresses for pickup/drop

   form: FormGroup;
   businessDetails: any;
   pickupLocation: any;
   dropLocation: any;
   newOrder: any;
   private distanceMatrixService: google.maps.DistanceMatrixService
   distance: any;
   distanceResult: string='';
   constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder,) {
      this.distanceMatrixService = new google.maps.DistanceMatrixService();
      this.pickupLocation= this.apiService.getLocalValueInJSON(localStorage.getItem('selectedPickup'));
      this.dropLocation= this.apiService.getLocalValueInJSON(localStorage.getItem('selectedDrop'));
      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      this.newOrder = this.apiService.getLocalValueInJSON(localStorage.getItem('new-order'));
      this.form = this.fb.group({
         vehicleType: ['', Validators.required],
         pickupLocation: [this.pickupLocation ? this.pickupLocation.house_no : '', Validators.required],
         dropLocation: [this.dropLocation ? this.dropLocation.house_no : '', Validators.required],
         parcelWeight: [''],
         parcelDescription: [''],
         pickup_address_id:[this.pickupLocation ? this.pickupLocation.id : '', Validators.required],
         drop_address_id: [this.dropLocation ? this.dropLocation.id : '', Validators.required],
      });
   }

   ngOnInit(): void {
      this.fetchVehicleTypeList();
      if (this.newOrder) {
         this.form.patchValue({
            vehicleType: this.newOrder.vehicleType,
            pickupLocation: this.pickupLocation.address_details ,
            dropLocation: this.dropLocation.address_details ,
            parcelWeight: this.newOrder.parcelWeight ,
            parcelDescription: this.newOrder.parcelDescription ,
          });
      }
      if (this.dropLocation) {
         this.form.patchValue({
            
            dropLocation: this.dropLocation.address_details ,
           
          });
      }
      if (this.pickupLocation) {
         this.form.patchValue({
           
            pickupLocation: this.pickupLocation.address_details ,
          
          
          });
      }

   }

   fetchVehicleTypeList(): void {
      const superAdminId = environment.superAdminId;
      this.apiService.getVehicleTypeList(superAdminId).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.vehicleTypeList = response.data || [];
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
      this.form.get('vehicleType')?.setValue(vehicleId);
      localStorage.setItem('new-order', JSON.stringify(this.form.value));
   }

   addDelivery() {
 
      if (!this.form.valid) {
        // Show an error message for invalid form
      //   this.messageService.showError('Please fill in all required fields correctly.', 'Error');
        return; // Stop further execution
      }
    
      let payload = this.form.value;
      payload.business_id = this.businessDetails.id;
    
      payload.delivery_staff_id =0;
      payload.distance= this.distance
    
      // payload.distance = this.twoWay();
      localStorage.setItem('new-order', JSON.stringify(payload));
      try {
        this.apiService.createDelivery(payload).subscribe({
          next: (data: any) => {
            this.router.navigate(['orders/new-order/order-preview',data.data.id]);
            let ApiResponse: any = data;
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
          }
        });
      } catch (error) {
        console.log('Error in the catch block', error);
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
    
      const origin = new google.maps.LatLng(this.pickupLocation.lat_val, this.pickupLocation.long_val);
      const destination = new google.maps.LatLng(this.dropLocation.lat_val,this.dropLocation.long_val);
    
      const service = new google.maps.DistanceMatrixService();
    
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          console.log(response,status)
          if (status === google.maps.DistanceMatrixStatus.OK) {
            this.distance = response ? response.rows[0].elements[0].distance.text : 'N/A';
            const duration = response ? response.rows[0].elements[0].duration.text : 'N/A';
         
            this.distanceResult = `Distance: ${this.distance}, Duration: ${duration}`;
            console.log( this.distanceResult)
           this.addDelivery()
          } else {
            console.error("Error calculating distance:", status);
            alert("Error calculating the distance. Please try again.");
          }
        }
      );
    }
   createDelivery(): void {
      this.loading = true;
      let payload :any = this.form.value;
      payload.business_id= this.businessDetails.id;
     
      
      this.apiService.createDelivery(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.router.navigate(['orders/new-order/order-preview']);
               
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
}
