import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
   selector: 'app-contact-detail',
   templateUrl: './contact-detail.component.html',
   imports: [CommonModule],
   styleUrls: ['./contact-detail.component.css'],
})
export class ContactDetailComponent {
   contacts: any[] = [];
   selectedContact: any = null;

   constructor(private cdr: ChangeDetectorRef, private apiService: ApiService) {
      const stored = localStorage.getItem('contact');
      this.contacts = this.apiService.getLocalValueInJSON(stored) || [];

      const selected = localStorage.getItem('selectedContact');
      this.selectedContact = selected ? JSON.parse(selected) : null;
   }

   selectContact(contact: any) {
      this.selectedContact = contact;
      localStorage.setItem('selectedContact', JSON.stringify(contact));
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
