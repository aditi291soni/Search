import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { CustomerService } from '../services/customer.service';
import { SkeletonModule } from 'primeng/skeleton';
import { NoDataFoundComponent } from '../no-data-found/no-data-found.component';

@Component({
   selector: 'app-customers',
   standalone: true,
   imports: [CommonModule, ButtonModule, RouterModule, CardModule, AvatarModule, SkeletonModule, NoDataFoundComponent],
   templateUrl: './customers.component.html',
   styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
   customerList: any[] = []; // List of vehicle types
   loading: boolean = true;
   userInfo: any;
   businessDetail: any;
   activatedRoute: any;
   searchQuery: any;
   superAdminId: any;
   //  @param {ApiService} apiService

   constructor(private apiService: ApiService, private route: ActivatedRoute, private customerService: CustomerService,
      private router: Router) {
      this.userInfo = this.apiService.getLocalValueInJSON(localStorage.getItem('userInfo'));
      this.businessDetail = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      this.superAdminId = this.apiService.getLocalValueInJSON(localStorage.getItem('super_admin'));

   }

   ngOnInit(): void {
      this.fetchCustomerList();
      this.sortcustomerList();
      this.route.queryParams.subscribe(params => {
         this.searchQuery = params['search'] || '';  // Default to empty string if no 'search' param is found
         console.log('Search Query:', this.searchQuery);  // Log search query for debugging
         this.filtercustomerList();  // Trigger the filter after the search query is updated
      });
   }

   sortcustomerList() {
      this.customerList.sort((a, b) => a.first_name.toLowerCase().localeCompare(b.first_name.toLowerCase()));
      console.log(this.customerList)
   }
   filtercustomerList(): void {
      if (this.searchQuery.trim()) {
         this.customerList = this.customerList.filter(item =>
            Object.values(item).some(value =>
               value && value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
            )
         );
         console.log('Filtered Orders:', this.customerList);  // Log filtered orders for debugging
      }
   }

   fetchCustomerList(): void {
      const superAdminId = this.superAdminId ;

      this.customerService.getCustomerList({ business_id: this.businessDetail.id }).subscribe({
         next: (response) => {
            if (response.status) {
               let apiResponseData = response.data || [];
               // this.customerList = response.data || [];

               this.customerList = apiResponseData.filter((customer: any) =>

                  customer.role_id == '4'
               );
               // localStorage.setItem('customer', JSON.stringify(this.customerList));
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
}
