import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastNotificationService } from '../services/toast-notification.service';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-signup',
  standalone: true,
    imports: [  ButtonModule, CardModule, CommonModule,InputTextModule, ButtonModule, CommonModule, SkeletonModule, FormsModule, 
           ReactiveFormsModule,],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {


   /** State to track whether the API call is in progress */
   loading: boolean = false;
   business: any[] = [];
   signInForm: any;
   constructor(
      private apiService: ApiService,
      private router: Router,
      private toastService: ToastNotificationService,
      private fb: FormBuilder ,
   ) {
      this.signInForm= this.fb.group({
         email: ['', [Validators.required, Validators.email]],
         first_name: ['', [Validators.required, ]],
         phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
         password: ['', [Validators.required]],
         password_confirmation: ['', [Validators.required]],
         super_admin: [environment.superAdminId, [Validators.required]],
       })
    }
    redirectToSignUp() {
      this.router.navigate(['/auth/sign-in']); // Navigates to the route
    }
   onSubmit(): void {
      // Start the loading state
      this.loading = true;
this.signInForm.value.password_confirmation=this.signInForm.value.password
    
      this.apiService.signUp(this.signInForm.value).subscribe({
         next: (response) => {
            // Handle successful sign-in
            if (response.status === true) {
               // Store token and user data in localStorage
               // localStorage.setItem('authToken', response.data.token);
               // localStorage.setItem('userData', JSON.stringify(response.data));

               // Show success notification
               this.router.navigate(['/add-business']);
               localStorage.setItem('authToken', response.data.token);
               localStorage.setItem('userData', JSON.stringify(response.data));
               this.toastService.showSuccess('Signup successful!');
              

            } else {
               // Show error notification if credentials are invalid
               this.toastService.showError(response.msg);
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
}
