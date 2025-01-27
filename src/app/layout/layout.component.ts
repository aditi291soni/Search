import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
   selector: 'app-layout',
   standalone: true,
   imports: [CommonModule, RouterModule, RouterOutlet, SidebarModule, ButtonModule, FormsModule],  // Add FormsModule here
   templateUrl: './layout.component.html',
   styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
   isSidebarVisible = true; // Controls sidebar visibility
   isSmallDevice = false; // Tracks if it's a small device
   searchQuery = ''; // Stores search input

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

   // Theme toggle method (example)
   toggleTheme() {
      document.body.classList.toggle('dark-theme');
   }

   // Toggle search field visibility on small devices
   toggleSearch() {
      const searchBar = document.querySelector('.search-bar-mobile') as HTMLElement;
      
      if (searchBar) {
         searchBar.style.display = searchBar.style.display === 'flex' ? 'none' : 'flex';
      }
   }
}
