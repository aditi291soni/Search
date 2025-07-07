import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-contact-detail',
  providers: [ConfirmationService, MessageService],
  imports: [CommonModule, SkeletonModule, ButtonModule, ToastModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent {
  contacts: any;

  constructor(
    
     private cdr: ChangeDetectorRef,
     private apiService: ApiService
  ) {
      this.contacts= this.apiService.getLocalValueInJSON(localStorage.getItem('contact'));
    //  this.contacts = [{"displayName":"Prashant","phoneNumbers":["9009984758"],"emailAddresses":[]}]
   
  }
}
