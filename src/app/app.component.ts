import { ChangeDetectorRef, Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast'; // Import ToastModule
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ApiService } from './services/api.service';
import { TokenService } from './services/token.service';
@Component({
   selector: 'app-root',
   standalone: true,
   providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
   imports: [MenubarModule, RouterOutlet, FormsModule, ToastModule, MatIconModule], // Add ToastModule here
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css'],
})
export class AppComponent {
   constructor(private toastService: MessageService, private apiService: ApiService, private cdr: ChangeDetectorRef,private tokenService :TokenService) { }
   ngOnInit(): void {
      console.log('Si')
      // this.refreshToken()
      // this.tryTokenRefreshOnAppLoad();
      this.cdr.detectChanges();
   }



//  tryTokenRefreshOnAppLoad() {
//    const token = localStorage.getItem('authToken');
//    const refreshToken = localStorage.getItem('refreshToken');

//    if (token ) {
//      this.apiService.refresh_token().subscribe({
//        next: (data) => {
//          console.log("token",data.data.token)
//          localStorage.setItem('authToken', data.data?.token);
//          localStorage.setItem('refreshToken', data.data?.token);
//          this.tokenService.setToken(data.data.token);
//          console.log('Token refreshed on app load',data.data.token);
//        },
//        error: (err) => {
//          console.warn('Failed to refresh token on app load', err);
//          // Optionally logout
//        }
//      });}}
   // refreshToken() {

   //    try {
   //       this.apiService.refresh_token().subscribe({
   //          next: (data: any) => {
   //             if (data.status) {
   //                let ApiResponse: any = data;
   //                console.log(data?.data?.token)
   //                localStorage.setItem('authToken', data?.data?.token);
   //                localStorage.setItem('refreshToken', data?.data?.token);
   //             }

   //          },
   //          error: (error: any) => {

   //             console.log('Error fetching data', error);
   //          }
   //       });
   //    } catch (error) {
   //       console.log('Error in the catch block', error);
   //    }
   // }
}
