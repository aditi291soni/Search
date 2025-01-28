import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [CommonModule, ButtonModule, RouterModule, SkeletonModule],
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
   /**
    * List of businesses fetched from the API.
    * @type {any[]}
    */
   business: any[] = [];

   /**
    * Indicates whether data is currently loading.
    * @type {boolean}
    */
   loading: boolean = false;
   userInfo: any;
   businessDetails: any;
   order: any;

   /**
    * Creates an instance of DashboardComponent.
    * @param {ApiService} apiService - The service to interact with the API.
    */
   constructor(private apiService: ApiService) {
      this.userInfo = this.apiService.getLocalValueInJSON(localStorage.getItem('userInfo'));
      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));

    }

   /**
    * Lifecycle hook that runs after the component is initialized.
    * Initiates fetching the business list and manages the loading state.
    */
   ngOnInit(): void {
     this.fetchOrderList();
   }

   /**
    * Fetches the list of businesses from the API and updates the component state.
    */
   fetchOrderList(): void {
      this.loading = true;
      let payload :any = {};
      payload.business_id= this.businessDetails.id;
      payload.per_page=3
      payload.page=1
      
      this.apiService.getOrderList(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
         this.order=response.data;
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
}
