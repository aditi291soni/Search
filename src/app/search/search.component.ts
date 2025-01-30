import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastNotificationService } from '../services/toast-notification.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,ButtonModule,],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
   businessDetail: any;
   searchUserForm:  any;  // Declare the form group
   userInfo: any;
   listofCustomer: any;
   @Output() userSelected = new EventEmitter<any>();
   @Output() isSearched= new EventEmitter<any>();
   user: any;
      constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder,  private toastService: ToastNotificationService) {
         this.businessDetail = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
         // this.route.params.subscribe((params) => {
         //   this.userId = params['user_id'];
     
         // });
      }
 searchUser(){
 console.log('user')
 }
 ngOnInit(){
   this.searchUserForm = this.fb.group({
   
     phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10), Validators.minLength(10)]],
    
   });
 }
 getlistofCustomer() {
 if(!this.searchUserForm.value.phone){
   this.toastService.showError('Please fill form')
   return;
 }
   try {
     this.apiService.search_user({business_id:this.businessDetail.id,phone:this.searchUserForm.value.phone}).subscribe({
       next: (data: any) => {
         if(data.status){
           let ApiResponse: any = data;
           this.listofCustomer = ApiResponse.data[0];
           this.userSelected.emit(this.listofCustomer);
          
         }else{
           
           this.userSelected.emit(this.searchUserForm.value);
         }
         this.isSearched.emit(true);
       },
       error: (error: any) => {
         this.userSelected.emit(error);
         console.log('Error fetching data', error);
       }
     });
   } catch (error) {
     console.log('Error in the catch block', error);
   }
 }
}
