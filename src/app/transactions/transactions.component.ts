import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-transactions',
  imports: [],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {

 transactionList: any[] = []; // List of vehicle types
     loading: boolean = true; 
   userInfo: any;
   businessDetail: any;
   //  @param {ApiService} apiService
      
      constructor(private apiService: ApiService,private route: ActivatedRoute,private customerService:CustomerService) {
         this.userInfo = this.apiService.getLocalValueInJSON(localStorage.getItem('userInfo'));
         this.businessDetail = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
     
       }
   
      ngOnInit(): void {
         this.fetchCustomerList();
      }
   
        fetchCustomerList(): void {
           const superAdminId = environment.superAdminId;
     
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

