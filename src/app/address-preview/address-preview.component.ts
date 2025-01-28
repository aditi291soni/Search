import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
   selector: 'app-address-preview',
   standalone: true,
   imports: [CommonModule, ButtonModule],
   templateUrl: './address-preview.component.html',
   styleUrls: ['./address-preview.component.css']
})
export class AddressPreviewComponent {
   pickup = {
      name: 'Aditi Mp',
      phone: '73648236423',
      address: '6, Hamidia Rd, Ghora Nakkas, Peer Gate Area, Bhopal, Madhya Pradesh 462001, India'
   };

   drop = {
      name: 'Aditi',
      phone: '362364723',
      address: 'Minal Residency, Bhopal, Madhya Pradesh, India'
   };
}
