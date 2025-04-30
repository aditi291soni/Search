import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastNotificationService } from '../services/toast-notification.service';
import { CommonModule } from '@angular/common';

/**
 * SigninComponent handles the user sign-in process.
 * It collects the email_or_phone and password from the user, calls the ApiService to authenticate the user,
 * and navigates to the home page upon successful authentication.
 */
@Component({
   selector: 'app-signin',
   standalone: true,
   templateUrl: './signin.component.html',
   styleUrls: ['./signin.component.css'],
   imports: [CardModule, FormsModule, ButtonModule, InputTextModule, PasswordModule, ReactiveFormsModule, CommonModule],
})
export class SigninComponent {
   /** The email or phone number entered by the user for sign-in */
   // email_or_phone: string = '';
   showPassword: boolean = false;
   signinForm: FormGroup;
   /** The password entered by the user for sign-in */
   // password: string = '';

   /** State to track whether the API call is in progress */
   loading: boolean = false;
   business: any[] = [];

   /**
    * Constructor to inject required services.
    * 
    * @param apiService - ApiService to handle API requests for sign-in
    * @param router - Router to navigate to other pages
    * @param toastService - ToastNotificationService to display notifications
    */
   constructor(
      private fb: FormBuilder,
      private apiService: ApiService,
      private router: Router,
      private toastService: ToastNotificationService
   ) {
      this.signinForm = this.fb.group({
         email_or_phone: ['', [Validators.required, Validators.pattern(/^(.+)@(.+)$|^\d{10}$/)]],
         password: ['', [Validators.required, Validators.minLength(6)]],
      });
   }

   togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
   }
   redirectToSignUp() {
      this.router.navigate(['/auth/sign-up']); // Navigates to the route
   }
   /**
    * Handles the form submission for sign-in.
    * It calls the ApiService's `signIn` method with the provided email_or_phone and password.
    * On successful sign-in, the authentication token is stored in localStorage,
    * and the user is redirected to the home page.
    * If the sign-in fails, an error message is shown using the ToastNotificationService.
    * 
    * @returns {void}
    */
   onSubmit(): void {
      // Start the loading state
      this.loading = true;
      if (this.signinForm.invalid) {
         // this.signinForm.markAllAsTouched();
         this.loading = false;
         return;
      }
      // Call the API for sign-in
      this.apiService.signIn(this.signinForm.value).subscribe({
         next: (response) => {
            // Handle successful sign-in
            if (response.status === true) {
               // Store token and user data in localStorage
               localStorage.setItem('authToken', response.data.token);
               localStorage.setItem('userData', JSON.stringify(response.data));
               localStorage.setItem('super_business', response.data.super_business_id[0] || 1113);
               localStorage.setItem('super_admin', response.data.super_admin_id || 8);
               if (response.data.role_id != '9') {
                  // Show success notification
                  this.toastService.showSuccess('Login successful!');
                  this.fetchBusinessList()
               } else {
                  this.toastService.showError('Sign-in failed. Invalid credentials or other error.');
                  return
                  // this.router.navigate(['/login']);
               }
               // if (response.data && response.data.business_id && response.data.business_id.length > 0) {
               //    this.router.navigate(['/add-business']);
               // const businessIdLength = response.data.business_id.length;

               // if (businessIdLength == 0) {
               //    // Redirect to the "Add Business" page
               //    this.router.navigate(['/add-business']);
               // } else if (businessIdLength == 1) {
               //    // Redirect to the Dashboard page
               //    this.router.navigate(['/dashboard']);
               // } else {
               //    // Redirect to the "List of Businesses" page
               //    this.router.navigate(['/list-of-business']);
               // }
               // } else {
               //    this.loading = false;
               //    this.toastService.showError('Sign-in failed. Invalid credentials or other error.');
               //    // TODO: Redirect to the business setup page
               //    // this.router.navigate(['/business-setup']);
               // }

            } else {
               // Show error notification if credentials are invalid
               this.toastService.showError('Sign-in failed. Invalid credentials or other error.');
            }
         },
         error: (error) => {
            // Handle error during the API call
            console.error('Sign-in failed:', error);

            // Stop the loading state in case of an error
            this.loading = false;

            // Show error notification
            this.toastService.showError('Sign-in failed. Please try again.');
         },
         complete: () => {
            // Stop the loading state when the API call is complete
            this.loading = false;
         },
      });
   }

   fetchBusinessList(): void {
      this.loading = true;
      this.apiService.getListOfBusinesses().subscribe({
         next: (response) => {
            if (response.status === true) {
               this.business = response.data || [];

               if (this.business.length == 0) {
                  // Redirect to the "Add Business" page

                  this.router.navigate(['/dashboard']);

                  // this.router.navigate(['/add-business']);
               } else if (this.business.length == 1) {
                  // Redirect to the Dashboard page
                  localStorage.setItem('bussinessDetails', JSON.stringify(this.business[0]));
                  this.router.navigate(['/dashboard']);
               } else {
                  // Redirect to the "List of Businesses" page
                  this.router.navigate(['/list-of-business']);
               }
            } else {
               this.router.navigate(['/dashboard']);
               console.error('Error fetching list of business:', response.message);
               this.loading = false;
            }
         },
         error: (err) => {
            console.error('Error fetching list of business:', err);
         },
         complete: () => {
            this.loading = false;
         },
      });
   }
}
