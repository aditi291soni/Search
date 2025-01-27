import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
   selector: 'app-signin',
   templateUrl: './signin.component.html',
   styleUrls: ['./signin.component.css'],
   standalone: true,
   imports: [CardModule, FormsModule, ButtonModule, InputTextModule],
})
export class SigninComponent {
   email: string = '';
   password: string = '';

   onSubmit() {
      console.log('Sign in form submitted', {
         email: this.email,
         password: this.password,
      });
   }
}
