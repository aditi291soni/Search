import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { ApiService } from '../services/api.service';

@Component({
   selector: 'app-list-of-coupan',
   standalone: true,
   imports: [CommonModule, SkeletonModule, ButtonModule, ConfirmDialog, ToastModule],
   providers: [ConfirmationService, MessageService],
   templateUrl: './list-of-coupan.component.html',
   styleUrl: './list-of-coupan.component.css'
})
export class ListOfCoupanComponent {
   businessDetails: any;
   userData: any;
   loading: boolean = false;
   coupanList: any = [];
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
   ngOnInit() {
      this.fetchcoupanList()
   }
   fetchcoupanList(): void {
      // const business = localStorage.getItem('bussinessDetails');
      // const businessId = business ? JSON.parse(business).id : null;

      // if (!businessId) {
      //    console.error('Business ID not found in localStorage');
      //    this.loading = false;

      // }
      let payload: any = {}

      payload.business_id = 161;

      this.apiService.list_of_coupan(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.coupanList = response.data || [];


               console.log(this.coupanList);
               this.coupanList = [...this.coupanList];

               // localStorage.setItem('address', JSON.stringify(this.coupanList));
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
   applyCoupan(coupan: any): void { }
}
