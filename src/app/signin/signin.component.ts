import { Component, NgZone } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import {
   FormBuilder,
   FormGroup,
   FormsModule,
   ReactiveFormsModule,
   Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastNotificationService } from '../services/toast-notification.service';
import { CommonModule } from '@angular/common';
import { version } from '../../../version';

@Component({
   selector: 'app-signin',
   standalone: true,
   templateUrl: './signin.component.html',
   styleUrls: ['./signin.component.css'],
   imports: [
      CardModule,
      FormsModule,
      ButtonModule,
      InputTextModule,
      PasswordModule,
      ReactiveFormsModule,
      CommonModule,
   ],
})
export class SigninComponent {
   showPassword: boolean = false;
   signinForm: FormGroup;
   loading: boolean = false;
   business: any[] = [];
   versions: any = '';
   contacts: any = 'something one';
   event: any;

   constructor(
      private fb: FormBuilder,
      private apiService: ApiService,
      private router: Router,
      private toastService: ToastNotificationService,
      private ngZone: NgZone
   ) {
      this.signinForm = this.fb.group({
         email_or_phone: [
            '',
            [Validators.required, Validators.pattern(/^(.+)@(.+)$|^\d{10}$/)],
         ],
         password: ['', [Validators.required, Validators.minLength(6)]],
      });
      this.getVersion();
   }

   togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
   }

   redirectToSignUp() {
      this.router.navigate(['/auth/sign-up']);
   }

   ngOnInit() {
      (window as any).receiveContacts = (data: string) => {
         try {
            const parsed = JSON.parse(data);

            const hasValue = Array.isArray(parsed)
               ? parsed.length > 0
               : parsed && Object.keys(parsed).length > 0;

            if (hasValue) {
               this.ngZone.run(() => {
                  this.contacts = parsed;
                  localStorage.setItem(
                     'contact',
                     JSON.stringify(this.contacts)
                  );

                  // ✅ Success toast
                  this.toastService.showSuccess(
                     'Contact data loaded successfully.'
                  );
               });
            } else {
               console.log('Working check')
               // ⚠️ Warning toast
               this.toastService.showWarn('Received empty contacts data.');
            }
         } catch (error) {
            // ❌ Error toast
            this.toastService.showError('Invalid contacts data.');
         }
      };
   }

   onSubmit(): void {
      this.loading = true;

      if (this.signinForm.invalid) {
         this.loading = false;
         return;
      }

      this.apiService.signIn(this.signinForm.value).subscribe({
         next: (response) => {
            if (response.status === true) {
               localStorage.setItem('authToken', response.data.token);
               localStorage.setItem('userData', JSON.stringify(response.data));
               localStorage.setItem(
                  'super_business',
                  response.data.super_business_id[0]
               );
               localStorage.setItem(
                  'super_admin',
                  response.data.super_admin_id
               );

               if (response.data.role_id != '9') {
                  this.toastService.showSuccess('Login successful!');
                  this.fetchBusinessList();
               } else {
                  this.toastService.showError(
                     'Sign-in failed. Invalid credentials or other error.'
                  );
                  return;
               }
            } else {
               this.toastService.showError(
                  'Sign-in failed. Invalid credentials or other error.'
               );
            }
         },
         error: (error) => {
            console.error('Sign-in failed:', error);
            this.loading = false;
            this.toastService.showError('Sign-in failed. Please try again.');
         },
         complete: () => {
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
                  this.router.navigate(['/dashboard']);
               } else if (this.business.length == 1) {
                  localStorage.setItem(
                     'bussinessDetails',
                     JSON.stringify(this.business[0])
                  );
                  this.router.navigate(['/dashboard']);
               } else {
                  this.router.navigate(['/list-of-business']);
               }
            } else {
               this.router.navigate(['/dashboard']);
               console.error(
                  'Error fetching list of business:',
                  response.message
               );
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

   getVersion() {
      this.versions = version;
      console.log('version', this.versions);
   }
}
