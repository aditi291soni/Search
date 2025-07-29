import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule, PlatformLocation } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ToastNotificationService } from '../services/toast-notification.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
   selector: 'app-contact-detail',
   templateUrl: './contact-detail.component.html',
   imports: [CommonModule],
   styleUrls: ['./contact-detail.component.css'],
})
export class ContactDetailComponent {
   contacts: any[] = [];
   selectedContact: any = null;
   searchQuery: any;
   constructor(
      private cdr: ChangeDetectorRef,
      private activatedRoute: ActivatedRoute,
      private apiService: ApiService,
      private router: Router,
      private toastService: ToastNotificationService,
      private location: Location,
      private platformLocation: PlatformLocation
   ) {
      try {
         const stored = localStorage.getItem('contact');
         const parsedContacts =
            this.apiService.getLocalValueInJSON2(stored) || [];

         if (parsedContacts && parsedContacts.length > 0) {
            this.contacts = parsedContacts;
            // this.toastService.showSuccess('Contacts loaded successfully.');
         } else {
            // this.toastService.showWarn('No contact data found.');
         }
         if (this.searchQuery) {
            console.log(this.searchQuery)
            this.router.navigate([], {
               relativeTo: this.activatedRoute,
               queryParams: { search: this.searchQuery ? this.searchQuery : null },
               queryParamsHandling: 'merge',
               replaceUrl: true,
            });
         }
         this.contacts = parsedContacts;
         // this.contacts = [{
         //    displayName: "Aditi Sharma",
         //    phoneNumbers: ["9876543210"],
         //    emailAddresses: ["aditi.sharma@example.com"]
         //  },
         //  {
         //    displayName: "Aman",
         //    phoneNumbers: ["9876543210"],
         //    emailAddresses: ["aditi.sharma@example.com"]
         //  }];

         const selected = localStorage.getItem('selectedContact');
         this.selectedContact = selected ? JSON.parse(selected) : null;
         this.activatedRoute.queryParams.subscribe((params) => {
            this.searchQuery = params['search'];
         //    const isReload =
         //       (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'reload' ||
         //       performance.navigation.type === 1;

         //    if (isReload && this.searchQuery) {
         //       this.router.navigate([], {
         //          relativeTo: this.activatedRoute,
         //          queryParams: { search: null },
         //          queryParamsHandling: 'merge',
         //          replaceUrl: true,
         //       });
         //    }
         });
         const navType = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type;
         if (navType === 'reload' && this.searchQuery) {
            this.clearSearchParam();
         }

         // Clear on back
         this.platformLocation.onPopState(() => {
            if (this.searchQuery) {
              this.clearSearchParam();
            }
          });


      } catch (error) {
         this.toastService.showError('Error loading contact data.');
         console.error('Contact parsing error:', error);
      }
   }
   private clearSearchParam() {
      this.router.navigate([], {
         relativeTo: this.activatedRoute,
         queryParams: { search: null },
         // queryParamsHandling: 'merge',
         replaceUrl: true,
      });
   }
   get filteredContacts(): any[] {
      const query = this.searchQuery;
      if (!query) return this.contacts;

      return this.contacts.filter((contact) => {
         const name = contact.displayName?.trim().toLowerCase().normalize();
         const q = query.trim().toLowerCase().normalize();

         return name.includes(q);
      });
   }

   selectContact(contact: any) {
      this.selectedContact = contact;
      localStorage.setItem('selectedContact', JSON.stringify(contact));
      const typeRaw = localStorage.getItem('type');
      const type = typeRaw ? JSON.parse(typeRaw) : typeRaw;

      if (type) {
        this.router.navigate([`/orders/new-order/add-address/${type}`]);
      }

      // this.router.navigate([`/orders/new-order/add-address/${localStorage.parse(type)}`]);
   }

   isSelected(contact: any): boolean {
      return (
         this.selectedContact &&
         this.selectedContact.displayName == contact.displayName &&
         JSON.stringify(this.selectedContact.phoneNumbers) ===
            JSON.stringify(contact.phoneNumbers)
      );
   }
}
