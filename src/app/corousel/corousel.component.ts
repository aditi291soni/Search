import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';

import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-corousel',
  imports: [Carousel, ButtonModule, SkeletonModule,CommonModule],
  standalone:true,
  templateUrl: './corousel.component.html',
  styleUrl: './corousel.component.css'
})
export class CorouselComponent {
   businessDetail: any;
   loading:boolean=true;
   listofBanner: any[]=[];
   responsiveOptions: any[] | undefined;
     constructor(private router: Router,private route: ActivatedRoute,private apiService:ApiService,private formBuilder: FormBuilder){
       // this.route.params.subscribe((params) => {
       //   this.userId = params['user_id'];
     
       // });
      //  this.userInfo = this.apiService.getLocalValueInJSON(localStorage.getItem('userInfo'));
       this.businessDetail = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
     }
     ngOnInit(){
       this.getlistofBanner()
     
     }
   getlistofBanner() {
   this.loading=true
     try {
       this.apiService.list_of_banner({super_admin_id:environment.superAdminId,plat_from:"vendor-app"}).subscribe({
         next: (data: any) => {
           if(data.status){
             let ApiResponse: any = data;
             // this.listofBanner = ApiResponse.data;
             console.log( this.listofBanner)
             this.listofBanner = ApiResponse.data.filter((banner: any) => 
              
               banner.super_admin_id == environment.superAdminId && banner.plat_from == 'vendor-app'
             );
          

        this.responsiveOptions = [
         {
             breakpoint: '1400px',
             numVisible: 2,
             numScroll: 1,
         },
         {
             breakpoint: '1199px',
             numVisible: 3,
             numScroll: 1,
         },
         {
             breakpoint: '767px',
             numVisible: 2,
             numScroll: 1,
         },
         {
             breakpoint: '575px',
             numVisible: 1,
             numScroll: 1,
         },
     ];
             console.log( this.listofBanner)
           }else{
             
            this.loading=false
           }
    
         },
         error: (error: any) => {
   
           console.log('Error fetching data', error);
         }
       });
     } catch (error) {
       console.log('Error in the catch block', error);
     }
   }}