import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { ActivatedRoute, Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { ToastNotificationService } from '../services/toast-notification.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SearchComponent } from '../search/search.component';
import { SearchBarService } from '../services/search-bar.service';
import { environment } from '../../environments/environment';
import { ApiService } from '../services/api.service';
import { filter } from 'rxjs';

@Component({
   selector: 'app-layout',
   standalone: true,
   imports: [CommonModule, RouterModule, RouterOutlet, SidebarModule, ButtonModule, FormsModule, ConfirmDialogModule],

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
   searchResults: any[] = [];
   isSearchVisible: boolean = false;

   userData: any;
   showSearchBar: boolean = false;
   wallet: any = 0;
   loading: boolean = false;
   businessDetail: any;
   showProfileBar: boolean = false;
   superAdminId: any;
   constructor(private cdr: ChangeDetectorRef, private router: Router, private toastService: ToastNotificationService, private confirmationService: ConfirmationService,
      private searchService: SearchBarService, private activatedRoute: ActivatedRoute, private apiService: ApiService,
   ) {
      this.superAdminId = this.apiService.getLocalValueInJSON(localStorage.getItem('super_admin'));

      this.userData = this.apiService.getLocalValueInJSON(localStorage.getItem('userData'));
      this.businessDetail = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
      this.wallet = this.apiService.getLocalValueInJSON(localStorage.getItem('wallet'));
      this.updateDeviceView();
      window.addEventListener('resize', this.updateDeviceView.bind(this));
   }
   ngOnInit(): void {
      this.router.events.subscribe(() => {
         this.checkSearchBarVisibility();
         this.wallet = this.apiService.getLocalValueInJSON(localStorage.getItem('wallet'));
      });
      this.checkSearchBarVisibility();
      this.checkProfileBarVisibility()
      this.getWalletAmount()
      console.log("rendered")
      this.cdr.detectChanges();
      this.router.events
         .pipe(filter(event => event instanceof NavigationEnd))
         .subscribe(() => {
            this.getWalletAmount(); // Fetch wallet amount on every navigation
         });
   }

   handleGlobalSearch(query: string) {
      console.log('Global Search:', query);
      this.router.navigate(['/search'], { queryParams: { q: query } });
   }
   toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
   }
   checkSearchBarVisibility() {
      const allowedUrls = [
         '/dashboard',
         '/settings',
         '/orders/new-order',
         '/orders/new-order/order-preview/779',
         '/orders/new-order/add-address/drops',
      ];

      const currentUrl = this.router.url;
      this.showSearchBar = !allowedUrls.some(url => currentUrl.includes(url));
   }

   checkProfileBarVisibility() {
      const allowedUrls = [
         '/list-of-business',

      ];

      const currentUrl = this.router.url;
      this.showProfileBar = !allowedUrls.some(url => currentUrl.includes(url));
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

      // if (searchBar) {
      //    searchBar.style.display = searchBar.style.display === 'flex' ? 'none' : 'flex';
      // }
   }
   logout() {

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
   goToProfile() {

   }
   cancel() {

   }
   onSearch() {
      if (this.searchQuery.trim()) {
         this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: this.searchQuery.trim() ? { search: this.searchQuery } : {},
            // queryParams: { search: this.searchQuery }, // Add the search query as a query parameter

         });
         // console.log(this.searchQuery)
      } else {
         this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { search: '' }, // Add the search query as a query parameter

         });
      }
      // if (this.searchQuery.trim()) {
      //    // Call the search service to get results based on the query
      //    this.searchService.getSearchResults(this.searchQuery).subscribe((results: any[]) => {
      //       this.searchResults = results;
      //       console.log(this.searchResults)
      //    });
      // } else {
      //    this.searchResults = [];
      // }
   }
   @HostListener('document:click', ['$event'])
   handleClickOutside(event: Event) {
      const sidebarElement = document.querySelector('.sidebar');
      const toggleButton = document.querySelector('.menu-toggle');

      // Prevent any background click actions when sidebar is open
      event.stopPropagation();
      if (
         this.isSidebarVisible &&
         sidebarElement &&
         toggleButton &&
         !sidebarElement.contains(event.target as Node) &&
         !toggleButton.contains(event.target as Node)
      ) {
         this.isSidebarVisible = false;
      }

   }
   getWalletAmount(): void {
      let payload: any = {};
      payload.super_admin_id =  this.superAdminId;
      payload.user_id = this.userData ? this.userData.id : 0;
      // payload.vehicle_type_id = this.newOrder.vehicleType;
      this.apiService.get_wallet_amount(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.wallet = response?.data?.total_balance; // All time slots
               this.cdr.detectChanges();


            } else {
               this.wallet = 0;
               this.createWallet()
               console.error('Error fetching time slots:', response.message);
            }
         },
         error: (err) => {
            console.error('Error fetching vehicle types:', err);
         },
         complete: () => {
            this.loading = false;
            localStorage.setItem('wallet', JSON.stringify(this.wallet));
         },
      });
   }
   createWallet(): void {
      let payload: any = {};
      payload.super_admin_id =  this.superAdminId;
      payload.user_id = this.userData ? this.userData.id : 0;
      // payload.vehicle_type_id = this.newOrder.vehicleType;
      this.apiService.create_wallet_amount(payload).subscribe({
         next: (response) => {
            if (response.status === true) {
               // this.wallet = response?.data?.total_balance; // All time slots
               this.cdr.detectChanges();


            } else {
               this.wallet = 0;
               // this.createWallet()
               console.error('Error fetching time slots:', response.message);
            }
         },
         error: (err) => {
            console.error('Error fetching vehicle types:', err);
         },
         complete: () => {
            this.loading = false;
         },
      });
   }
}
