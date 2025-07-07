import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ToastNotificationService } from '../services/toast-notification.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
      private toastService: ToastNotificationService,
      private location: Location // ⬅️ added here
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
         this.activatedRoute.queryParams.subscribe(params => {
            this.searchQuery = params['search'] ;  // Default to empty string if no 'search' param is found
            console.log('Search Query:', this.searchQuery);  // Log search query for debugging

         });
   
         
      } catch (error) {
         this.toastService.showError('Error loading contact data.');
         console.error('Contact parsing error:', error);
      }
   }
   get filteredContacts(): any[] {
      const query = this.searchQuery;
      if (!query) return this.contacts;
  
      return this.contacts.filter(contact => {
         const name = contact.displayName?.trim().toLowerCase().normalize();
         const q = query.trim().toLowerCase().normalize();
   
         return name.includes(q); 
      });
   }
   
   selectContact(contact: any) {
      this.selectedContact = contact;
      localStorage.setItem('selectedContact', JSON.stringify(contact));
      this.location.back();
   }

   isSelected(contact: any): boolean {
      return (
         this.selectedContact &&
         this.selectedContact.displayName === contact.displayName &&
         JSON.stringify(this.selectedContact.phoneNumbers) ===
            JSON.stringify(contact.phoneNumbers)
      );
   }
}
