import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule, PlatformLocation } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ added FormsModule
import { ApiService } from '../services/api.service';
import { ToastNotificationService } from '../services/toast-notification.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
   selector: 'app-contact-detail',
   templateUrl: './contact-detail.component.html',
   imports: [CommonModule, FormsModule], // ✅ added FormsModule
   styleUrls: ['./contact-detail.component.css'],
   standalone: true // if this is a standalone component
})
export class ContactDetailComponent {
   contacts: any[] = [];
   selectedContact: any = null;
   searchQuery: string = '';

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
         const parsedContacts = this.apiService.getLocalValueInJSON2(stored) || [];

         this.contacts = parsedContacts;

         const selected = localStorage.getItem('selectedContact');
         this.selectedContact = selected ? JSON.parse(selected) : null;

         this.activatedRoute.queryParams.subscribe((params) => {
            this.searchQuery = params['search'] || '';
         });

         const navType = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type;
         if (navType === 'reload' && this.searchQuery) {
            this.clearSearchParam();
         }

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

   // ✅ Search input update handler
   onSearchChange() {
      this.router.navigate([], {
         relativeTo: this.activatedRoute,
         queryParams: { search: this.searchQuery || null },
         queryParamsHandling: 'merge',
         replaceUrl: true,
      });
   }

   private clearSearchParam() {
      this.router.navigate([], {
         relativeTo: this.activatedRoute,
         queryParams: { search: null },
         replaceUrl: true,
      });
   }
   // logDebug() {
   //    const win = window.open('', '_blank');
   //    if (win) {
   //      win.document.write('<h2>🔍 Debug Info</h2>');
   //      win.document.write('<pre>🔹 LocalStorage Contact:\n' + localStorage.getItem('contact') + '</pre>');
   //      win.document.write('<pre>🔹 Parsed Contacts:\n' + JSON.stringify(this.contacts, null, 2) + '</pre>');
   //      win.document.write('<pre>🔹 Filtered Contacts:\n' + JSON.stringify(this.filteredContacts, null, 2) + '</pre>');
   //      win.document.write('<pre>🔹 Search Query:\n' + this.searchQuery + '</pre>');
   //    } else {
   //      alert('Popup blocked! Please allow popups for this site.');
   //    }
   // }

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
   }

   isSelected(contact: any): boolean {
      return (
         this.selectedContact &&
         this.selectedContact.displayName == contact.displayName &&
         JSON.stringify(this.selectedContact.phoneNumbers) == JSON.stringify(contact.phoneNumbers)
      );
   }
}
