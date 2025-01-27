import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';  // Import the CalendarModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
   selector: 'app-new-customer',
   standalone: true,  // Mark this component as standalone
   imports: [InputTextModule, ButtonModule, CalendarModule, FormsModule],  // Add CalendarModule and FormsModule
   templateUrl: './new-customer.component.html',
   styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent {
   dob: Date | null = null;  // The variable to bind the calendar component
}
