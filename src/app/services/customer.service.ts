import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

     private baseUrl = environment.apiBaseUrl;
  
     /**
      * Creates an instance of ApiService with the given HttpClient.
      * 
      * @param http - The HttpClient used for making HTTP requests.
      */
     constructor(private http: HttpClient) { }

    getCustomerList(params: object): Observable<any> {
       
        return this.http.post(`${this.baseUrl}/get-user-list`, params, this.getHttpOptions()).pipe(
           catchError((error) => {
              console.error('Error fetching the list of business:', error); // Log error for debugging
              return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
           })
        );
     }


     private getHttpOptions(): { headers: HttpHeaders } {
      const token = localStorage.getItem('authToken'); // Replace with a secure method if needed
      return {
         headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
         }),
      };
   }
}
