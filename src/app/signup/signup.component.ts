import { Component, NgZone } from '@angular/core';
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
import { PasswordModule } from 'primeng/password';
import { Select } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';
@Component({
   selector: 'app-signup',
   standalone: true,
   imports: [ButtonModule, CardModule, CommonModule, InputTextModule, ButtonModule, CommonModule, SkeletonModule, FormsModule, PasswordModule,
      ReactiveFormsModule,DropdownModule,Select],
   templateUrl: './signup.component.html',
   styleUrl: './signup.component.css'
})
export class SignupComponent {


   /** State to track whether the API call is in progress */
   loading: boolean = false;
   business: any[] = [];
   signInForm: any;
   showPassword: boolean = false;
   contacts: any = 'something one';
   event: any;
//   super_admin_list:any = [
//       { name: 'Bhopal', id: '8' },  
//       // { name: 'Indore', id: '9' },
//       { name: 'Vidisha', id: '6' },
  
   
//   ];
  super_admin_list = [
   
    { name: 'Bhopal', id: '11' },
   { name: 'Super10', id: '10' },
   { name: 'Super-12', id: '12' },
   { name: 'Super8', id: '8' },
   { name: 'Super6', id: '6' },
 ];
   constructor(
      private apiService: ApiService,
      private router: Router,
      private toastService: ToastNotificationService,
      private fb: FormBuilder,

      private ngZone: NgZone
   ) {
      this.signInForm = this.fb.group({
         email: ['', [Validators.required, Validators.email]],
         first_name: ['', [Validators.required,]],
         phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
         password: ['', [Validators.required, Validators.minLength(6)]],
         password_confirmation: ['', [Validators.required]],
         super_admin: ['11', [Validators.required]],
         role_id: ['4']
      })
   }
   ngOnInit() {
      (window as any).receiveContacts = (data: string) => {
        try {
          const parsed = JSON.parse(data);
    
          // Check if parsed has some value
          const hasValue = Array.isArray(parsed)
            ? parsed.length > 0
            : parsed && Object.keys(parsed).length > 0;
    
          if (hasValue) {
            this.ngZone.run(() => {
              this.contacts = parsed;
              localStorage.setItem('contact', JSON.stringify(this.contacts));
              console.log('Contacts received:', this.contacts);
            });
          } else {
            console.warn('Received empty contacts data');
          }
    
        } catch (error) {
          console.error('Invalid contacts data', error);
        }
      };
    }
   redirectToSignUp() {
      this.router.navigate(['/auth/sign-in']); // Navigates to the route
   }
   onSubmit(): void {
      // Start the loading state
      this.loading = true;
      this.signInForm.value.password_confirmation = this.signInForm.value.password

      this.apiService.signUp(this.signInForm.value).subscribe({
         next: (response) => {
            // Handle successful sign-in
            if (response.status === true) {
               localStorage.setItem('super_admin',  this.signInForm.value.super_admin);
               // Store token and user data in localStorage
               // localStorage.setItem('authToken', response.data.token);
               // localStorage.setItem('userData', JSON.stringify(response.data));

               // Show success notification
               // this.router.navigate(['/add-business']);
               this.router.navigate(['/dashboard']);
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
   togglePasswordVisibility(): void {
      this.showPassword = !this.showPassword;
   }
}
