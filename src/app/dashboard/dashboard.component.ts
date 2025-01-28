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
   loading: boolean = true;

   /**
    * Creates an instance of DashboardComponent.
    * @param {ApiService} apiService - The service to interact with the API.
    */
   constructor(private apiService: ApiService) { }

   /**
    * Lifecycle hook that runs after the component is initialized.
    * Initiates fetching the business list and manages the loading state.
    */
   ngOnInit(): void {
      this.fetchBusinessList();
   }

   /**
    * Fetches the list of businesses from the API and updates the component state.
    */
   fetchBusinessList(): void {
      this.loading = true;
      this.apiService.getListOfBusinesses().subscribe({
         next: (response) => {
            if (response.status === true) {
               this.business = response.data || [];
               const defaultBusiness = this.business.find((i) => i.id === 837);
               // TODO: Setting 488 as default Business. Change it to the default business id.
               localStorage.setItem('defaultBusiness', JSON.stringify(defaultBusiness));
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
