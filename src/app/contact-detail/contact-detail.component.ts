import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToastNotificationService } from '../services/toast-notification.service';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ContactDetailComponent {
  contacts: any[] = [];
  selectedContact: any = null;
  searchQuery: string = '';

  constructor(
    private apiService: ApiService,
    private toastService: ToastNotificationService
  ) {
    try {
      const stored = localStorage.getItem('contact');
      const parsedContacts = this.apiService.getLocalValueInJSON2(stored) || [];
      this.contacts = parsedContacts;

      const selected = localStorage.getItem('selectedContact');
      this.selectedContact = selected ? JSON.parse(selected) : null;
    } catch (error) {
      this.toastService.showError('Error loading contact data.');
      console.error('Contact parsing error:', error);
    }
  }

  // ✅ No router logic needed
  onSearchChange() {
    // This triggers getter recalculation
  }

  get filteredContacts(): any[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.contacts;

    return this.contacts.filter((contact) =>
      contact.displayName?.trim().toLowerCase().includes(query)
    );
  }

  selectContact(contact: any) {
    this.selectedContact = contact;
    localStorage.setItem('selectedContact', JSON.stringify(contact));
    const typeRaw = localStorage.getItem('type');
    const type = typeRaw ? JSON.parse(typeRaw) : typeRaw;

    if (type) {
      // Assuming correct navigation logic exists
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
