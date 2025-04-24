import { ChangeDetectorRef, Component, HostListener, NgZone } from '@angular/core';
import { CommonModule, LocationStrategy } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Select } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastNotificationService } from '../services/toast-notification.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ProgressBar } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Location } from '@angular/common';
import { Platform } from '@angular/cdk/platform';

@Component({
   selector: 'app-address-preview',
   standalone: true,
   imports: [CommonModule, ButtonModule, Select, SkeletonModule, CalendarModule, FormsModule, ToastModule, ConfirmDialog],
   templateUrl: './address-preview.component.html',
   styleUrls: ['./address-preview.component.css'],
   animations: [
      trigger('searching', [
         state('start', style({ transform: 'scale(1)' })),
         state('end', style({ transform: 'scale(1.2)' })),
         transition('start <=> end', animate('0.5s ease-in-out'))
      ])
   ]
})

export class AddressPreviewComponent {

   businessDetails: any;
   pickupLocation: any;
   dropLocation: any;
   newOrder: any;
   vehicleTypeList: any;
   loading: boolean = true;
   loading_button: any;
   deliveryList: any[] = [];
   times: any;
   sub_total: any;
   price: any;
   listofInvoice: number = 0;
   financial: any;
   invoice_id: any;
   listofDelivery: any;
   timeslot: any;
   selectedDeliveryType: any;
   selectedPaymentType: any = '138';
   deliveryId: any;
   timeSlot: any;
   selectedPayment: any;
   pay_on_pickup: any;
   pay_on_delivery: any;
   selectedSlot: any;
   order_status: any;
   selectedDate: string = '';
   formattedDate: string = ''
   minDate: Date | undefined;
   distance_value: any;
   distance_unit: any;
   userData: any;
   submitted = false;
   wallet: any = 0;
   riderloader: boolean = false;
   riderloaders: boolean = false;
   animationState = 'end';
   bill_status: string = '0';
   value: number = 0;
   orderComplete = false
   interval: any;
   ledger: any;
   private popStateListener: any;
   notificationTime: any;
   autoaccept: any;
   delivery_name: any;
   constructor(private locationStrategy: LocationStrategy, private platform: Platform, private location: Location, private messageService: MessageService, private cdr: ChangeDetectorRef, private apiService: ApiService, private router: Router, private confirmationService: ConfirmationService, private fb: FormBuilder, private route: ActivatedRoute, private toastService: ToastNotificationService, private ngZone: NgZone,) {
      this.pickupLocation = this.apiService.getLocalValueInJSON(localStorage.getItem('selectedPickup'));
      this.dropLocation = this.apiService.getLocalValueInJSON(localStorage.getItem('selectedDrop'));
      this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      this.newOrder = this.apiService.getLocalValueInJSON(localStorage.getItem('new-order'));
      this.userData = this.apiService.getLocalValueInJSON(localStorage.getItem('userData'));
      localStorage.setItem('orderComplete', 'false');
      this.route.params.subscribe((params) => {

         this.deliveryId = params['delivery_id'];
      });




      console.log(this.deliveryId)
      const parts = this.newOrder.distance.split(" ");
      this.distance_value = Math.round(parts[0]); // "5.4"
      this.distance_unit = parts[1];
      const currentDate = new Date();


      this.selectedDate = currentDate.toISOString().split('T')[0];
      this.formattedDate = this.formatDateToDDMMYYYY(this.selectedDate);
      this.minDate = currentDate;

      // console.log(this.formattedDate)
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
      { name: 'Online', value: 'online', img: 'pi pi-credit-card', disabled: true },
      { name: 'Wallet', value: 'wallet', img: 'pi pi-wallet', disabled: false },
      { name: 'Cash', value: 'cash', img: 'pi pi-money-bill', disabled: false }
   ];
   CashTypes: any = [
      { name: 'Cash at Pickup (CAP)', value: 'pickup' },
      { name: 'Cash on Delivery (COD)', value: 'drop' },

   ]

   @HostListener('window:popstate', ['$event'])

   onPopState(event: Event) {
      console.log('Back or Forward button clicked');
      this.confirm2(event) // Call the back action logic
   }
   @HostListener('window:beforeunload', ['$event'])
   onBeforeUnload(event: any) {
      console.log('App or browser is about to close');
      this.confirm2(event)
   }


   ngOnInit(): void {
      this.loading_button = false;
      this.cdr.detectChanges();
      console.log('s', this.loading_button)
      this.fetchDeliveryTypeList();
      this.getfinancialYear()
      this.getWalletAmount()
      this.TimeSlot()
      this.getledger()

   }


