import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Select } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
   selector: 'app-address-preview',
   standalone: true,
   imports: [CommonModule, ButtonModule, Select, SkeletonModule],
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
   selectedPaymentType: any;
   deliveryId: any;
   timeSlot: any;
   selectedPayment: any;
   pay_on_pickup: string='0';
   pay_on_delivery: string='0';
   constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute) {
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
   paymentTypes:any = [
      { name: 'Online',  value: 'upi' ,img:'pi pi-credit-card'},
      { name: 'Wallet',  value: 'wallet' ,img:'pi pi-wallet'},
      { name: 'Cash',  value: 'cash',img:'pi pi-money-bill' }
    ];
    CashTypes:any = [
      { name: 'Pay On Pickup',  value: 'pickup' },
      { name: 'Pay On Drop',  value: 'drop' },
    
    ];
   ngOnInit(): void {
      this.fetchDeliveryTypeList();
      this.getfinancialYear()
      this.TimeSlot()
   }

   fetchDeliveryTypeList(): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      // payload.business_id = this.businessDetails.id;
      payload.vehicle_type_id = this.newOrder.vehicleType;
      this.apiService.getDeliveryType(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
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
         // If the distance is within the minimum, use only the base price for the distance.
         this.price = price.base_charges;
      } else {
         // If the distance exceeds the minimum:
         const minimumDistancePrice = Number(price.base_charges);
         const extraDistancePrice = (Number(value) - Number(price.minimum_km)) * Number(price.per_km_charge);
         this.price = minimumDistancePrice + extraDistancePrice;
      }
      return this.price
   }
   time(eta: any, opening_hr: any, closing_hr: any) {
      function toDateTime(timeStr: any) {
         const now = new Date();
         const [hours, minutes] = timeStr.split(':').map(Number);
         now.setHours(hours, minutes, 0, 0);
         return now;
      }
      console.log(opening_hr, opening_hr)
      const now = new Date();

      let openingTime = toDateTime(opening_hr);
      let closingTime = toDateTime(closing_hr);
      console.log(openingTime, closingTime)
      openingTime.setMinutes(openingTime.getMinutes());
      closingTime.setMinutes(closingTime.getMinutes());
      console.log(openingTime, closingTime)
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
      this.timeslot = value.time_slot
      // this.base_price=value.price.base_price

      this.selectedDeliveryType = value.id;
      console.log("dd", value)

   }
   paymentTypesSelection(value: any): void {
      this.selectedPaymentType = value.value;
      console.log("dd", value.value)

   }
   paymentType(event: any) {
      this.selectedPayment = event.target.innerText;
      console.log("dddd", this.selectedPayment)
      if(this.selectedPayment == 'Pay On Pickup'){
         this.pay_on_pickup = '1'
          this.pay_on_delivery='0'
         console.log(this.pay_on_pickup)
      }else{
         this.pay_on_delivery='1'
         this.pay_on_pickup = '0'
         console.log(this.pay_on_delivery)
      }
      console.log(this.pay_on_delivery,this.pay_on_pickup)
   }
   getlastinvoice() {
      try {
         this.apiService.last_invoice({ business_id: this.businessDetails.id }).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;
               this.listofInvoice = ApiResponse.data.order_no ? Number(ApiResponse.data.order_no) + 1 : Number(ApiResponse.data.id) + 1
               console.log(this.listofInvoice)
               if (this.listofInvoice) {
                  this.addInvoice(this.listofInvoice)
                  this.editDelivery(this.deliveryId)
               }

               else {
                  //   this.messageService.showError('Order Id Invalid', 'Error')
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

   onSlotChange(event: any): void {
      this.selectedSlot =event.value;
      console.log('Selected Delivery Type:', event);
    }
   addInvoice(order_id: any) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      let payload: any = {}
      payload.business_id = this.businessDetails.id
      payload.for_user_id = '171',
        payload.pay_on_pickup= this.pay_on_pickup ,
        payload.pay_on_delivery=this.pay_on_delivery,
    payload.for_booking_slot_id=Number(this.selectedSlot)
      payload.for_slot_id = this.timeslot
      payload.super_admin_id = environment.superAdminId
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
      payload.for_booking_date = formattedDate
      payload.drop_name = this.dropLocation.person_name
      payload.drop_mobile = this.dropLocation.person_phone_no
      payload.pickup_name = this.pickupLocation.person_name
      payload.pickup_mobile = this.pickupLocation.person_phone_no
      try {
         this.apiService.addInvoice(payload).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;
               console.log(data.status)
               if (data.status) {
                  this.listofInvoice = ApiResponse.data;
                  this.invoice_id = ApiResponse.data.id
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
                  // this.messageService.showError(data.msg, 'Error')
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
   selectedSlot(selectedSlot: any): any {
      throw new Error('Method not implemented.');
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
               let ApiResponse: any = data;
               // this.clearLocal()
               // this.addNotification()
               this.router.navigate(['/dashboard']);
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
     payload.delivery_type_id=this.selectedDeliveryType
      payload.order_value = this.sub_total
      payload.delivery_charges = this.sub_total
     payload.time_slot=this.timeslot
      payload.pickup_address_id = this.pickupLocation.id
      payload.drop_address_id = this.dropLocation.id
       payload.delivery_payment_status=this.selectedPaymentType
      payload.drop_person_name = this.dropLocation.person_name
      payload.drop_phone_no = this.dropLocation.person_phone_no
      payload.pickup_person_name = this.pickupLocation.person_name
      payload.pickup_phone_no = this.pickupLocation.person_phone_no
      payload.super_admin_id = environment.superAdminId
      payload.drop_address=this.dropLocation.address_details
      payload.pickup_address= this.pickupLocation.address_details

      // payload.user_id=
      try {
         this.apiService.edit_order_delivery_details(payload).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;
               // this.listofDelivery = ApiResponse.data;
               // this.clearLocal()
               // this.router.navigate(['/order-list']);

            },
            error: (error: any) => {
               console.log('Error fetching data', error);
            }
         });
      } catch (error) {
         console.log('Error in the catch block', error);
      }
   }




   addNotification() {
      let payload = {
         "user_id": 456,
         "super_admin_id": environment.superAdminId,
         "delivery_id": this.deliveryId,
         "invoice_id": this.invoice_id,
      }

      try {
         this.apiService.addNotification(payload).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;
               this.listofInvoice = ApiResponse.data.order_no ? Number(ApiResponse.data.order_no) + 1 : Number(ApiResponse.data.id) + 1
               console.log(this.listofInvoice)
               if (this.listofInvoice) {
                  this.addInvoice(this.listofInvoice)
                  this.editDelivery(this.deliveryId)
               }

               else {
                  //   this.messageService.showError('Order Id Invalid', 'Error')
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
