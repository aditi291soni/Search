import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
@Component({
   selector: 'app-business-list',
   imports: [CommonModule, ButtonModule, RouterModule, CardModule, AvatarModule],
   templateUrl: './business-list.component.html',
   styleUrl: './business-list.component.css',
   standalone: true,
})
export class BusinessListComponent {
   businessList: any[] = []; // List of vehicle types
   loading: boolean = true;
   selectedBusiness: any;
   //  @param {ApiService} apiService

   constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router,) { }

   ngOnInit(): void {
      this.fetchBusinessList();
   }

   fetchBusinessList(): void {
      const superAdminId = environment.superAdminId;

      this.apiService.getBusinessList(superAdminId.toString()).subscribe({
         next: (response) => {
            if (response.status === true) {
               this.businessList = response.data || [];
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
   onBusinessClick(business: any) {
      console.log("b", business);
      this.selectedBusiness = business
      localStorage.setItem('bussinessDetails', JSON.stringify(business));
      this.router.navigate(['/dashboard']);
   }
}
