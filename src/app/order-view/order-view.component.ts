import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { ToastNotificationService } from '../services/toast-notification.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-order-view',
   standalone: true,
   providers: [ConfirmationService, MessageService],
   imports: [ButtonModule, TimelineModule, CommonModule, SkeletonModule, ConfirmDialog, ToastModule, ProgressSpinnerModule],
   templateUrl: './order-view.component.html',
   styleUrls: ['./order-view.component.css'],
})
export class OrderViewComponent {
   events: any[] = [];
   isMobile = window.innerWidth < 768;
   order: any = {};
   loading: boolean = true;
   loadings: boolean = false;
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
   cancellation = 0;
   order_status: any;
   loading_button: boolean = false;
   userData: any;
   intervalId: any;
   vehicle_name: any;
   superAdminId: any;
   super_business: any;

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
      this.superAdminId = this.apiService.getLocalValueInJSON(localStorage.getItem('super_admin'));
      this.super_business= this.apiService.getLocalValueInJSON(localStorage.getItem('super_business'));

      this.route.params.subscribe((params) => {
         this.invoiceId = params['invoice_id'];
      });
   }

   ngOnInit(): void {
      this.getInvoice();

      // this.intervalId = setInterval(() => {
      //    this.getInvoice(); // Call API periodically
      // }, 10000);


   }
   ngOnDestroy(): void {
      // Clear interval when component is destroyed to avoid memory leaks
      if (this.intervalId) {
         clearInterval(this.intervalId);
      }
   }
   @HostListener('window:resize', ['$event'])
   onResize(event: Event) {
      console.log((event.target as Window))
      this.isMobile = (event.target as Window).innerWidth < 768;
   }

   getInvoice(): void {
      this.loading = true
      let payload = {
         super_admin_id: this.superAdminId ,
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
         super_admin_id: this.superAdminId ,
         order_delivery_details_id: id,
      };

      this.apiService.getOrderDeliveryDetail(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.order = response.data || {};
               this.status_id = this.order?.master_order_status_id

               console.log(this.status_id)
               console.log(this.order)
               if (response.data?.parcel_weight) {
                  this.getUser(response.data?.parcel_weight)
               }

               this.getTimeSlot(this.order?.time_slot_id);
               this.getDelivery(this.order?.delivery_type_id);
               this.getVehicle(this.order?.vehicle_type_id)
               this.getOrderStatus();
               this.getDynamicStatusName(this.order.master_order_status_id)

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
console.log("ll",this.delivery_name?.master_delivery_type_id)
      const excludeMap: { [key: number]: number[] } = {
         // 45: [20, 11, 10, 21],
         // 42: [19, 11, 10, 21],
         // 43: [20, 11, 10, 21],
         // 40: [20, 11, 10, 21]
         1: [20, 11, 10, 21],
         3: [19, 11, 10, 21],
         2: [20, 11, 10, 21],
         4: [20, 11, 10, 21]
      };
      this.filteredOrderStatus = this.orderstatus.filter(status =>
         !excludeMap[ this.delivery_name?.master_delivery_type_id]?.includes(status.id)
      );
console.log("f", this.filteredOrderStatus)
      // this.filteredOrderStatus = this.orderstatus.filter(status =>
      //    !excludeMap[this.order?.delivery_type_id]?.includes(status.id)
      // );

    
      this.orderstatus = [...this.filteredOrderStatus];
      this.updateTimeline();
      this.cdr.detectChanges();

      // if (this.order?.order_status_id === 19) {
      //    this.filteredOrderStatus = this.orderstatus.filter(status => ![20, 11, 10].includes(status.id));
      // } else if (this.order?.order_status_id === 20) {
      //    this.filteredOrderStatus = this.orderstatus.filter(status => ![19, 11, 10].includes(status.id));
      // } else if (this.order?.order_status_id === 32) {
      //    this.filteredOrderStatus = this.orderstatus.filter(status => ![20, 11, 10].includes(status.id));
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
         super_admin_id: this.superAdminId ,
      };

      this.apiService.getOrderStatus(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.orderstatus = response.data || [];

            
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
         super_admin_id: this.superAdminId ,
         delivery_type_id: id,
      };

      this.apiService.getDelivery(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.delivery_name = response.data || [];
               this.colorcode = response.data.color_code
               console.log("cancel", this.delivery_name)


            } else {
               console.error('Error fetching delivery:', response.message);
            }
            this.filterOrderStatus()
            this.cdr.detectChanges();
         },
         error: (err) => console.error('Error fetching delivery:', err),

      });
   }
   getVehicle(id: any): void {
      this.loading = true;
      let payload = {
         super_admin_id: this.superAdminId ,
         vehicle_type_id: id,
      };

      this.apiService.getVehicle(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.vehicle_name = response?.data?.vehicle_type || [];



            } else {
               console.error('Error fetching delivery:', response.message);
            }
         },
         error: (err) => console.error('Error fetching delivery:', err),

      });
   }
   getTimeSlot(id: any): void {
      let payload = {
         super_admin_id: this.superAdminId ,
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
         super_admin_id: this.superAdminId ,
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
         status: status.order_status_name,
         date: '', // Add date field if needed
         description: `Order is ${status.order_status_name}`,
         icon: index <= currentIndex ? 'pi pi-check-circle' : 'pi pi-circle-off',
         color: index <= currentIndex ? 'green' : 'gray',
         lineColor: index <= currentIndex ? 'green' : 'gray',
         textColor: index <= currentIndex ? 'black' : 'gray', // Text color logic
         iconColor: index <= currentIndex ? 'green' : 'gray'
      }));
      console.log(this.events)
   }

   getDynamicStatusName(statusId: number) {

      this.status = this.orderstatus.find(s => s.id === statusId);
      this.loading = false;
      this.status ? this.status.order_status_name : "N/A"; // Return status name if found, else 'Unknown'
   }
   cancels() {
      console.log("c", this.status, this.cancellation)

      if (this.status.id
         == 16|| this.status.id
         == 14) {
         this.cancellation = Number(this.delivery_name.cancelation_charges)
      }

      console.log("c1", this.status, this.cancellation)

      if (this.invoice?.bill_status == '1') {
         this.add_wallet_amount()
         this.creaditTransaction(this.invoiceId)
      }
      this.status_id = 10
      this.editDeliveries()
      this.editInvoice()

      // this.clearLocal()
      this.loading_button = false;

      // localStorage.removeItem('selectedPickup');
      // localStorage.removeItem('selectedDrop');
      // localStorage.removeItem('new-order');
      // this.router.navigate(['/dashboard']);
      setTimeout(() => {
         this.router.navigate(['/dashboard']);
      }, 3000);

   }

   add_wallet_amount(): void {
      let payload: any = {};
      payload.super_admin_id = this.superAdminId ;
      payload.user_id = this.userData.id;
      payload.amount = this.invoice?.subtotal - this.cancellation;
      console.log("c4", this.invoice?.subtotal, this.cancellation, payload.amount)
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
      payload.business_id = this.businessDetails ? this.businessDetails.id : null
      payload.order_delivery_details_id = this.deliveryId
      payload.status = 1
      payload.master_order_status_id = 10

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
         // target: event.target as EventTarget,
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
            this.loadings = true; // Show loader when user confirms

            this.cancels()
            // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
         },
         reject: () => {
            this.confirmationService.close();
            this.loadings = false;
         },
      });
   }
   creaditTransaction(id: any) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      let payload: any = {}
      payload.business_id =  this.super_business
      // payload.business_id = this.businessDetails ? this.businessDetails.id : null
      // payload.for_user_id=this.userId ? this.userId : this.default
      payload.invoice_id = id
      payload.pay_to_uid = this.userData.id
      payload.cr_amont = this.invoice.subtotal - Number(this.cancellation)
      payload.amount = this.invoice.subtotal - Number(this.cancellation)
      payload.super_admin_id = this.superAdminId 
      payload.created_on_date = formattedDate
      payload.payment_date = formattedDate
      payload.pay_for_ledger = this.order.pay_on == '138' ? '138' : '139'
      console.log("c5", this.invoice?.subtotal, this.cancellation, payload.amount)
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

