import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';  // Import the CalendarModule
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // Import FormsModule for ngModel
import { ApiService } from '../services/api.service';
import { ToastNotificationService } from '../services/toast-notification.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { SearchComponent } from '../search/search.component';

@Component({
   selector: 'app-new-customer',
   standalone: true,  // Mark this component as standalone
   imports: [SearchComponent, InputTextModule, ButtonModule, CalendarModule, FormsModule, ButtonModule, CardModule, CommonModule, SkeletonModule, FormsModule,
      ReactiveFormsModule],  // Add CalendarModule and FormsModule
   templateUrl: './new-customer.component.html',
   styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent {
   dob: Date | null = null;  // The variable to bind the calendar component

   isLoading: boolean = false;
   businessDetail: any;
   userId: any;
   isSearched: any;
   listofCustomer: any;
   id: any;
   profileForm: any;
   business: boolean = false;
   constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder, private toastService: ToastNotificationService,) {
      this.businessDetail = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      // this.route.params.subscribe((params) => {
      //   this.userId = params['user_id'];

      // });
   }

   ngOnInit(): void {
      // Initialize the form group with controls
      this.profileForm = this.fb.group({
         first_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],

         email: ['', [Validators.required, Validators.email]],
         phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10), Validators.minLength(10)]],
         date_of_birth: ['',],

      });
   }

   onSubmit() {
      console.log(this.userId, this.business)
      if (this.userId) {
         if (!this.business) {
            this.addRole(this.userId)
         } else {
            this.editCustomer(this.profileForm.value)
         }

      } else {
         this.addCustomer(this.profileForm.value)
      }
   }

   addCustomer(form: any) {
      console.log(form)
      form.business_id = this.businessDetail.id
      form.user_type = 4
      this.isLoading = true;
      this.apiService.add_user(form).subscribe({
         next: (data: any) => {
            this.isLoading = false;
            if (data.status) {
               this.userId = data.id
               this.toastService.showSuccess(data.msg)
               this.addRole(data.data.id)
            } else {
               this.toastService.showError(data.msg)
            }
            console.log(data)


         },
         error: (error: any) => {

            console.log(error);
         }
      })
   }
   editCustomer(form: any) {

      form.business_id = this.businessDetail.id

      form.user_id = this.userId


      this.isLoading = true;
      this.apiService.edit_user(form).subscribe({
         next: (data: any) => {
            this.isLoading = false;
            if (data.status) {
               this.userId = data.id
               this.toastService.showSuccess(data.msg)

            } else {
               this.toastService.showError(data.msg)
            }
            console.log(data)


         },
         error: (error: any) => {

            console.log(error);
         }
      })
   }
   userSearched(event: any) {
      this.isSearched = event
      console.log(event)
   }
   handleUserSelected(user: any) {
      console.log(user)
      if (user) {
         this.userId = user.id
         this.profileForm.patchValue({
            first_name: user.first_name,

            email: user.email,
            phone: user.plain_phone,
            date_of_birth: user.date_of_birth,
         })
         if (user.business_id) {
            this.business = true;
         } else {
            this.business = false;
         }
      }

   }
   addRole(userId: any) {
      let form = {
         user_id: userId,
         business_id: this.businessDetail.id,  // Assuming `this.businessDetail` is available
         user_role_type_id: 4  // The role ID you're assigning
      };
      this.isLoading = true;
      this.apiService.add_role_allot(form).subscribe({
         next: (data: any) => {
            this.isLoading = false;
            if (data.status) {
               this.toastService.showSuccess(data.msg)
               this.router.navigate(['/customers']);
            } else {
               this.toastService.showError(data.msg)
            }
            console.log(data)


         },
         error: (error: any) => {

            console.log(error);
         }
      })
   }

   getlistofCustomer() {

      try {
         this.apiService.get_user({ business_id: this.businessDetail.id, user_id: this.userId }).subscribe({
            next: (data: any) => {
               if (data.status) {
                  // this.handleUserSelected(this.listofCustomer.phone)
                  let ApiResponse: any = data;
                  this.listofCustomer = ApiResponse.data;
                  this.profileForm.patchValue({
                     first_name: this.listofCustomer.first_name,

                     email: this.listofCustomer.email,
                     phone: this.listofCustomer.plain_phone,
                     date_of_birth: this.listofCustomer.date_of_birth,
                  })

               } else {


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



