import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
   selector: 'app-order-view',
   standalone: true,
   imports: [ButtonModule, TimelineModule],
   templateUrl: './order-view.component.html',
   styleUrls: ['./order-view.component.css'],
})
export class OrderViewComponent {
   events: any[];
   order: any=0;
   loading: boolean=false;
   invoice: any;
   invoiceId: any;
   businessDetails: any;
   deliveryId: any;
   delivery_name: any;
   timeslot: any;
   orderstatus: any;

 constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder,private route: ActivatedRoute) {
   this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
   this.route.params.subscribe((params) => {

      this.invoiceId = params['invoice_id'];
   });
      this.events = [
         {
            status: 'Placed',
            date: '2025-01-01',
            description: 'Your order has been successfully placed.',
            icon: 'pi pi-check-circle',
            color: 'green',
            lineColor: 'green', // Separator line color
         },
         {
            status: 'Processing',
            date: '2025-01-02',
            description: 'Your order is being processed.',
            icon: 'pi pi-check-circle',
            color: 'green',
            lineColor: 'green',
         },
         {
            status: 'Shipped',
            date: '2025-01-03',
            description: 'Your order has been shipped.',
            icon: 'pi pi-check-circle',
            color: 'green',
            lineColor: 'green',
         },
         {
            status: 'Delivered',
            date: '2025-01-05',
            description: 'Your order has been delivered.',
            icon: 'pi pi-circle-off', // Default (not checked)
            color: 'gray',
            lineColor: 'gray', // Gray separator for pending status
         },
      ];
   }

   ngOnInit(): void {
      this.getInvoice()
      this.getOrderStatus()
     
   }
   getOrderDelivery(id:any): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      payload.order_delivery_details_id = id;
      this.apiService.getOrderDeliveryDetail(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.order = response.data || [];
               this.getTimeSlot(this.order?.time_slot);
               this.getDelivery(this.order?.delivery_type_id);
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


   getOrderStatus(): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      // payload.order_delivery_details_id = this.deliveryId;
      this.apiService.getOrderStatus(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.orderstatus = response.data || [];
           
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
   getDelivery(id:any): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      payload.delivery_type_id = id;
      this.apiService.getDelivery(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.delivery_name = response.data.delivery_name|| [];
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


   getTimeSlot(id:any): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      payload.time_slot_id = id;
      this.apiService.getTimeSlots(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.timeslot = response.data || [];
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
    getInvoice(): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      payload.invoice_id = this.invoiceId;
      payload.invoice_type ='order';
         this.apiService.getInvoice(payload).subscribe({
            next: (response) => {
               if (response.status === true) {
                  this.invoice = response.data || [];
                  this.deliveryId = this.invoice.delivery_id;
                  this.getOrderDelivery(response.data.delivery_id);
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
