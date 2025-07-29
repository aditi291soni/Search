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
   imports: [
      CommonModule,
      ButtonModule,
      RouterModule,
      CardModule,
      AvatarModule,
      SkeletonModule,
      NoDataFoundComponent
   ],
   templateUrl: './customers.component.html',
   styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
   customerList: any[] = [];
   originalCustomerList: any[] = [];
   loading: boolean = true;
   userInfo: any;
   businessDetail: any;
   searchQuery: string = '';
   superAdminId: any;

   constructor(
      private apiService: ApiService,
      private route: ActivatedRoute,
      private customerService: CustomerService,
      private router: Router
   ) {
      this.userInfo = this.apiService.getLocalValueInJSON(localStorage.getItem('userInfo'));
      this.businessDetail = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      this.superAdminId = this.apiService.getLocalValueInJSON(localStorage.getItem('super_admin'));
   }

   ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
         this.searchQuery = params['search'] || '';
         this.fetchCustomerList();
      });
   }

   fetchCustomerList(): void {
      const businessId = this.businessDetail?.id;

      this.customerService.getCustomerList({ business_id: businessId }).subscribe({
         next: (response) => {
            if (response.status) {
               let apiResponseData = response.data || [];
               this.originalCustomerList = apiResponseData.filter((customer: any) => customer.role_id == '4');
               this.customerList = [...this.originalCustomerList];

               this.sortCustomerList();

               if (this.searchQuery?.trim()) {
                  this.filterCustomerList();
               }
            } else {
               console.error('Error fetching customers:', response.message);
            }
         },
         error: (err) => {
            console.error('Error fetching customers:', err);
         },
         complete: () => {
            this.loading = false;
         },
      });
   }

   sortCustomerList(): void {
      this.customerList.sort((a, b) => a.first_name.toLowerCase().localeCompare(b.first_name.toLowerCase()));
   }

   filterCustomerList(): void {
      if (this.searchQuery.trim()) {
         this.customerList = this.originalCustomerList.filter(item =>
            Object.values(item).some(value =>
               value && value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
            )
         );
         console.log('Filtered Customers:', this.customerList);
      } else {
         this.customerList = [...this.originalCustomerList]; // Reset list when search is cleared
      }
   }
}
