import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline'; // Import the TimelineModule

@Component({
   selector: 'app-order-view',
   imports: [ButtonModule, TimelineModule], // Add TimelineModule here
   templateUrl: './order-view.component.html',
   styleUrls: ['./order-view.component.css'],
})
export class OrderViewComponent {
   events: any[]; // Define events for the timeline

   constructor() {
      // Example timeline data
      this.events = [
         {
            status: 'Placed',
            date: '2025-01-01',
            description: 'Your order has been successfully placed.',
         },
         {
            status: 'Processing',
            date: '2025-01-02',
            description: 'Your order is being processed.',
         },
         {
            status: 'Shipped',
            date: '2025-01-03',
            description: 'Your order has been shipped.',
         },
         {
            status: 'Delivered',
            date: '2025-01-05',
            description: 'Your order has been delivered.',
         },
      ];
   }
}
