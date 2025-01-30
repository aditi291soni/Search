import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { ToastNotificationService } from '../services/toast-notification.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SearchComponent } from '../search/search.component';

@Component({
   selector: 'app-layout',
   standalone: true,
   imports: [CommonModule, RouterModule, RouterOutlet, SidebarModule, ButtonModule, FormsModule, ConfirmDialogModule,SearchComponent],  

   templateUrl: './layout.component.html',
   providers: [ConfirmationService],
   styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
   profileMenuItems: any;
   isSidebarVisible = true; // Controls sidebar visibility
   isSmallDevice = false; // Tracks if it's a small device
   searchQuery = ''; // Stores search input
profileMenu: any;

   constructor(  private router: Router,private toastService: ToastNotificationService,      private confirmationService: ConfirmationService,
   ) {
    
      this.updateDeviceView();
      window.addEventListener('resize', this.updateDeviceView.bind(this));
   }
ngOnInit(): void {
 
}

handleGlobalSearch(query: string) {
   console.log('Global Search:', query);
   this.router.navigate(['/search'], { queryParams: { q: query } });
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
   logout(){

      this.confirmationService.confirm({
         message: 'Are you sure you want to logout?',
         header: 'Logout Confirmation',
         icon: 'pi pi-exclamation-triangle',
         accept: () => {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['/auth/sign-in']);
         },
         reject: () => {
            // Optional: Handle rejection
            console.log('Logout cancelled');
         },
      });

   }
   goToProfile(){
      
   }
}
