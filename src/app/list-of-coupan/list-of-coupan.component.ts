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
   delivery_id: any;
   super_admin_id: number;
   vehicle_id: any;
   orderdetail: any;
   super_business: any;
   address_preview: any;
   constructor(
      private apiService: ApiService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private confirmationService: ConfirmationService,
      private messageService: MessageService
   ) {

      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      this.super_business = this.apiService.getLocalValueInJSON(localStorage.getItem('super_business'));
      this.super_admin_id = this.apiService.getLocalValueInJSON(localStorage.getItem('super_admin'));
      this.userData = this.apiService.getLocalValueInJSON(localStorage.getItem('userData'));
      this.delivery_id = this.apiService.getLocalValueInJSON(localStorage.getItem('delivery_id'));
      this.orderdetail = this.apiService.getLocalValueInJSON(localStorage.getItem('new-order'));
      this.address_preview = this.apiService.getLocalValueInJSON(localStorage.getItem('address-preview'));
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

      payload.business_id = this.businessDetails?.id;
      payload.vehicle_id = this.orderdetail?.vehicle_type_id
      payload.super_admin_id = this.super_admin_id;
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
   applyCoupan(coupan: any): void {
      // NOTE: This function will call the API to verify the coupon
      // If the coupon is verified (also means valid) then procceed further ---
      let payload: any = {}
      payload.coupon_id = coupan.id
      // payload.coupon_code = coupan.code
      payload.user_id = this.userData.id
      // payload.mode_of_payment = this.address_preview.mode_of_payment
      payload.mode_of_payment = 'cash'
      payload.amount = this.address_preview.amount
      payload.platform = 'vendor-app'
      payload.delivery_type_id = this.address_preview.delivery_type_id
      payload.super_admin_id = this.userData.super_admin_id
      // payload.business_id = this.businessDetails?.id; 
      // payload.business_id = this.super_business
      payload.vehicle_type_id = this.orderdetail?.vehicle_type_id
      this.apiService.redeem_coupan(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               localStorage.setItem('coupan', JSON.stringify(coupan));
               this.router.navigate([`orders/new-order/order-preview/${this.delivery_id}`]);

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

}
