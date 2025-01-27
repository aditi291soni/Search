import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

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
   /**
    * The email or phone number entered by the user for sign-in.
    */
   email_or_phone: string = '';

   /**
    * The password entered by the user for sign-in.
    */
   password: string = '';

   /**
    * Constructs the SigninComponent with the necessary dependencies.
    * 
    * @param apiService - The ApiService used to make API calls for sign-in.
    * @param router - The Angular Router used to navigate the user to different views.
    */
   constructor(private apiService: ApiService, private router: Router) { }

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
         /**
          * Called when the sign-in request is successful.
          * Stores the authentication token in localStorage and navigates the user to the home page.
          * 
          * @param response - The response returned from the sign-in API containing the token.
          */
         next: (response) => {
            // Store token in localStorage
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data));
            this.router.navigate(['/']);
         },

         /**
          * Called when the sign-in request fails.
          * Logs the error for debugging purposes.
          * 
          * @param error - The error returned from the sign-in API.
          */
         error: (error) => {
            console.error('Sign-in failed:', error);
         }
      });
   }
}
