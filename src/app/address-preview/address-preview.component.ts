import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Select } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastNotificationService } from '../services/toast-notification.service';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';

@Component({
   selector: 'app-address-preview',
   standalone: true,
   imports: [CommonModule, ButtonModule, Select, SkeletonModule,CalendarModule,FormsModule],
   templateUrl: './address-preview.component.html',
   styleUrls: ['./address-preview.component.css']
})
export class AddressPreviewComponent {

   businessDetails: any;
   pickupLocation: any;
   dropLocation: any;
   newOrder: any;
   vehicleTypeList: any;
   loading: boolean = true;
   loading_button:any;
   deliveryList: any;
   times: any;
   sub_total: any;
   price: any;
   listofInvoice: number = 0;
   financial: any;
   invoice_id: any;
   listofDelivery: any;
   timeslot: any;
   selectedDeliveryType: any;
   selectedPaymentType: any='cash';
   deliveryId: any;
   timeSlot: any;
   selectedPayment: any;
   pay_on_pickup: string = '0';
   pay_on_delivery: string = '0';
   selectedSlot: any;
   order_status: any;
   selectedDate: string = '';
   minDate: Date | undefined;
   constructor( private cdr: ChangeDetectorRef,private apiService: ApiService, private router: Router, private confirmationService: ConfirmationService, private fb: FormBuilder, private route: ActivatedRoute,private toastService: ToastNotificationService) {
      this.pickupLocation = this.apiService.getLocalValueInJSON(localStorage.getItem('selectedPickup'));
      this.dropLocation = this.apiService.getLocalValueInJSON(localStorage.getItem('selectedDrop'));
      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      this.newOrder = this.apiService.getLocalValueInJSON(localStorage.getItem('new-order'));

      this.route.params.subscribe((params) => {

         this.deliveryId = params['delivery_id'];
      });
      console.log(this.deliveryId)
   }
   pickup = {
      name: 'Aditi Mp',
      phone: '73648236423',
      address: '6, Hamidia Rd, Ghora Nakkas, Peer Gate Area, Bhopal, Madhya Pradesh 462001, India'
   };

   drop = {
      name: 'Aditi',
      phone: '362364723',
      address: 'Minal Residency, Bhopal, Madhya Pradesh, India'
   };
   paymentTypes: any = [
      { name: 'Online', value: 'upi', img: 'pi pi-credit-card' },
      { name: 'Wallet', value: 'wallet', img: 'pi pi-wallet' },
      { name: 'Cash', value: 'cash', img: 'pi pi-money-bill' }
   ];
   CashTypes: any = [
      { name: 'Pickup Point', value: 'pickup' },
      { name: 'Drop Point', value: 'drop' },

   ];
   ngOnInit(): void {
      this.loading_button = false;
      this.cdr.detectChanges();
      console.log('s',this.loading_button)
      this.fetchDeliveryTypeList();
      this.getfinancialYear()
      this.TimeSlot()
   }
   setDefaultDate() {
      const currentDate = new Date();
      this.selectedDate = currentDate.toISOString().split('T')[0]; // Format: "yyyy-mm-dd"
      this.minDate = currentDate;
      console.log("Default Selected Date:", this.selectedDate);
    }
    onDateSelect(event: Date) {
      const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
      const localDate = new Date(event.getTime() + istOffset); // Convert UTC to IST
    
      this.selectedDate = localDate.toISOString().split('T')[0]; // Format as "yyyy-mm-dd"
      console.log("Selected Date (IST):", this.selectedDate);
    }
    
