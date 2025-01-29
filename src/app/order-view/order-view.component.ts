import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';

@Component({
   selector: 'app-order-view',
   standalone: true,
   imports: [ButtonModule, TimelineModule],
   templateUrl: './order-view.component.html',
   styleUrls: ['./order-view.component.css'],
})
export class OrderViewComponent {
   events: any[];

   constructor() {
      this.events = [
         {
            status: 'Placed',
            date: '2025-01-01',
            description: 'Your order has been successfully placed.',
            icon: 'pi pi-check-circle',
            color: 'green',
            lineColor: 'green', // Separator line color
         },
         {
            status: 'Processing',
            date: '2025-01-02',
            description: 'Your order is being processed.',
            icon: 'pi pi-check-circle',
            color: 'green',
            lineColor: 'green',
         },
         {
            status: 'Shipped',
            date: '2025-01-03',
            description: 'Your order has been shipped.',
            icon: 'pi pi-check-circle',
            color: 'green',
            lineColor: 'green',
         },
         {
            status: 'Delivered',
            date: '2025-01-05',
            description: 'Your order has been delivered.',
            icon: 'pi pi-circle-off', // Default (not checked)
            color: 'gray',
            lineColor: 'gray', // Gray separator for pending status
         },
      ];
   }
}
