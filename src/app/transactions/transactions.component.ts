import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { CustomerService } from '../services/customer.service';
import { SkeletonModule } from 'primeng/skeleton';
import { NoDataFoundComponent } from '../no-data-found/no-data-found.component';

@Component({
  selector: 'app-transactions',
  imports: [SkeletonModule,CardModule, AvatarModule,ButtonModule,RouterModule,CommonModule,NoDataFoundComponent],
  standalone: true,
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {

 transactionList: any[] = []; // List of vehicle types
     loading: boolean = true; 
   userInfo: any;
   businessDetail: any;
   superAdminId: any;
   //  @param {ApiService} apiService
      
      constructor(private apiService: ApiService,private route: ActivatedRoute,private customerService:CustomerService) {
         this.userInfo = this.apiService.getLocalValueInJSON(localStorage.getItem('userInfo'));
         this.businessDetail = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
         this.superAdminId = this.apiService.getLocalValueInJSON(localStorage.getItem('super_admin'));

       }
   
      ngOnInit(): void {
         this.fetchCustomerList();
      }
   
        fetchCustomerList(): void {
           const superAdminId = this.superAdminId ;
     
           this.apiService.getTransactionList({business_id:this.businessDetail.id}).subscribe({
              next: (response) => {
                 if (response.status) {
                    this.transactionList = response.data || [];
                 } else {
                    console.error('Error fetching vehicle types:', response.message);
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

