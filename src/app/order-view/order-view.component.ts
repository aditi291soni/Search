import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { ToastNotificationService } from '../services/toast-notification.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
   selector: 'app-order-view',
   standalone: true,
   providers: [ConfirmationService, MessageService],
   imports: [ButtonModule, TimelineModule, CommonModule, SkeletonModule, ConfirmDialog, ToastModule],
   templateUrl: './order-view.component.html',
   styleUrls: ['./order-view.component.css'],
})
export class OrderViewComponent {
   events: any[] = [];
   isMobile = window.innerWidth < 768;
   order: any = {};
   loading: boolean = true;
   invoice: any;
   invoiceId: any;
   businessDetails: any;
   deliveryId: any;
   delivery_name: any = {};
   timeslot: any;
   orderstatus: any[] = [];
   filteredOrderStatus: any[] = [];
   timelineshow: boolean = true;
   status: any;
   status_id: any;
   colorcode: any = '#000000';
   user: any;
   order_status: any;
   loading_button: boolean = false;
   userData: any;

   constructor(
      private apiService: ApiService,
      private router: Router,
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private confirmationService: ConfirmationService,
      private toastService: ToastNotificationService,
      private cdr: ChangeDetectorRef,
   ) {
      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      this.orderstatus = this.apiService.getLocalValueInJSON(localStorage.getItem('order-status'));
      this.userData = this.apiService.getLocalValueInJSON(localStorage.getItem('userData'));

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
      this.loading = true
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

            } else {
               console.error('Error fetching invoice:', response.message);
            }
         },
         error: (err) => console.error('Error fetching invoice:', err),

      });
   }

   getOrderDelivery(id: any): void {
      this.loading = true
      let payload = {
         super_admin_id: environment.superAdminId,
         order_delivery_details_id: id,
      };

      this.apiService.getOrderDeliveryDetail(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.order = response.data || {};
               this.status_id = this.order?.order_status_id
               console.log(this.status_id)
               console.log(this.order)
               if (response.data?.parcel_weight) {
                  this.getUser(response.data?.parcel_weight)
               }

               this.getTimeSlot(this.order?.time_slot);
               this.getDelivery(this.order?.delivery_type_id);
               this.getOrderStatus();
               this.getDynamicStatusName(this.order.order_status_id)

            } else {
               console.error('Error fetching order delivery:', response.message);
            }
         },
         error: (err) => console.error('Error fetching order delivery:', err),
         complete: () => (console.log("complete")),
      });
   }

   filterOrderStatus(): void {
      // if (!this.order?.order_status_id) return;

      const excludeMap: { [key: number]: number[] } = {
         45: [34, 26, 25],
         42: [33, 26, 25],
         43: [34, 26, 25],
         40: [34, 26, 25]
      };

      this.filteredOrderStatus = this.orderstatus.filter(status =>
         !excludeMap[this.order?.delivery_type_id]?.includes(status.id)
      );

      // Assign the filtered result to orderStatusFilter
      this.orderstatus = [...this.filteredOrderStatus];
      this.updateTimeline();
      this.cdr.detectChanges();

      // if (this.order?.order_status_id === 33) {
      //    this.filteredOrderStatus = this.orderstatus.filter(status => ![34, 26, 25].includes(status.id));
      // } else if (this.order?.order_status_id === 34) {
      //    this.filteredOrderStatus = this.orderstatus.filter(status => ![33, 26, 25].includes(status.id));
      // } else if (this.order?.order_status_id === 32) {
      //    this.filteredOrderStatus = this.orderstatus.filter(status => ![34, 26, 25].includes(status.id));
      // }
   }
   makePhoneCall(phoneNumber: string): void {
      // Redirect to the phone call app with the number
      window.open(`tel:${phoneNumber}`, '_self');
   }
   openMessageBox(): void {
      // For demonstration, open an alert. Replace with actual message modal logic.
      // alert('Message box opened! Implement your message modal here.');
      this.toastService.showError('Message box opened! Implement your message modal here.');
   }
   getOrderStatus(): void {
      this.loading = true
      let payload = {
         super_admin_id: environment.superAdminId,
      };

      this.apiService.getOrderStatus(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.orderstatus = response.data || [];

               this.filterOrderStatus()
               this.cdr.detectChanges();
               // ✅ Update timeline dynamically
            } else {
               console.error('Error fetching order status:', response.message);
            }
         },
         error: (err) => console.error('Error fetching order status:', err),

      });
   }

   // showTimeline(): void {
   //    // this.timelineshow = !this.timelineshow;
   //    this.timelineshow = true
   //    this.cdr.detectChanges();
   // }

   getDelivery(id: any): void {
      this.loading = true;
      let payload = {
         super_admin_id: environment.superAdminId,
         delivery_type_id: id,
      };

      this.apiService.getDelivery(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.delivery_name = response.data || [];
               this.colorcode = response.data.color_code


            } else {
               console.error('Error fetching delivery:', response.message);
            }
         },
         error: (err) => console.error('Error fetching delivery:', err),

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

      });
   }

   getUser(id: any): void {
      let payload = {
         super_admin_id: environment.superAdminId,
         user_id: id,
      };

      this.apiService.get_user(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.user = response.data || {};
            } else {
               console.error('Error fetching time slot:', response.message);
            }
         },
         error: (err) => console.error('Error fetching time slot:', err),

      });
   }

   updateTimeline() {
      // if (!this.order || !this.order.order_status_id || this.orderstatus.length === 0) {
      //    return;
      // }
      // this.cdr.detectChanges();
      // Find the current order's index in the orderstatus array

      const currentIndex = this.orderstatus.findIndex(status => status.id == this.status_id);
      console.log(currentIndex, this.status_id)
      this.events = this.orderstatus.map((status, index) => ({
         status: status.name_for_user,
         date: '', // Add date field if needed
         description: `Order is ${status.name_for_user}`,
         icon: index <= currentIndex ? 'pi pi-check-circle' : 'pi pi-circle-off',
         color: index <= currentIndex ? 'green' : 'gray',
         lineColor: index <= currentIndex ? 'green' : 'gray',
      }));
      console.log(this.events)
   }

   getDynamicStatusName(statusId: number) {

      this.status = this.orderstatus.find(s => s.id === statusId);
      this.loading = false;
      this.status ? this.status.name_for_user : "N/A"; // Return status name if found, else 'Unknown'
   }
   cancels() {

      this.status_id = 25

      if (this.invoice?.bill_status == '1') {
         this.add_wallet_amount()
         this.creaditTransaction(this.invoiceId)
      }

      this.editDeliveries()
      this.editInvoice()

      // this.clearLocal()
      this.loading_button = false;

      // localStorage.removeItem('selectedPickup');
      // localStorage.removeItem('selectedDrop');
      // localStorage.removeItem('new-order');
      // this.router.navigate(['/dashboard']);

   }

   add_wallet_amount(): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      payload.user_id = this.userData.id;
      payload.amount = this.invoice?.subtotal;
      // payload.vehicle_type_id = this.newOrder.vehicleType;
      this.apiService.add_wallet_amount(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               // this.timeSlot = response.data; // All time slots
               this.invoice?.bill_status == '0';

               // this.setDefaultDate();
            } else {
               console.error('Error fetching time slots:', response.message);
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
   editDeliveries() {
      let payload: any = {}
      payload.business_id = this.businessDetails.id
      payload.order_delivery_details_id = this.deliveryId
      payload.status = 1
      payload.order_status_id = 25

      payload.invoice_id = this.invoiceId ? this.invoiceId : 0
      // payload.user_id=
      try {
         this.apiService.edit_order_delivery_details(payload).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;


            },
            error: (error: any) => {
               console.log('Error fetching data', error);
               this.loading_button = false;
               this.cdr.detectChanges();
            }
         });
      } catch (error) {
         console.log('Error in the catch block', error);
      }
   }
   editInvoice() {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      let payload: any = this.invoice



      payload.bill_status = 0;

      payload.invoice_id = this.invoiceId ? this.invoiceId : 0
      payload.for_date = formattedDate
      payload.delivery_id = this.deliveryId
      payload.created_on_date = formattedDate

      try {
         this.apiService.editInvoice(payload).subscribe({
            next: (data: any) => {






            },
            error: (error: any) => {

               console.log('Error fetching data', error);
            }
         });
      } catch (error) {
         console.log('Error in the catch block', error);
      }
   }
   confirm2(event: Event) {

      console.log(event)
      this.confirmationService.confirm({
         target: event.target as EventTarget,
         message: 'Do you want to cancel this order?',
         header: ' ',
         icon: 'pi pi-info-circle',
         rejectLabel: 'Cancel',
         rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
         },
         acceptButtonProps: {
            label: 'Confirm',
            severity: 'danger',
         },

         accept: () => {
            console.log(event.target)
            this.cancels()
            // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
         },
         reject: () => {
            this.confirmationService.close();
         },
      });
   }
   creaditTransaction(id: any) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      let payload: any = {}
      payload.business_id = this.businessDetails.id
      // payload.for_user_id=this.userId ? this.userId : this.default
      payload.invoice_id = id
      payload.cr_amont = this.invoice.subtotal
      payload.amount = this.invoice.subtotal
      payload.super_admin_id = environment.superAdminId
      payload.created_on_date = formattedDate
      payload.payment_date = formattedDate
      try {
         this.apiService.addTransaction(payload).subscribe({
            next: (data: any) => {

               console.log('i', this.loading_button)
               let ApiResponse: any = data;

               if (data.status) {
                  this.editInvoice()

               }
               else {
                  this.toastService.showError('Error in Payment');
               }


            },
            error: (error: any) => {
               console.log('Error fetching data', error);
            }
         });
      } catch (error) {
         console.log('Error in the catch block', error);
      }
   }

}

