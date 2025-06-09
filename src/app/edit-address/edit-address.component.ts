import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ApiService } from '../services/api.service';
import { ToastNotificationService } from '../services/toast-notification.service';

@Component({
  selector: 'app-edit-address',
  imports: [ButtonModule, CardModule, CommonModule, InputTextModule, CommonModule, SkeletonModule, FormsModule, 
    ReactiveFormsModule, MatIconModule],
  templateUrl: './edit-address.component.html',
  styleUrl: './edit-address.component.css'
})
export class EditAddressComponent {

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild('searchBox', { static: false }) searchBox!: ElementRef;
  addressId: any;
  projectForm: any;
  businessDetail: any;
  drops: any;
  submitted: boolean = false;
  isLoadingLocation = true; // Loader flag
  listofState: any;
  userData: any;
  superAdminId: any;
  payload: any;

  constructor(private route: ActivatedRoute, private confirmationService: ConfirmationService, private router: Router, private fb: FormBuilder, private apiService: ApiService, private toastService: ToastNotificationService) {


     this.route.params.subscribe((params) => {

        this.addressId = params['id'];
     });
     this.superAdminId = this.apiService.getLocalValueInJSON(localStorage.getItem('super_admin'));

     this.businessDetail = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
     this.userData = this.apiService.getLocalValueInJSON(localStorage.getItem('userData'));

  }
  ngOnInit() {
     this.projectForm = this.fb.group({


      address_id:['', Validators.required],
        address_details: ['', Validators.required],
        address_name: ['', Validators.required],
        city: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
        country_id: ['101'],
        state_id: ['',],
        country: ['101'],
        state: ['',],
        lat_val: '',
        long_val: '',
        status: ['1'],
        user_id: [''],
        postal_code: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(6), Validators.minLength(6)]],
        landmark: [''],
        house_no: [''],
        person_phone_no: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10), Validators.minLength(10)]],
        person_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
        super_admin_id: [this.superAdminId],
     });

     this.getAddress()

  }
 

  formData: any = {
     address_name: '',
     address_details: '',
     city: '',
     state: '',
     country: '',
     postal_code: '',
     lat_val: '',
     long_val: '',
     person_phone_no: '',
     person_name: '',
  };


  editAddress() {
    let payload=this.payload
console.log(this.projectForm.value)
    try {
       this.apiService.edit_address(this.projectForm.value).subscribe({
          next: (data: any) => {
             let ApiResponse: any = data.data;
             this.router.navigate(['/address/list-of-address']);
          },
          error: (error: any) => {
             console.log('Error fetching data', error);
          }
       });
    } catch (error) {
       console.log('Error in the catch block', error);
    }

 }
  getAddress() {
    try {
       this.apiService.get_address({address_id:this.addressId}).subscribe({
          next: (data: any) => {
             let ApiResponse: any = data.data;
         this.payload=    this.projectForm.patchValue({
              address_name: ApiResponse.address_name,
              address_details: ApiResponse.address_details,
              city: ApiResponse.city,
              state_id: ApiResponse.state_id ,
              country_id: ApiResponse.country_id,
              landmark:ApiResponse.landmark,
              house_no:ApiResponse.house_no,
              postal_code: ApiResponse.postal_code,
              lat_val: ApiResponse.lat_val,
              long_val: ApiResponse.long_val,
              person_phone_no: ApiResponse.person_phone_no,
              person_name: ApiResponse.person_name,
              address_id:ApiResponse.id
           })

          },
          error: (error: any) => {
             console.log('Error fetching data', error);
          }
       });
    } catch (error) {
       console.log('Error in the catch block', error);
    }

 }


  getlistofState() {
     try {
        this.apiService.getStateList('101').subscribe({
           next: (data: any) => {
              let ApiResponse: any = data;
              this.listofState = ApiResponse.data;

           },
           error: (error: any) => {
              console.log('Error fetching data', error);
           }
        });
     } catch (error) {
        console.log('Error in the catch block', error);
     }

  }




 

}

