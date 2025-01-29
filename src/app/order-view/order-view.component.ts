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
   order: any;
   loading: boolean=false;
   invoice: any;
   invoiceId: any;

 constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder,private route: ActivatedRoute) {

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
      this.getOrderDelivery();
   }
   getOrderDelivery(): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      payload.order_delivery_details_id = this.order.id;
      this.apiService.getOrderDeliveryDetail(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.order = response.data || [];
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
