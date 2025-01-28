import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

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
   selectedPickup: Location | null = JSON.parse(localStorage.getItem('selectedPickup') || 'null');
   selectedDrop: Location | null = JSON.parse(localStorage.getItem('selectedDrop') || 'null');
   addressList: any[] = []; // List of available addresses for pickup/drop

   form: FormGroup;

   constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {
      // Initialize form group with default values
      this.form = this.fb.group({
         vehicleType: ['', Validators.required],
         pickupLocation: [this.selectedPickup ? this.selectedPickup.house_no : '', Validators.required],
         dropLocation: [this.selectedDrop ? this.selectedDrop.house_no : '', Validators.required],
         parcelWeight: [''],
         parcelDescription: [''],
      });
   }

   ngOnInit(): void {
      this.fetchVehicleTypeList();
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
   }

   submitForm(): void {
      if (this.form.valid) {
         console.log(this.form.value);
      } else {
         console.error('Please fill in all required fields');
      }
   }

   navigateToPickupSelect(): void {
      this.router.navigate(['orders/new-order/select-pickup']);
   }

   navigateToDropSelect(): void {
      this.router.navigate(['orders/new-order/select-drop']);
   }

   saveAddressToLocalStorage(address: any): void {
      if (this.selectedPickup) {
         localStorage.setItem('selectedPickup', JSON.stringify(address));
         this.selectedPickup = address;
      } else if (this.selectedDrop) {
         localStorage.setItem('selectedDrop', JSON.stringify(address));
         this.selectedDrop = address;
      }
   }

   clearPickupAddress(): void {
      this.selectedPickup = null;
      localStorage.removeItem('selectedPickup');
      this.form.get('pickupLocation')?.reset();
   }

   clearDropAddress(): void {
      this.selectedDrop = null;
      localStorage.removeItem('selectedDrop');
      this.form.get('dropLocation')?.reset();
   }
}
