import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
   selector: 'app-new-order',
   standalone: true,
   imports: [InputTextModule, ButtonModule],
   templateUrl: './new-order.component.html',
   styleUrls: ['./new-order.component.css'],
})
export class NewOrderComponent { }
