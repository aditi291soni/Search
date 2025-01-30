import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { CustomerService } from '../services/customer.service';
import { SkeletonModule } from 'primeng/skeleton';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-settings',
 standalone: true,
   imports: [CommonModule, ButtonModule, RouterModule, CardModule, AvatarModule, SkeletonModule,   Select,],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
   businessDetail: any;
   selectedId: any;
   listofBusiness: any[]=[];

 constructor(private apiService: ApiService, private router: Router,private route: ActivatedRoute){

   this.businessDetail = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));

 }
   loading: boolean = false;

   ngOnInit(): void {
      this.selectedId = this.businessDetail.id;
  console.log(this.selectedId)
      this.getlistofBusiness(); // Make sure listofBusiness is populated first
  
   
  }
  
  
  businessPage(){
    this.router.navigate(['/list-of-business',]);
  
  }
  profilePage(){
    this.router.navigate(['/add-profile']); 
  }
  transactionPage(){
    this.router.navigate(['/transaction-list']); 
  }
  referPage(){
    this.router.navigate(['/refer']); 
  }
  supportPage(){
    this.router.navigate(['/support']); 
  }
  onBusinessChange(event:any){
     this.selectedId = (event.target as HTMLSelectElement).value;
    const selectedBusiness = this.listofBusiness.find(
      (business: any) => business.id.toString() === this.selectedId
    );
    if (selectedBusiness) {
      console.log('Selected Business:', selectedBusiness);
  
      // Save the selected business object in localStorage
      localStorage.setItem('bussinessDetails', JSON.stringify(selectedBusiness));
    } else {
      console.error('No matching business found for the selected ID');
    }
  
  }
      getlistofBusiness() {
        try {
          this.apiService.getListOfBusinesses().subscribe({
            next: (data: any) => {
              let ApiResponse: any = data;
              
              this.listofBusiness = ApiResponse.data;
              this.selectedId = this.businessDetail.id;
      
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
