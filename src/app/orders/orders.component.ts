import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
   selector: 'app-orders',
   imports: [CommonModule, ButtonModule, RouterModule],
   templateUrl: './orders.component.html',
   styleUrl: './orders.component.css'
})
export class OrdersComponent {

}
