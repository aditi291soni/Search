import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [ButtonModule],
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent { }
