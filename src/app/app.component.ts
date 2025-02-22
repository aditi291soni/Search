import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast'; // Import ToastModule
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
@Component({
   selector: 'app-root',
   standalone: true,
   providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
   imports: [MenubarModule, RouterOutlet, FormsModule, ToastModule, MatIconModule], // Add ToastModule here
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css'],
})
export class AppComponent {
   constructor(private toastService: MessageService) { }
}
