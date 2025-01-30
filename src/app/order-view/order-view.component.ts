import { Component, HostListener } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
   selector: 'app-order-view',
   standalone: true,
   imports: [ButtonModule, TimelineModule,CommonModule],
   templateUrl: './order-view.component.html',
   styleUrls: ['./order-view.component.css'],
})
export class OrderViewComponent {
   events: any[] = [];
   isMobile = window.innerWidth < 768;
   order: any = {};
   loading: boolean = false;
   invoice: any;
   invoiceId: any;
   businessDetails: any;
   deliveryId: any;
   delivery_name: any;
   timeslot: any;
   orderstatus: any[] = [];
   filteredOrderStatus: any[] = [];
   timelineshow: boolean = false;

   constructor(
      private apiService: ApiService,
      private router: Router,
      private fb: FormBuilder,
      private route: ActivatedRoute
   ) {
      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));

      this.route.params.subscribe((params) => {
         this.invoiceId = params['invoice_id'];
      });
   }

   ngOnInit(): void {
      this.getInvoice();
   }

   @HostListener('window:resize', ['$event'])
   onResize(event: Event) {
      this.isMobile = (event.target as Window).innerWidth < 768;
   }

   getInvoice(): void {
      let payload = {
         super_admin_id: environment.superAdminId,
         invoice_id: this.invoiceId,
         invoice_type: 'order',
      };

      this.apiService.getInvoice(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.invoice = response.data || {};
               this.deliveryId = this.invoice.delivery_id;
               this.getOrderDelivery(this.invoice.delivery_id);
               this.getOrderStatus();
            } else {
               console.error('Error fetching invoice:', response.message);
            }
         },
         error: (err) => console.error('Error fetching invoice:', err),
         complete: () => (this.loading = false),
      });
   }

   getOrderDelivery(id: any): void {
      let payload = {
         super_admin_id: environment.superAdminId,
         order_delivery_details_id: id,
      };

      this.apiService.getOrderDeliveryDetail(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.order = response.data || {};
               this.getTimeSlot(this.order?.time_slot);
               this.getDelivery(this.order?.delivery_type_id);
            } else {
               console.error('Error fetching order delivery:', response.message);
            }
         },
         error: (err) => console.error('Error fetching order delivery:', err),
         complete: () => (this.loading = false),
      });
   }

   filterOrderStatus(): void {
      if (this.order?.order_status_id === 33) {
         this.filteredOrderStatus = this.orderstatus.filter(status => ![34, 26, 25].includes(status.id));
      } else if (this.order?.order_status_id === 34) {
         this.filteredOrderStatus = this.orderstatus.filter(status => ![33, 26, 25].includes(status.id));
      } else if (this.order?.order_status_id === 32) {
         this.filteredOrderStatus = this.orderstatus.filter(status => ![34, 26, 25].includes(status.id));
      }
   }

   getOrderStatus(): void {
      let payload = {
         super_admin_id: environment.superAdminId,
      };

      this.apiService.getOrderStatus(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.orderstatus = response.data || [];
               this.updateTimeline(); // ✅ Update timeline dynamically
            } else {
               console.error('Error fetching order status:', response.message);
            }
         },
         error: (err) => console.error('Error fetching order status:', err),
         complete: () => (this.loading = false),
      });
   }

   showTimeline(): void {
      this.timelineshow = !this.timelineshow;
   }

   getDelivery(id: any): void {
      let payload = {
         super_admin_id: environment.superAdminId,
         delivery_type_id: id,
      };

      this.apiService.getDelivery(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.delivery_name = response.data.delivery_name || [];
            } else {
               console.error('Error fetching delivery:', response.message);
            }
         },
         error: (err) => console.error('Error fetching delivery:', err),
         complete: () => (this.loading = false),
      });
   }

   getTimeSlot(id: any): void {
      let payload = {
         super_admin_id: environment.superAdminId,
         time_slot_id: id,
      };

      this.apiService.getTimeSlots(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.timeslot = response.data || [];
            } else {
               console.error('Error fetching time slot:', response.message);
            }
         },
         error: (err) => console.error('Error fetching time slot:', err),
         complete: () => (this.loading = false),
      });
   }

   updateTimeline(): void {
      if (!this.order || !this.order.order_status_id || this.orderstatus.length === 0) {
         return;
      }

      // Find the current order's index in the orderstatus array
      const currentIndex = this.orderstatus.findIndex(status => status.id === this.order.order_status_id);

      this.events = this.orderstatus.map((status, index) => ({
         status: status.name_for_user,
         date: '', // Add date field if needed
         description: `Order is ${status.name_for_user}`,
         icon: index <= currentIndex ? 'pi pi-check-circle' : 'pi pi-circle-off',
         color: index <= currentIndex ? 'green' : 'gray',
         lineColor: index <= currentIndex ? 'green' : 'gray',
      }));
   }
}