   //  onDateSelect(event: Date) {
   //    console.log(event)
   //    this.selectedDate = event.toISOString().split('T')[0]; // Convert selected date to "yyyy-mm-dd"
   //    console.log("Selected Date:", this.selectedDate);
   //  }
   fetchDeliveryTypeList(): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      // payload.business_id = this.businessDetails.id;
      payload.vehicle_type_id = this.newOrder.vehicleType;
      this.apiService.getDeliveryType(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.selectedDeliveryType = response.data[0].id;
               this.order_status=response.data[0].order_status_id
               // this.deliveryList = response.data || [];
               this.deliveryList = response.data.map((deliveryType: any) => {

                  const pickup = this.time(deliveryType.eta, deliveryType.opening_hours, deliveryType.closing_hours)
                  const price = this.calculatePrice(deliveryType); // Calculate the price
                  this.times = this.time(deliveryType.eta, deliveryType.opening_hours, deliveryType.closing_hours)
                  //  console.log(  this.times)
                  return {
                     ...deliveryType,
                     pickup,
                     price, // Add the calculated price as a new key
                  };


               })
               this.sub_total = this.deliveryList[0].price


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
   TimeSlot(): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      // payload.business_id = this.businessDetails.id;
      // payload.vehicle_type_id = this.newOrder.vehicleType;
      this.apiService.getTimeSlot(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               // this.deliveryList = response.data || [];
               this.timeSlot = response.data
               this.setDefaultDate();
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
   calculatePrice(price: any): any {
      const parts = this.newOrder.distance.split(" ");
      const value = parts[0]; // "5.4"
      const unit = parts[1];
      if (this.newOrder.distance <= price.minimum_km) {
         console.log("base",price.base_charges,this.newOrder.distance <= price.minimum_km)
         // If the distance is within the minimum, use only the base price for the distance.
         this.price = Math.abs(price.base_charges);
      } else {

         // If the distance exceeds the minimum:
      
         const minimumDistancePrice = Number(price.base_charges);
         const extraDistancePrice = (Number(value) - Number(price.minimum_km)) * Number(price.per_km_charge);
         this.price = minimumDistancePrice + extraDistancePrice;
    
      }

      return Math.abs(this.price)
   }
   time(eta: any, opening_hr: any, closing_hr: any) {
      function toDateTime(timeStr: any) {
         const now = new Date();
         const [hours, minutes] = timeStr.split(':').map(Number);
         now.setHours(hours, minutes, 0, 0);
         return now;
      }
     
      const now = new Date();

      let openingTime = toDateTime(opening_hr);
      let closingTime = toDateTime(closing_hr);

      openingTime.setMinutes(openingTime.getMinutes());
      closingTime.setMinutes(closingTime.getMinutes());
    
      if (closingTime <= openingTime) {
         return now >= openingTime || now <= closingTime;
      } else {
         return now >= openingTime && now <= closingTime;
      }


   }


   getfinancialYear() {
      try {
         this.apiService.get_financial_year_list().subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;
               this.financial = ApiResponse.data[0].id;

            },
            error: (error: any) => {
               console.log('Error fetching data', error);
            }
         });
      } catch (error) {
         console.log('Error in the catch block', error);
      }
   }

   onDeliveryTypeSelect(value: any) {
      this.sub_total = value.price
      this.order_status=value.order_status_id
      this.timeslot = value.time_slot
      // this.base_price=value.price.base_price
console.log(this.order_status,'order-status')
      this.selectedDeliveryType = value.id;
   

   }
   paymentTypesSelection(value: any): void {
      this.selectedPaymentType = value.value;


   }
   paymentType(event: any) {
      this.selectedPayment = event.target.innerText;
    
      if (this.selectedPayment == 'Pay On Pickup') {
         this.pay_on_pickup = '1'
         this.pay_on_delivery = '0'
         console.log(this.pay_on_pickup)
      } else {
         this.pay_on_delivery = '1'
         this.pay_on_pickup = '0'
         console.log(this.pay_on_delivery)
      }
      console.log(this.pay_on_delivery, this.pay_on_pickup)
   }
   getlastinvoice() {
      console.log(this.loading_button)
      if (this.loading_button) return; // Prevent multiple clicks while loading

   this.loading_button = true; // Disable button immediately
      if(this.timeslot=='1' && !this.selectedSlot){

         this.toastService.showError("Please select time slot")
         this.loading_button = false;
         this.cdr.detectChanges();
         return;
       }      if(this.timeslot=='1' && !this.selectedDate){

         this.toastService.showError("Please select delivery date")
         this.loading_button = false;
         this.cdr.detectChanges();
         return;
       }
       
       if (!this.selectedPaymentType ) {
         this.toastService.showError("Please select payment mode")
         this.loading_button = false;
         this.cdr.detectChanges();
         return;
       }
       if(this.selectedPaymentType=='cash' && !this.selectedPayment){

         this.toastService.showError("Please select payment location")
         this.loading_button = false;
         this.cdr.detectChanges();
         return;
       }
      else if (!this.selectedDeliveryType ) {
       this.toastService.showError("Please select Delivery Type")
       this.loading_button = false;
       this.cdr.detectChanges();
         return;
       }
      try {
        
         this.apiService.last_invoice({ business_id: this.businessDetails.id }).subscribe({
            next: (data: any) => {
               // this.loading_button = true;
               let ApiResponse: any = data;
               this.listofInvoice = ApiResponse.data.order_no ? Number(ApiResponse.data.order_no) + 1 : Number(ApiResponse.data.id) + 1
               console.log(this.listofInvoice)
               if (this.listofInvoice) {
                  this.addInvoice(this.listofInvoice)
                  

                 
               }

               else {
                  this.loading_button = false;
                  //   this.messageService.showError('Order Id Invalid', 'Error')
               }
            },
            error: (error: any) => {
               this.loading_button = false;
               console.log('Error fetching data', error);
            }

         });
      } catch (error) {
         console.log('Error in the catch block', error);
      }
   }

   onSlotChange(event: any): void {
      this.selectedSlot = event.value;
      console.log('Selected Delivery Type:', event);
   }
   addInvoice(order_id: any) {

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      let payload: any = {}
      payload.business_id = this.businessDetails.id
      payload.for_user_id = '171',
         payload.pay_on_pickup = this.pay_on_pickup,
         payload.pay_on_delivery = this.pay_on_delivery,
         payload.for_booking_slot_id = Number(this.selectedSlot)
      payload.for_slot_id = this.timeslot
      payload.super_admin_id = environment?.superAdminId
      payload.delivery_id = this.deliveryId
      // payload.end_time = this.deliveryId
      // payload.start_time = this.deliveryId
      // payload.for_booking_time=
      payload.prefix_value = 'ORDER'
      payload.invoice_type = 'order'
      payload.financial_year_id = this.financial
      payload.subtotal = this.sub_total
      payload.order_no = order_id
      payload.total_tax = 0
      payload.adjustment_value = 0
      payload.grand_total = this.sub_total
      payload.for_date = formattedDate
      payload.delivery_id = this.deliveryId
      payload.created_on_date = formattedDate
      payload.for_booking_date =this.selectedDate
      payload.drop_name = this.dropLocation.person_name
      payload.drop_mobile = this.dropLocation?.person_phone_no
      payload.pickup_name = this.pickupLocation?.person_name
      payload.pickup_mobile = this.pickupLocation?.person_phone_no
      try {
         this.apiService.addInvoice(payload).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;
               console.log(data.status)
               if (data.status) {
                  // this.loading_button = true;
                  console.log('i',this.loading_button )
                  // this.listofInvoice = ApiResponse.data;
                  this.invoice_id = ApiResponse?.data?.id
                  this.editDelivery(this.deliveryId)
                  this.addTransaction(data.data.id)
                  // if(  this.selectedPaymentType == 'cash'){
                  //   this.addDeliveryAllot(this.invoice_id)
                  // }
                  // else if(  this.selectedPaymentType == 'wallet'){
                  //   this.addDeliveryAllot(this.invoice_id)
                  // }
                  // else if(  this.selectedPaymentType == 'upi'){
                  //   this.addDeliveryAllot(this.invoice_id)
                  // this.getrazorPay()
                  // }
                  // this.clearLocal()
                  // this.router.navigate(['/order-list']);
                  // this.messageService.showThankyou()
               } else {
                  this.toastService.showError(data.msg); 
                  this.loading_button = false;
                  this.cdr.detectChanges();
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
 
  
   addTransaction(id: any) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      let payload: any = {}
      payload.business_id = this.businessDetails.id
      // payload.for_user_id=this.userId ? this.userId : this.default
      payload.invoice_id = id
      payload.dr_amount = this.sub_total
      payload.amount = this.sub_total
      payload.super_admin_id = environment.superAdminId
      payload.created_on_date = formattedDate
      payload.payment_date = formattedDate
      try {
         this.apiService.addTransaction(payload).subscribe({
            next: (data: any) => {
               // this.loading_button = true;
               console.log('i',this.loading_button )
               let ApiResponse: any = data;
               // this.clearLocal()
               // this.addNotification()
               if(data.status){
                
               // this.router.navigate(['/dashboard']);
             
             
              
               // this.toastService.showSuccess("Order Placed Successfully")
            }
               else{
                  this.toastService.showError('Error in Payment'); 
               }
               // this.listofInvoice = ApiResponse.data;
               // if(  this.selectedPaymentType == 'cash'){}
               // else if(  this.selectedPaymentType == 'wallet'){}
               // else if(  this.selectedPaymentType == 'upi'){
               //   this.makePayment()
               // }
               // this.clearLocal()
               // this.router.navigate(['/order-list']);
               // this.addDeliveryAllot(ApiResponse.data.id)

            },
            error: (error: any) => {
               console.log('Error fetching data', error);
            }
         });
      } catch (error) {
         console.log('Error in the catch block', error);
      }
   }
   editDelivery(id: any) {
      let payload: any = {}
      payload.business_id = this.businessDetails.id
      payload.order_delivery_details_id = id
      payload.status = 1
      payload.order_status_id=this.order_status
      payload.delivery_type_id = this.selectedDeliveryType
      payload.order_value = this.sub_total
      payload.delivery_charges = this.sub_total
      payload.time_slot = this.timeslot
      payload.pickup_address_id = this.pickupLocation.id
      payload.drop_address_id = this.dropLocation.id
      payload.delivery_payment_status = this.selectedPaymentType
      payload.drop_person_name = this.dropLocation.person_name
      payload.drop_phone_no = this.dropLocation.person_phone_no
      payload.pickup_person_name = this.pickupLocation.person_name
      payload.pickup_phone_no = this.pickupLocation.person_phone_no
      payload.super_admin_id = environment.superAdminId
      payload.drop_address = this.dropLocation.address_details
      payload.pickup_address = this.pickupLocation.address_details
      payload.parcel_weight = this.listofInvoice
      payload.invoice_id=this.invoice_id ? this.invoice_id: 0
      // payload.user_id=
      try {
         this.apiService.edit_order_delivery_details(payload).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;
            this.addNotification()
            // this.loading_button = true;
               // this.listofDelivery = ApiResponse.data;
               // this.clearLocal()
               // this.router.navigate(['/order-list']);

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

   editDeliveries(id: any) {
      let payload: any = {}
      payload.business_id = this.businessDetails.id
      payload.order_delivery_details_id = id
      payload.status = 1
      payload.order_status_id=this.order_status
      payload.delivery_type_id = this.selectedDeliveryType
      payload.order_value = this.sub_total
      payload.delivery_charges = this.sub_total
      payload.time_slot = this.timeslot
      payload.pickup_address_id = this.pickupLocation.id
      payload.drop_address_id = this.dropLocation.id
      payload.delivery_payment_status = this.selectedPaymentType
      payload.drop_person_name = this.dropLocation.person_name
      payload.drop_phone_no = this.dropLocation.person_phone_no
      payload.pickup_person_name = this.pickupLocation.person_name
      payload.pickup_phone_no = this.pickupLocation.person_phone_no
      payload.super_admin_id = environment.superAdminId
      payload.drop_address = this.dropLocation.address_details
      payload.pickup_address = this.pickupLocation.address_details
      payload.parcel_weight = this.listofInvoice
      payload.invoice_id=this.invoice_id ? this.invoice_id: 0
      // payload.user_id=
      try {
         this.apiService.edit_order_delivery_details(payload).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;
            // this.addNotification()
            // this.loading_button = true;
               // this.listofDelivery = ApiResponse.data;
               // this.clearLocal()
               // this.router.navigate(['/order-list']);

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


   addNotification() {
      if(!this.invoice_id){
console.log("nf",this.invoice_id)
         this.toastService.showSuccess('Your Order is Successfully Cancelled'); 
         return;
      }else{
         console.log("f",this.invoice_id)
      }
      let payload = {
         "user_id": environment.riderId,
         "super_admin_id": environment.superAdminId,
         "delivery_id": this.deliveryId,
         "invoice_id": this.invoice_id,
         "details": {
            "distance":this.newOrder.distance,
            'pickup_address':this.pickupLocation.address_details,
            'order_status':this.order_status,
            'delivery_type':this.selectedDeliveryType
        }
      }

      try {
         this.apiService.addNotification(payload).subscribe({
            next: (data: any) => {
               // this.loading_button = true;
               this.clearLocal()
               this.confirmationService.confirm({
                  message: 'Thank Your Order Placed Successfully!',
                  header: 'Thank You!',
                  icon: 'pi pi-check-circle',
                  acceptLabel: 'OK',
                  rejectVisible: false, // Hides the "No" button
                  accept: () => {
                      console.log('Thank you message displayed');
                  }
                  
              });
              this.loading_button = false;
            },
            error: (error: any) => {
               console.log('Error fetching data', error);
               this.loading_button = false;
            }

         });
      } catch (error) {
         console.log('Error in the catch block', error);
      }
   }
   clearLocal() {
 
      localStorage.removeItem('selectedPickup');
      localStorage.removeItem('selectedDrop');
      localStorage.removeItem('new-order');
      this.router.navigate(['/dashboard']);
   }
   cancel() {
      this.order_status=25
      this.editDeliveries(this.deliveryId)
      localStorage.removeItem('selectedPickup');
      localStorage.removeItem('selectedDrop');
      localStorage.removeItem('new-order');
      this.router.navigate(['/dashboard']);
   }
}
