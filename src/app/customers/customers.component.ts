import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

@Component({
   selector: 'app-customers',
   standalone: true,
   imports: [CommonModule, ButtonModule, RouterModule, CardModule, AvatarModule],
   templateUrl: './customers.component.html',
   styleUrls: ['./customers.component.css']
})
export class CustomersComponent { }
