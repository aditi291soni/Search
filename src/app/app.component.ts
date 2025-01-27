import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast'; // Import ToastModule

@Component({
   selector: 'app-root',
   standalone: true,
   imports: [MenubarModule, RouterOutlet, FormsModule, ToastModule], // Add ToastModule here
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css'],
})
export class AppComponent {
   constructor(private toastService: MessageService) { }
}
