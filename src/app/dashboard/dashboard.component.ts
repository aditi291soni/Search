import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [CommonModule, ButtonModule, RouterModule, SkeletonModule],
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
   orders: any[] = [];
   loading = true;

   constructor(private apiService: ApiService) { }

   // Simulate loading delay
   ngOnInit() {
      setTimeout(() => {
         this.loading = false;
      }, 1200); // Adjust delay as needed
   }

   fetchOrders(): void {
      this.apiService.getOrders().subscribe({
         next: (data) => {
            this.orders = data;
            console.log('Orders:', this.orders);
         },
         error: (err) => {
            console.error('Error fetching orders:', err);
         },
      });
   }
}
