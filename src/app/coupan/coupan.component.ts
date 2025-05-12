import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coupan',
  imports: [],
  templateUrl: './coupan.component.html',
  styleUrl: './coupan.component.css'
})
export class CoupanComponent {
  userInfo: any;
  businessDetails: any;
  superAdminId: any;
  super_business: any;
  orderstatus: any;
  orderComplete: any;

   constructor(private apiService: ApiService, private router: Router, private cdr: ChangeDetectorRef,) {
      this.userInfo = this.apiService.getLocalValueInJSON(localStorage.getItem('userData'));
      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      this.superAdminId = this.apiService.getLocalValueInJSON(localStorage.getItem('super_admin'));
      this.super_business= this.apiService.getLocalValueInJSON(localStorage.getItem('super_business'));

      this.orderstatus = this.apiService.getLocalValueInJSON(localStorage.getItem('order-status'));
      this.orderComplete = this.apiService.getLocalValueInJSON(localStorage.getItem('orderComplete'));
   }

   ngOnInit(): void {

   }
      getCoupan(): void {
      let payload = {
         super_admin_id: this.superAdminId ,
      };

      this.apiService.getOrderStatus(payload).subscribe({
         next: (response) => {
            if (response.status == true) {
               this.orderstatus = response.data;
               localStorage.setItem('order-status', JSON.stringify(this.orderstatus));
               this.cdr.detectChanges();
            } else {
               console.error('Error fetching order status:', response.message);
            }
         },
         error: (err) => console.error('Error fetching order status:', err),
      
      });
   }
}
