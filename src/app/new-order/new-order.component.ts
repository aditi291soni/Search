import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-new-order',
   standalone: true,
   imports: [InputTextModule, ButtonModule, CommonModule, SkeletonModule, FormsModule],
   templateUrl: './new-order.component.html',
   styleUrls: ['./new-order.component.css'],
})
export class NewOrderComponent {
   vehicleTypeList: any[] = []; // List of vehicle types
   loading: boolean = true; // Indicates whether data is currently loading
   selectedVehicle: number | null = null; // Store selected vehicle's ID
   pickupLocation: string = ''; // Store the pickup location address
   dropLocation: string = ''; // Store the drop location address
   receiverName: string = ''; // Store the receiver's name
   receiverContact: string = ''; // Store the receiver's contact
   parcelWeight: string = ''; // Store the parcel's weight
   parcelDescription: string = ''; // Store the parcel's description

   /**
    * Creates an instance of NewOrderComponent.
    * @param {ApiService} apiService - The service to interact with the API.
    */
   constructor(private apiService: ApiService) { }

   ngOnInit(): void {
      this.fetchVehicleTypeList();
   }

   /**
    * Fetches the list of vehicle types from the API.
    */
   fetchVehicleTypeList(): void {
      const superAdminId = environment.superAdminId;

      this.apiService.getVehicleTypeList(superAdminId.toString()).subscribe({
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

   /**
    * Selects a vehicle by setting the selected vehicle ID.
    * @param vehicleId The ID of the selected vehicle.
    */
   selectVehicle(vehicleId: number): void {
      this.selectedVehicle = vehicleId; // Set the selected vehicle's ID
   }

   /**
    * Handles the form submission.
    */
   submitForm(): void {
      if (this.selectedVehicle && this.pickupLocation && this.dropLocation && this.receiverName && this.receiverContact) {
         // Handle form submission logic here, e.g., sending the data to the API
         console.log({
            selectedVehicle: this.selectedVehicle,
            pickupLocation: this.pickupLocation,
            dropLocation: this.dropLocation,
            receiverName: this.receiverName,
            receiverContact: this.receiverContact,
            parcelWeight: this.parcelWeight,
            parcelDescription: this.parcelDescription
         });
      } else {
         console.error('Please fill in all required fields');
      }
   }
}
