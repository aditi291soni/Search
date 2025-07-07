import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ToastNotificationService } from '../services/toast-notification.service';
import { Location } from '@angular/common';
@Component({
   selector: 'app-contact-detail',
   templateUrl: './contact-detail.component.html',
   imports: [CommonModule],
   styleUrls: ['./contact-detail.component.css'],
})
export class ContactDetailComponent {
   contacts: any[] = [];
   selectedContact: any = null;

   constructor(
      private cdr: ChangeDetectorRef,
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
            this.toastService.showSuccess('Contacts loaded successfully.');
         } else {
            this.toastService.showWarn('No contact data found.');
         }

         // this.contacts = [{
         //    displayName: "Aditi Sharma",
         //    phoneNumbers: ["9876543210"],
         //    emailAddresses: ["aditi.sharma@example.com"]
         //  }];
          
         const selected = localStorage.getItem('selectedContact');
         this.selectedContact = selected ? JSON.parse(selected) : null;
         
      } catch (error) {
         this.toastService.showError('Error loading contact data.');
         console.error('Contact parsing error:', error);
      }
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
