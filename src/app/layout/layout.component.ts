import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
   selector: 'app-layout',
   standalone: true,
   imports: [CommonModule, RouterModule, RouterOutlet, SidebarModule, ButtonModule],
   templateUrl: './layout.component.html',
   styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
   isSidebarVisible = true; // Controls sidebar visibility
   isSmallDevice = false; // Tracks if it's a small device

   constructor() {
      this.updateDeviceView();
      window.addEventListener('resize', this.updateDeviceView.bind(this));
   }

   toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
   }

   // Method to detect small device view
   updateDeviceView() {
      this.isSmallDevice = window.innerWidth <= 768;
      if (this.isSmallDevice) {
         this.isSidebarVisible = false; // Hide sidebar on small devices by default
      }
   }
}
