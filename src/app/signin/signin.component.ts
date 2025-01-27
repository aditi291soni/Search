import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastNotificationService } from '../services/toast-notification.service';  // Import ToastNotificationService

/**
 * SigninComponent handles the user sign-in process.
 * It collects the email_or_phone and password from the user, calls the ApiService to authenticate the user,
 * and navigates to the home page upon successful authentication.
 */
@Component({
   selector: 'app-signin',
   templateUrl: './signin.component.html',
   styleUrls: ['./signin.component.css'],
   imports: [CardModule, FormsModule, ButtonModule, InputTextModule],
})
export class SigninComponent {
   email_or_phone: string = ''; // The email or phone number entered by the user for sign-in
   password: string = ''; // The password entered by the user for sign-in

   constructor(
      private apiService: ApiService, // ApiService to handle sign-in
      private router: Router, // Router to navigate to the home page upon successful login
      private toastService: ToastNotificationService // Inject ToastNotificationService
   ) { }

   /**
    * Handles the form submission for sign-in.
    * It calls the ApiService's signIn method with the provided email_or_phone and password.
    * On successful sign-in, the authentication token is stored in localStorage,
    * and the user is redirected to the home page.
    * 
    * @returns void
    */
   onSubmit(): void {
      this.apiService.signIn(this.email_or_phone, this.password).subscribe({
         next: (response) => {
            // Check if response.status is true
            if (response.status === true) {
               // Store token in localStorage
               localStorage.setItem('authToken', response.data.token);
               localStorage.setItem('userData', JSON.stringify(response.data));

               // Show success toast using ToastNotificationService
               this.toastService.showSuccess('Login successful!');

               // Redirect to home
               this.router.navigate(['/']);
            } else {
               // Show error toast if response.status is not true
               this.toastService.showError('Sign-in failed. Invalid credentials or other error.');
            }
         },
         error: (error) => {
            console.error('Sign-in failed:', error);

            // Show error toast if the request fails
            this.toastService.showError('Sign-in failed. Please try again.');
         }
      });
   }

}