   setDefaultDate() {
      const currentDate = new Date();
      this.selectedDate = currentDate.toISOString().split('T')[0]; // Format: "yyyy-mm-dd"
      this.minDate = currentDate;

      this.formattedDate = this.formatDateToDDMMYYYY(this.selectedDate);
      console.log("hhwheqw", this.selectedDate, this.formattedDate)
      // console.log("Default Selected Date:", this.selectedDate);
   }
   onDateSelect(event: Date) {
      // const currentDate = new Date();

      // this.minDate = currentDate;
      // console.log(currentDate)
      const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
      const localDate = new Date(event.getTime() + istOffset); // Convert UTC to IST
      // this.minDa  te = localDate;
      this.selectedDate = localDate.toISOString().split('T')[0]; // Format as "yyyy-mm-dd"
      this.formattedDate = this.formatDateToDDMMYYYY(this.selectedDate);
      console.log("Selected Date (IST):", this.formattedDate);

      this.TimeSlot()
   }
   formatDateToDDMMYYYY(date: string): string {
      if (!date) return '';
      const [year, month, day] = date.split('-');  // date in yyyy-mm-dd format
      return `${day}-${month}-${year}`;  // Return in dd-mm-yyyy format
   }

   // onDateSelect(event: Date) {
   //    console.log(event)
   //    this.selectedDate = event.toISOString().split('T')[0]; // Convert selected date to "yyyy-mm-dd"
   //    console.log("Selected Date:", this.selectedDate);
   // }
   fetchDeliveryTypeList(): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      // payload.business_id = this.businessDetails.id;
      payload.vehicle_type_id = this.newOrder.vehicle_type_id;
      this.apiService.getDeliveryType(payload).subscribe({
         next: (response) => {
            this.deliveryList = response.data
            if (response.status === true) {

               this.order_status = response.data[0].order_status_id
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
               const firstPickupDelivery = this.deliveryList.find(delivery => delivery.pickup === true);
               // ✅ Set `selectedDeliveryType` accordingly
               this.selectedDeliveryType = firstPickupDelivery ? firstPickupDelivery.id : this.deliveryList[0]?.id;
               this.sub_total = firstPickupDelivery ? firstPickupDelivery.price : this.deliveryList[0]?.price;
               // this.selectedDeliveryType = this.deliveryList[0].id;
               this.sub_total = this.deliveryList[0].price
               console.log(this.deliveryList)

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
            const currentDate = new Date();
            // this.selectedDate = currentDate.toISOString().split('T')[0]; // Format: "yyyy-mm-dd"

            // this.minDate = currentDate;
            if (response.status) {
               let timeSlots = response.data; // All time slots
               const currentTime = new Date();
               const today = currentTime.toISOString().split('T')[0]; // Format: YYYY-MM-DD
               const scheduleDate = this.selectedDate; // Assume this is in YYYY-MM-DD format


               if (scheduleDate == today) {
                  const currentHour = currentTime.getHours();
                  const currentMinute = currentTime.getMinutes();

                  timeSlots = timeSlots.filter((slot: { start_time: { split: (arg0: string) => { (): any; new(): any; map: { (arg0: NumberConstructor): [any, any]; new(): any; }; }; }; }) => {
                     const [slotHour, slotMinute] = slot.start_time.split(':').map(Number);
                     return slotHour > currentHour || (slotHour === currentHour && slotMinute > currentMinute);
                  });

               }

               // Sort time slots in ascending order
               timeSlots.sort((a: { start_time: string; }, b: { start_time: any; }) => a.start_time.localeCompare(b.start_time));

               this.timeSlot = timeSlots;
               this.formattedDate = this.formatDateToDDMMYYYY(scheduleDate);
               // this.setDefaultDate();
            } else {
               console.error('Error fetching time slots:', response.message);
            }
            // if (response.status === true) {
            //    // this.timeSlot = response.data; // All time slots


            //    this.setDefaultDate();
            // } else {
            //    console.error('Error fetching time slots:', response.message);
            // }
         },
         error: (err) => {
            console.error('Error fetching vehicle types:', err);
         },
         complete: () => {
            this.loading = false;
         },
      });
   }
   getWalletAmount(): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      payload.user_id = this.userData.id;
      // payload.vehicle_type_id = this.newOrder.vehicleType;
      this.apiService.get_wallet_amount(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.wallet = response?.data?.total_balance; // All time slots



            } else {
               this.wallet = 0;
               console.error('Error fetching time slots:', response.message);
            }
         },
         error: (err) => {
            console.error('Error fetching vehicle types:', err);
         },
         complete: () => {
            this.loading = false;
            localStorage.setItem('wallet', JSON.stringify(this.wallet));
         },
      });
   }
   calculatePrice(price: any): any {
      const parts = this.newOrder.distance.split(" ");
      this.distance_value = Math.round(parts[0]); // "5.4"
      this.distance_unit = parts[1];
      if (this.distance_value <= price.minimum_km) {
         console.log("base", price.base_charges, this.distance_value <= price.minimum_km, this.distance_value)
         // If the distance is within the minimum, use only the base price for the distance.
         this.price = Math.abs(price.base_charges);
      } else {

         // If the distance exceeds the minimum:
         console.log("based", price.base_charges, this.distance_value <= price.minimum_km, this.newOrder.distance, price.minimum_km, this.distance_value)
         const minimumDistancePrice = Number(price.base_charges);
         const extraDistancePrice = (Number(this.distance_value) - Number(price.minimum_km)) * Number(price.per_km_charge);
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
   getledger() {
      try {
         this.apiService.getLedger({ business_id:  environment.business_id }).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;
               this.ledger = ApiResponse.data;

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
      this.order_status = value.order_status_id
      this.timeslot = value.time_slot
      this.autoaccept = value.auto_accepted_id
      this.delivery_name = value.delivery_name
      // this.base_price=value.price.base_price
      console.log(value.id, 'order-status')
      this.selectedDeliveryType = value.id;
      // if (value.id == 43 || value.id == '40') {
      //    console.log(value.id, 'selectedPaymentType')
      //    this.paymentTypesSelection('138')
      //    console.log(value.id, 'selectedPaymentType')
      // }
      if (value.auto_accepted_id == 1) {
         console.log(value.id, 'selectedPaymentType')
         this.paymentTypesSelection('138')
         console.log(value.id, 'selectedPaymentType')
      }


   }
   paymentTypesSelection(value: any): void {
      console.log(value)
      if (value.value == 'online') {
         this.toastService.showError("This service is not working yet")
      } else if (value.value == '138') {

      }
      this.selectedPaymentType = value;




   }
   deduct_wallet_amount(): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      payload.user_id = this.userData.id;
      payload.amount = this.sub_total;
      // payload.vehicle_type_id = this.newOrder.vehicleType;
      this.apiService.deduct_wallet_amount(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               // this.timeSlot = response.data; // All time slots
               this.bill_status = '1';

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
   add_wallet_amount(): void {
      let payload: any = {};
      payload.super_admin_id = environment.superAdminId;
      payload.user_id = this.userData.id;
      payload.amount = this.sub_total;
      // payload.vehicle_type_id = this.newOrder.vehicleType;
      this.apiService.add_wallet_amount(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               // this.timeSlot = response.data; // All time slots
               this.bill_status = '0';

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
   paymentType(event: any) {
      this.selectedPayment = event.target.innerText;

      if (this.selectedPayment == 'Cash at Pickup (CAP)') {
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
      this.submitted = true
      console.log(this.loading_button)
      if (this.loading_button) return; // Prevent multiple clicks while loading

      this.loading_button = true; // Disable button immediately
      if (this.wallet < this.sub_total && this.selectedPaymentType == '138') {
         // this.toastService.showError("Insufficient balance")
         this.loading_button = false;
         this.cdr.detectChanges();
         return;
      }
      if (this.timeslot == '1' && !this.selectedSlot) {

         // this.toastService.showError("Please select time slot")
         this.loading_button = false;
         this.cdr.detectChanges();
         return;
      } if (this.timeslot == '1' && !this.selectedDate) {

         // this.toastService.showError("Please select delivery date")
         this.loading_button = false;
         this.cdr.detectChanges();
         return;
      }

      if (!this.selectedPaymentType) {
         // this.toastService.showError("Please select payment mode")
         this.loading_button = false;
         this.cdr.detectChanges();
         return;
      }
      if (this.selectedPaymentType == '139' && !this.selectedPayment) {

         // this.toastService.showError("Please select payment location")
         this.loading_button = false;
         this.cdr.detectChanges();
         return;
      }
      else if (!this.selectedDeliveryType) {
         // this.toastService.showError("Please select Delivery Type")
         this.loading_button = false;
         this.cdr.detectChanges();
         return;
      }

      this.ngZone.runOutsideAngular(() => {
         this.interval = setInterval(() => {
            this.ngZone.run(() => {
               this.value = this.value + Math.floor(Math.random() * 10) + 1;
               if (this.value >= 50) {
                  this.value = 100;
                  // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Process Completed' });
                  clearInterval(this.interval);
               }
            });
         }, 200);
      });
      try {
         this.riderloader = true;
         this.apiService.last_invoice({ business_id:  environment.business_id }).subscribe({
            next: (data: any) => {
               // this.loading_button = true;
               let ApiResponse: any = data;
               this.listofInvoice = ApiResponse.data.order_no ? Number(ApiResponse.data.order_no) + 1 : Number(ApiResponse.data.id) + 1
               console.log(this.listofInvoice, this.selectedDeliveryType)
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
      console.log(this.timeSlot, 'slot');
      this.selectedSlot = event.value;
      const selectedSlotData = this.timeSlot.find((slot: any) => slot.id === this.selectedSlot);

      if (selectedSlotData && selectedSlotData.start_time) {
         const timeParts = selectedSlotData.start_time.split(':');
         let hour = parseInt(timeParts[0], 10);
         let minute = timeParts[1] ? parseInt(timeParts[1], 10) : 0;

         if (!isNaN(hour) && !isNaN(minute)) {
            // Subtract 1 hour and wrap around
            let adjustedHour = (hour - 1 + 24) % 24;

            // Format to 12-hour format with leading zero for minutes if needed
            let period = adjustedHour >= 12 ? 'PM' : 'AM';
            let hour12 = adjustedHour % 12 === 0 ? 12 : adjustedHour % 12;
            let formattedMinutes = minute.toString().padStart(2, '0');

            this.notificationTime = `${hour12}:${formattedMinutes} ${period}`;
            console.log(this.notificationTime, 'notificationTime');
         } else {
            console.error('Invalid start_time format');
            this.notificationTime = 'Invalid Time';
         }
      } else {
         console.error('No matching slot found or start_time is missing');
         this.notificationTime = 'Invalid Time';
      }

      this.formattedDate = this.formatDateToDDMMYYYY(this.selectedDate);
      console.log('Selected Delivery Type:', this.formattedDate);
   }

   // onSlotChange(event: any): void {
   //    console.log(this.timeSlot, 'slot')
   //    this.selectedSlot = event.value;
   //    const selectedSlotData = this.timeSlot.find((slot: any) => slot.id === this.selectedSlot);

   //    if (selectedSlotData && selectedSlotData.start_time) {
   //       // Validate and parse the opening time to a number
   //       let openingTime = parseInt(selectedSlotData.start_time, 10);

   //       // Check if openingTime is a valid number
   //       if (!isNaN(openingTime)) {
   //          // Subtract 1 hour and handle negative time correctly (24-hour wrapping)
   //          let notificationTime = (openingTime - 1 + 24) % 24;

   //          // Convert to 12-hour format
   //          let period = notificationTime >= 12 ? 'PM' : 'AM';
   //          let formattedTime =
   //             notificationTime === 0
   //                ? `12 AM` // Handle midnight (0 as 12 AM)
   //                : notificationTime === 12
   //                   ? `12 PM` // Handle noon (12 as 12 PM)
   //                   : `${notificationTime % 12 === 0 ? 12 : notificationTime % 12} ${period}`;

   //          this.notificationTime = formattedTime;
   //          console.log(this.notificationTime, 'notificationTime');
   //       } else {
   //          console.error('Invalid opening_hours format');
   //          this.notificationTime = 'Invalid Time';
   //       }
   //    } else {
   //       console.error('No matching slot found or opening_hours is missing');
   //       this.notificationTime = 'Invalid Time';
   //    }
   //    this.formattedDate = this.formatDateToDDMMYYYY(this.selectedDate);
   //    console.log('Selected Delivery Type:', this.formattedDate);
   // }
   addInvoice(order_id: any) {

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const formattedTime = currentDate.getHours().toString().padStart(2, '0') + ":" +
         currentDate.getMinutes().toString().padStart(2, '0');
      let payload: any = {}
      payload.business_id =  environment.business_id
      // payload.business_id = this.businessDetails ? this.businessDetails.id : null
      // payload.for_business_id = this.businessDetails ? this.businessDetails.id : this.userData.id
      if (this.businessDetails && this.businessDetails.id) {
         payload.for_business_id = this.businessDetails ? this.businessDetails.id : null
      } else {
         payload.for_user_id = this.userData.id
      }
      payload.for_user_id = this.userData.id,
         payload.order_status_id = this.order_status
      payload.pay_on_pickup = this.pay_on_pickup,
         payload.pay_on_delivery = this.pay_on_delivery,
         payload.for_booking_slot_id = Number(this.selectedSlot)
      payload.for_slot_id = this.timeslot
      payload.super_admin_id = environment?.superAdminId
      payload.delivery_id = this.deliveryId
      // payload.end_time = this.deliveryId
      // payload.start_time = this.deliveryId
      payload.for_booking_time = formattedTime
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
      payload.for_booking_date = this.selectedDeliveryType == '42' ? this.selectedDate : formattedDate
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
                  console.log('i', this.loading_button)
                  // this.listofInvoice = ApiResponse.data;
                  this.invoice_id = ApiResponse?.data?.id

                  if (this.selectedPaymentType == '138') {
                     this.deduct_wallet_amount()
                  }
                  if (this.selectedPaymentType == '138') {
                     this.bill_status = '1'
                  } else {
                     this.bill_status = '0'
                  }
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

   editInvoice() {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      let payload: any = {}

      payload.business_id =  environment.business_id
      // payload.business_id = this.businessDetails ? this.businessDetails.id : null
      if (this.businessDetails && this.businessDetails.id) {
         payload.for_business_id = this.businessDetails ? this.businessDetails.id : null
      } else {
         payload.for_user_id = this.userData.id
      }
      // payload.for_business_id = this.businessDetails ? this.businessDetails.id : this.userData.id

      payload.for_user_id = this.userData.id,
         payload.order_status_id = this.order_status
      // payload.pay_on_pickup = this.pay_on_pickup,
      // payload.pay_on_delivery = this.pay_on_delivery,
      // payload.for_booking_slot_id = Number(this.selectedSlot)
      // payload.for_slot_id = this.timeslot
      payload.super_admin_id = environment?.superAdminId
      payload.delivery_id = this.deliveryId
      // payload.end_time = this.deliveryId
      // payload.start_time = this.deliveryId
      // payload.for_booking_time=
      payload.invoice_id = this.invoice_id
      payload.prefix_value = 'ORDER'
      payload.invoice_type = 'order'
      payload.financial_year_id = this.financial
      payload.subtotal = this.sub_total
      // payload.order_no = order_id
      payload.total_tax = 0
      payload.bill_status = this.bill_status;
      payload.adjustment_value = 0
      payload.grand_total = this.sub_total
      payload.for_date = formattedDate
      payload.delivery_id = this.deliveryId
      payload.created_on_date = formattedDate
      // payload.for_booking_date = this.selectedDate
      // payload.drop_name = this.dropLocation.person_name
      // payload.drop_mobile = this.dropLocation?.person_phone_no
      // payload.pickup_name = this.pickupLocation?.person_name
      // payload.pickup_mobile = this.pickupLocation?.person_phone_no
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
   addTransaction(id: any) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      let payload: any = {}
      payload.business_id = environment.business_id
      // payload.user_id = this.userData.id;
      // payload.business_id = this.businessDetails ? this.businessDetails.id : 983
      payload.pay_to_uid = this.userData.id
      payload.invoice_id = id
      payload.dr_amount = this.sub_total
      payload.amount = this.sub_total
      payload.super_admin_id = environment.superAdminId
      payload.created_on_date = formattedDate
      payload.payment_date = formattedDate
      payload.pay_for_ledger = this.selectedPaymentType
      try {
         this.apiService.addTransaction(payload).subscribe({
            next: (data: any) => {
               // this.loading_button = true;
               console.log('i', this.loading_button)
               let ApiResponse: any = data;

               // this.clearLocal()
               // this.addNotification()
               if (data.status) {
                  if (this.selectedPaymentType == '138') {
                     this.bill_status = '1'
                  } else {
                     this.bill_status = '0'
                  }
                  // this.router.navigate(['/dashboard']);
                  this.editInvoice()






                  // this.toastService.showSuccess("Order Placed Successfully")
               }
               else {
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
   creaditTransaction(id: any) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      let payload: any = {}
      payload.pay_to_uid = this.userData.id
      payload.business_id = environment.business_id
      // payload.business_id = this.businessDetails ? this.businessDetails.id : null
      // payload.for_user_id=this.userId ? this.userId : this.default
      payload.invoice_id = id
      payload.cr_amont = this.sub_total
      payload.amount = this.sub_total
      payload.super_admin_id = environment.superAdminId
      payload.created_on_date = formattedDate
      payload.payment_date = formattedDate
      payload.pay_for_ledger = this.selectedPaymentType
      try {
         this.apiService.addTransaction(payload).subscribe({
            next: (data: any) => {
               // this.loading_button = true;
               if (this.selectedPaymentType == '138') {
                  this.bill_status = '1'
               } else {
                  this.bill_status = '0'
               }

               let ApiResponse: any = data;
               // this.clearLocal()
               // this.addNotification()
               if (data.status) {
                  this.editInvoice()
                  // this.router.navigate(['/dashboard']);



                  // this.toastService.showSuccess("Order Placed Successfully")
               }
               else {
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
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const formattedTime = currentDate.getHours().toString().padStart(2, '0') + ":" +
         currentDate.getMinutes().toString().padStart(2, '0');
      let payload: any = {}
      payload.business_id =  environment.business_id
      if (this.businessDetails && this.businessDetails.id) {
         payload.for_business_id = this.businessDetails ? this.businessDetails.id : null
      } else {
         payload.for_user_id = this.userData.id
      }      // payload.business_id = this.businessDetails ? this.businessDetails.id : null
      payload.order_delivery_details_id = id
      payload.status = 1
      payload.order_status_id = this.order_status
      payload.delivery_type_id = this.selectedDeliveryType
      payload.order_value = this.sub_total
      payload.delivery_charges = this.sub_total
      payload.time_slot = this.timeslot
      payload.for_booking_time = formattedTime
      payload.pickup_address_id = this.pickupLocation.id
      payload.drop_address_id = this.dropLocation.id
      // payload.delivery_payment_status = this.selectedPaymentType
      payload.delivery_payment_status = this.bill_status
      payload.drop_person_name = this.dropLocation.person_name
      payload.drop_phone_no = this.dropLocation.person_phone_no
      payload.pickup_person_name = this.pickupLocation.person_name
      payload.pickup_phone_no = this.pickupLocation.person_phone_no
      payload.super_admin_id = environment.superAdminId
      payload.drop_address = this.dropLocation.address_details
      payload.pickup_address = this.pickupLocation.address_details
      payload.parcel_weight = this.listofInvoice
      payload.invoice_id = this.invoice_id ? this.invoice_id : 0
      payload.bill_status = this.bill_status;
      // payload.pay_on = this.selectedPaymentType

      payload.pay_on = this.selectedPayment ? this.selectedPayment : 'Wallet'
      payload.time_slot_id = Number(this.selectedSlot)
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

      payload.business_id = environment.business_id


      if (this.businessDetails && this.businessDetails.id) {
         payload.for_business_id = this.businessDetails ? this.businessDetails.id : null
      } else {
         payload.for_user_id = this.userData.id
      }

      payload.order_delivery_details_id = id
      payload.status = 1
      payload.for_booking_slot_id = Number(this.selectedSlot)
      payload.order_status_id = this.order_status
      payload.delivery_type_id = this.selectedDeliveryType
      payload.order_value = this.sub_total
      payload.delivery_charges = this.sub_total
      payload.time_slot = this.timeslot
      payload.bill_status = this.bill_status;
      payload.pickup_address_id = this.pickupLocation.id
      payload.drop_address_id = this.dropLocation.id
      // payload.delivery_payment_status = this.selectedPaymentType
      payload.delivery_payment_status = this.bill_status
      payload.drop_person_name = this.dropLocation.person_name
      payload.drop_phone_no = this.dropLocation.person_phone_no
      payload.pickup_person_name = this.pickupLocation.person_name
      payload.pickup_phone_no = this.pickupLocation.person_phone_no
      payload.super_admin_id = environment.superAdminId
      payload.drop_address = this.dropLocation.address_details
      payload.pickup_address = this.pickupLocation.address_details
      payload.parcel_weight = this.listofInvoice
      payload.invoice_id = this.invoice_id ? this.invoice_id : 0
      payload.time_slot_id = Number(this.selectedSlot)
      // payload.pay_on = this.selectedPayment ? 'Wallet' : this.selectedPaymentType
      payload.pay_on = this.selectedPayment ? this.selectedPayment : 'Wallet'
      // payload.user_id=
      try {
         this.apiService.edit_order_delivery_details(payload).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;

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
      if (!this.invoice_id) {
         console.log("nf", this.invoice_id)
         this.toastService.showSuccess('Your Order is Successfully Cancelled');
         return;
      } else {
         console.log("f", this.invoice_id)
      }
      let payload: any = {
         // "user_id": environment.riderId,
         // "super_admin_id": environment.superAdminId,
         // "authToken": localStorage.getItem('authToken'),
         "delivery_id": this.deliveryId,
         "invoice_id": String(this.invoice_id),
         'delivery_type_id': this.selectedDeliveryType,
         "vehicle_type_id": this.newOrder?.vehicle_type_id,

         'notification_timing': '',
         "details": {
            'delivery_type': this.selectedDeliveryType,
            "distance": this.newOrder?.distance,
            'pickup_address': this.pickupLocation?.address_details,
            'order_status': this.order_status,

         },
         "pickup_location": {
            "longitude": Number(this.pickupLocation.long_val),
            "latitude": Number(this.pickupLocation.lat_val)
         }
      }
      // if (this.selectedDeliveryType == '46') {
      if (this.timeslot == 1) {
         payload.notification_timing = this.notificationTime + "," + this.formattedDate
      }
      console.log(typeof (payload.pickup_location.latitude))
      try {

         this.apiService.addNotification(payload).subscribe({
            next: (data: any) => {

               if (data.status) {

                  console.log("api call3")

                  // this.loading_button = true;
                  this.riderloader = true;
                  if (this.autoaccept == 0) {
                     // if (this.selectedDeliveryType == '43' || this.selectedDeliveryType == '40') {
                     console.log("api call2")
                     // this.getDeliveryDetail()
                     this.startDeliveryCheck()
                     this.animationState = 'end'
                     setInterval(() => {
                        this.animationState = this.animationState === 'start' ? 'end' : 'start';
                     }, 500);




                  }

                  // else if (this.selectedDeliveryType == '45') {
                  else if (this.autoaccept == 1) {
                     this.confirmationService.confirm({
                        message: `Thank Your Order Placed Successfully and will be delivered soon under ${this.delivery_name} Delivery !`,
                        header: 'Thank You!',
                        icon: 'pi pi-check-circle',
                        acceptLabel: 'OK',
                        rejectVisible: false, // Hides the "No" button
                        accept: () => {
                           console.log('Thank you message displayed');
                           localStorage.setItem('orderComplete', 'true');
                           this.orderComplete = true
                           this.confirmationService.close();
                        }

                     });
                     this.clearLocal()

                  }
                  // else if (this.selectedDeliveryType == '42') {

                  //    this.confirmationService.confirm({
                  //       message: 'Thank Your Order Placed Successfully and will be delivered soon as per Schedule!',
                  //       header: 'Thank You!',
                  //       icon: 'pi pi-check-circle',
                  //       acceptLabel: 'OK',
                  //       rejectVisible: false, // Hides the "No" button
                  //       accept: () => {
                  //          console.log('Thank you message displayed');
                  //          localStorage.setItem('orderComplete', 'true');
                  //          this.orderComplete = true
                  //          this.confirmationService.close();
                  //       }

                  //    });
                  //    this.clearLocal()
                  // }
                  else {
                     // this.ngZone.runOutsideAngular(() => {
                     //    this.interval = setInterval(() => {
                     //       this.ngZone.run(() => {
                     //          this.value = this.value + Math.floor(Math.random() * 10) + 1;
                     //          if (this.value >= 100) {
                     //             this.value = 100;
                     //             // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Process Completed' });
                     //             clearInterval(this.interval);
                     //          }
                     //       });
                     //    }, 200);
                     // });
                     // setTimeout(() => {

                     this.confirmationService.confirm({
                        message: `Thank Your Order Placed Successfully and will be delivered soon under ${this.delivery_name} Delivery !`,
                        header: 'Thank You!',
                        icon: 'pi pi-check-circle',
                        acceptLabel: 'OK',
                        rejectVisible: false, // Hides the "No" button
                        accept: () => {
                           console.log('Thank you message displayed');
                           localStorage.setItem('orderComplete', 'true');
                           this.orderComplete = true
                        }

                     });
                     // }, 45000); // 45 seconds delay
                     this.clearLocal()
                  }
               }
               else {
                  this.riderloader = true;


                  console.log(this.selectedDeliveryType, "rider")

                  // if (this.selectedDeliveryType == '43' || this.selectedDeliveryType == '40') {
                  if (this.autoaccept == 0) {
                     // this.startDeliveryCheck()
                     setTimeout(() => {


                        this.order_status = 35,
                           this.confirmationService.confirm({
                              message: 'No Rider is Available at your Locations please try Standard or Schedule Delivery!',
                              header: 'Sorry!',
                              icon: 'pi pi-times-circle',
                              acceptLabel: 'OK',
                              rejectVisible: false, // Hides the "No" button

                              accept: () => {
                                 console.log('Thank you message displayed Express');
                                 this.confirmationService.close();
                                 if (this.selectedPaymentType == '138') {
                                    this.add_wallet_amount()
                                 }
                                 this.creaditTransaction(this.invoice_id)

                                 console.log("cancel", this.wallet)
                                 this.getWalletAmount()
                                 // this.order_status = 25
                                 this.editDeliveries(this.deliveryId)
                                 this.orderComplete = true
                                 localStorage.removeItem('selectedPickup');
                                 localStorage.removeItem('selectedDrop');
                                 localStorage.removeItem('new-order');
                                 localStorage.setItem('dashboardLoaded', 'false');
                                 this.riderloaders = false;
                                 // setTimeout(() => {
                                 this.router.navigate(['/dashboard']);
                                 localStorage.setItem('orderComplete', 'true');
                                 // }, 3000);
                                 return;

                                 // this.cancel()
                                 // this.noorder()
                                 this.loading_button = false;
                                 // this.router.navigate(['/dashboard']);
                              }

                           }

                           );
                     }, 60000);

                     // I have added this temproray code to check the rider is available or not in standarad as because we were getting status false for temporary server.
                  }

                  else if (this.autoaccept == 1) {
                     this.confirmationService.confirm({
                        message: `Thank Your Order Placed Successfully and will be delivered soon under ${this.delivery_name} Delivery!`,
                        header: 'Thank You!',
                        icon: 'pi pi-check-circle',
                        acceptLabel: 'OK',
                        rejectVisible: false, // Hides the "No" button
                        accept: () => {
                           this.orderComplete = true
                           localStorage.setItem('orderComplete', 'true');
                           console.log('Thank you message displayed');
                           this.confirmationService.close();
                        }

                     });
                     this.clearLocal()

                  } else {
                     this.loading_button = false;

                     this.confirmationService.confirm({
                        message: 'No Rider is Available at your Locations please try Standard or Schedule Delivery',
                        header: 'Sorry!',
                        icon: 'pi pi-times-circle',
                        // styleClass: 'custom-confirm-dialog', // Custom class for styling

                        acceptLabel: 'OK',
                        rejectVisible: false, // Hides the "No" button
                        accept: () => {
                           this.orderComplete = true

                           console.log('Thank you message displayed');
                           this.confirmationService.close();
                        }

                     });
                     this.cancel()
                     if (this.selectedPaymentType == '138') {
                        this.add_wallet_amount()
                     }
                     this.creaditTransaction(this.invoice_id)
                     this.editInvoice()
                     // this.clearLocal()
                     this.loading_button = false;
                     localStorage.setItem('orderComplete', 'true');
                  }
                  // else if (this.selectedDeliveryType == '42') {
                  //    this.confirmationService.confirm({
                  //       message: 'Thank Your Order Placed Successfully and will be delivered soon as per Schedule!',
                  //       header: 'Thank You!',
                  //       icon: 'pi pi-check-circle',
                  //       acceptLabel: 'OK',
                  //       rejectVisible: false,
                  //       accept: () => {
                  //          this.orderComplete = true
                  //          localStorage.setItem('orderComplete', 'true');
                  //          console.log('Thank you message displayed');
                  //          this.orderComplete = true
                  //          this.confirmationService.close();
                  //       }

                  //    });
                  //    this.clearLocal()
                  // }
               }
               this.loading_button = false;
            },
            error: (error: any) => {
               console.log('Error fetching data', error);
               this.loading_button = false;

               this.confirmationService.confirm({
                  message: 'No Rider is Available at your Locations please try Standard or Schedule Delivery',
                  header: 'Sorry!',
                  icon: 'pi pi-times-circle',
                  // styleClass: 'custom-confirm-dialog', // Custom class for styling

                  acceptLabel: 'OK',
                  rejectVisible: false, // Hides the "No" button
                  accept: () => {
                     this.orderComplete = true

                     console.log('Thank you message displayed');
                     this.confirmationService.close();
                  }

               });
               this.cancel()
               if (this.selectedPaymentType == '138') {
                  this.add_wallet_amount()
               }
               this.creaditTransaction(this.invoice_id)
               this.editInvoice()
               // this.clearLocal()
               this.loading_button = false;
               localStorage.setItem('orderComplete', 'true');
            }

         });
      } catch (error) {
         console.log('Error in the catch block', error);
      }
      this.getWalletAmount()
   }

   startDeliveryCheck() {
      let elapsedTime = 0; // Track time elapsed
      const intervalId = setInterval(() => {
         elapsedTime += 7; // Increase elapsed time by 7 sec
         if (this.order_status != '33') {

            return;
         }
         else if (elapsedTime >= 60) {
            console.log("time end")
            clearInterval(intervalId);
            // Stop after 1 min
            console.log('API calls stopped after 1 minute');

            this.confirmationService.confirm({
               message: 'No Rider is Available at your Locations please try Standard or Schedule Delivery',
               header: 'Sorry!',
               icon: 'pi pi-times-circle',
               acceptLabel: 'OK',
               // style: 'custom-confirm-dialog', // Custom class for styling

               rejectVisible: false, // Hides the "No" button
               accept: () => {

                  console.log('Thank you message displayed Else');
                  this.confirmationService.close();
               }

            });
            this.order_status = 35
            this.cancel()
            if (this.selectedPaymentType == '138') {
               this.add_wallet_amount()
            }

            this.creaditTransaction(this.invoice_id)
            // this.clearLocal()
            this.loading_button = false;

            this.editInvoice()
            this.orderComplete = true
            localStorage.setItem('orderComplete', 'true');
            return;
         }

         this.getDeliveryDetail(); // Call API every 7 sec
      }, 7000); // 7 sec interval

   }
   getDeliveryDetail() {
      this.cdr.detectChanges();
      let payload = { order_delivery_details_id: this.deliveryId, super_admin_id: environment.superAdminId }
      try {
         this.apiService.getOrderDeliveryDetail(payload).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data;
               this.order_status = data.data.order_status_id
               this.riderloader = true;
               this.animationState = 'end'
               // setInterval(() => {
               //    this.confirmationService.confirm({
               //       message: 'Searching Rider',

               //       icon: 'pi pi-check-circle',


               //       accept: () => {
               //          console.log('Thank you message displayed');
               //       }

               //    });
               //    // this.animationState = this.animationState === 'start' ? 'end' : 'start';
               // }, 500);
               // if (this.selectedDeliveryType == '43' || this.selectedDeliveryType == '40') {
               if (this.autoaccept == '0') {
                  if (this.order_status != '33') {
                     console.log("order")
                     this.confirmationService.confirm({
                        message: 'Thank Your Order Placed Successfully!',
                        header: 'Thank You!',
                        icon: 'pi pi-check-circle',
                        acceptLabel: 'OK',
                        rejectVisible: false, // Hides the "No" button
                        accept: () => {
                           this.orderComplete = true
                           console.log('Thank you message displayed');
                           this.orderComplete = true
                           localStorage.setItem('orderComplete', 'true');
                        }

                     });
                     this.clearLocal()

                     this.animationState = 'end';
                     this.riderloader = false;
                     return
                  } else {

                  }

               }
               // setTimeout(() => {
               //    console.log("api call")
               //    this.getDeliveryDetail();
               //    // Recursive call
               // }, 7000); // 10 seconds


               // const intervalId = setInterval(() => {
               //    // this.animationState = this.animationState === 'start' ? 'end' : 'start';
               //    this.getDeliveryDetail();  // Calls API every 10 sec
               // }, 10000); // 10 sec interval

               // // Stop API calls after 1 minute
               // setTimeout(() => {
               //    clearInterval(intervalId); // Stops further calls
               //    return;
               //    console.log('API calls stopped after 1 minute');
               // }, 30000);

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
   cancels() {
      // this.riderloader = false;
      this.bill_status = '0'
      this.order_status = 35
      if (this.selectedPaymentType == '138') {
         this.add_wallet_amount()
      }
      this.creaditTransaction(this.invoice_id)
      this.editInvoice()
      // this.clearLocal()
      this.loading_button = false;
      this.cancel()


   }
   cancel() {
      console.log("cancel", this.wallet)
      this.getWalletAmount()
      // this.order_status = 25
      this.editDeliveries(this.deliveryId)

      localStorage.removeItem('selectedPickup');
      localStorage.removeItem('selectedDrop');
      localStorage.removeItem('new-order');
      localStorage.setItem('dashboardLoaded', 'false');
      this.riderloaders = false;
      // setTimeout(() => {
      this.router.navigate(['/dashboard']);
      // }, 3000);
      return;

   }
   noorder() {
      this.getWalletAmount()
      // this.order_status = 25
      this.editDeliveries(this.deliveryId)
      this.riderloaders = false;
   }
   clearLocal() {

      localStorage.removeItem('selectedPickup');
      localStorage.removeItem('selectedDrop');
      localStorage.removeItem('new-order');
      this.riderloaders = false;
      setTimeout(() => {
         this.router.navigate(['/dashboard']);
      }, 3000);
      return;

   }
   confirm2(event: Event) {

      console.log(event)
      this.confirmationService.confirm({
         // target: event.target as EventTarget,
         message: 'Do you want to cancel this order?',
         header: ' ',
         icon: 'pi pi-info-circle',
         rejectLabel: 'Cancel',
         closable: false,
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
            this.confirmationService.close();
            // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
         },
         reject: () => {
            this.confirmationService.close();
         },
      });
   }
   coupan() {
      this.router.navigate(['/list-of-coupan']);

   }

}
