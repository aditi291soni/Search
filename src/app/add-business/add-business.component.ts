import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ToastModule } from 'primeng/toast';
import { FileUpload } from 'primeng/fileupload';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from 'primeng/select';
@Component({
   selector: 'app-add-business',
   imports: [InputTextModule, ButtonModule, CommonModule, SkeletonModule, FormsModule, Select,
      ReactiveFormsModule, ToastModule],
   templateUrl: './add-business.component.html',
   styleUrl: './add-business.component.css',
   standalone: true,
})

export class AddBusinessComponent {
   businessForm!: FormGroup;
   loading: boolean = false;
   loading_button: boolean = false;
   previewPictureUrl: any = '';
   logoImage: any = null;
   previewPicture: any = '';
   blob: Blob | undefined;
   listofState: any[] = [];
   business_id: any;
   constructor(private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private router: Router,) {
      this.route.params.subscribe((params) => {

         this.business_id = params['id'];
      });
   }

   ngOnInit(): void {
      // Initialize the form group with controls
      this.businessForm = this.fb.group({
         name: ['', [Validators.required,]],
         owner: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
         email: ['', [Validators.required, Validators.email]],
         phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10), Validators.minLength(10)]],
         address: ['', Validators.required],
         city: ['', Validators.required],
         pincode: ['', [Validators.pattern('^[0-9]*$'), Validators.pattern(/^\d{6}$/), Validators.maxLength(6)]],
         state_id: ['', Validators.required],
         gst_registration: ['0'],
         gst_number: ['',],
         super_admin: [environment.superAdminId],
         logo_image: [''],
         country_id: ['101']
      });
      this.getlistofState()
      if (this.business_id) {
         this.getBusiness()
      }
   }

   onBasicUploadAuto(event: any) {
      // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode' });
   }
   picUploads(event: any) {
      console.log(event, "events")
      const reader = new FileReader();
      this.logoImage = event.target.files[0];
      console.log(event.target.files[0])
      // Validate that a file was uploaded
      if (!this.logoImage) {
         console.error('No file selected.');
         return;
      }

      reader.readAsArrayBuffer(this.logoImage); // Read the file as ArrayBuffer

      reader.onload = (loadEvent: any) => {
         const arrayBuffer = loadEvent.target.result; // Get the ArrayBuffer of the file

         // Convert ArrayBuffer to a Blob
         const binaryBlob = new Blob([arrayBuffer], { type: this.logoImage.type });

         console.log('Binary Blob:', binaryBlob);

         // Store Blob in the form for submission
         const formData = new FormData();
         formData.append('logo_image', binaryBlob, this.logoImage.name);
         console.log(formData)
         // Optional: Generate a preview URL for UI
         this.previewPictureUrl = URL.createObjectURL(binaryBlob);

         // Add binary data to the form control for submission
         this.businessForm.get('logo_image')?.setValue(binaryBlob);

      };

      reader.onerror = (errorEvent) => {
         console.error('FileReader error:', errorEvent);
      };

   }
   addBusiness(form: any) {
      this.loading_button = true;
      console.log(this.businessForm.value)
      const formData = new FormData();

      // Loop through all the form controls
      Object.keys(this.businessForm.value).forEach((key) => {
         const value = this.businessForm.value[key];

         // If the value is a file (Blob), append it differently
         if (key === 'logo_image' && value instanceof Blob) {
            formData.append(key, value, 'logo.png'); // 'logo.png' is the name of the file to be sent
         } else {
            // Append normal form control values as string
            formData.append(key, value ? value : '');
         }
      });
      this.loading = true;
      this.apiService.addBusiness(this.businessForm.value).subscribe({
         next: (data: any) => {
            this.loading = false;
            if (data.status) {
               localStorage.setItem('bussinessDetails', JSON.stringify(data.data));
               // this.messageService.showSuccess(data.msg, 'Success')
               this.router.navigate(['']);
            } else {
               // this.messageService.showError(data.msg, 'Error')
               this.loading_button = false;
            }
            console.log(data)


         },
         error: (error: any) => {

            console.log(error);
         }
      })
   }

   editBusiness(form: any) {
      this.loading_button = true;
      console.log(this.businessForm.value)
      const formData = new FormData();

      // Loop through all the form controls
      Object.keys(this.businessForm.value).forEach((key) => {
         const value = this.businessForm.value[key];

         // If the value is a file (Blob), append it differently
         if (key === 'logo_image' && value instanceof Blob) {
            formData.append(key, value, 'logo.png'); // 'logo.png' is the name of the file to be sent
         } else {
            // Append normal form control values as string
            formData.append(key, value ? value : '');
         }
      });
      this.loading = true;
      this.businessForm.value.business_id = this.business_id
      this.apiService.editBusiness(this.businessForm.value).subscribe({
         next: (data: any) => {
            this.loading = false;
            if (data.status) {
               localStorage.setItem('bussinessDetails', JSON.stringify(data.data));
               // this.messageService.showSuccess(data.msg, 'Success')
               this.router.navigate(['']);
            } else {
               // this.messageService.showError(data.msg, 'Error')
               this.loading_button = false;
            }
            console.log(data)


         },
         error: (error: any) => {

            console.log(error);
         }
      })
   }
   onSubmit(): void {

      if (this.businessForm.valid) {
         console.log(this.businessForm.value);
         // this.businessForm.country_id='101'
         if (this.business_id) {
            this.editBusiness(this.businessForm.value)
         } else {
            this.addBusiness(this.businessForm.value)
         }

      } else {
         console.log('Form is invalid');
      }

      // else {
      //   if (this.businessForm.valid) {
      //       this.businessForm.country_id='101'
      //     console.log(this.businessForm.value);
      //     this.editBusiness(this.businessForm.value)
      //   } else {
      //     console.log('Form is invalid');
      //   }
      // }

   }
   getBusiness() {
      try {
         this.apiService.getBusiness({ business_id: this.business_id }).subscribe({
            next: (data: any) => {
               let ApiResponse: any = data.data;
               this.businessForm.patchValue({
                  name: ApiResponse?.name,
                  owner: ApiResponse?.owner,
                  email: ApiResponse?.email,
                  phone: ApiResponse?.plain_phone,
                  address: ApiResponse?.address,
                  city: ApiResponse?.city,
                  pincode: ApiResponse?.pincode,
                  state_id: Number(ApiResponse?.state_id),

                  logo_image: ApiResponse?.image,

               })
               console.log(this.businessForm.value)
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
   resetForm() {
      this.businessForm.reset({
         name: '',
         owner: '',
         email: '',
         phone: '',
         address: '',
         city: '',
         pincode: '',
         state_id: null,  // Ensure dropdowns reset correctly
      });
   }

}
