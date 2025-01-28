import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * ApiService provides methods for interacting with the backend API.
 * It includes methods for signing in, fetching orders, creating orders, and fetching customer details.
 */
@Injectable({
   providedIn: 'root', // Ensures a singleton service across the app
})
export class ApiService {
   /**
    * The base URL of the API.
    * The base URL of the API, fetched from the environment settings.
    */
   private baseUrl = environment.apiBaseUrl;

   /**
    * Creates an instance of ApiService with the given HttpClient.
    * 
    * @param http - The HttpClient used for making HTTP requests.
    */
   constructor(private http: HttpClient) { }

   /**
    * Signs in a user by sending the provided email_or_phone and password to the API.
    * 
    * @param email_or_phone - The user's email address or phone number.
    * @param password - The user's password.
    * @returns An observable that emits the response from the sign-in API.
    * @throws Will throw an error if the API request fails.
    */
   signIn(email_or_phone: string, password: string): Observable<any> {
      return this.http.post(`${this.baseUrl}/sign-in`, { email_or_phone, password }).pipe(
         catchError((error) => {
            console.error('Error signing in:', error); // Log error for debugging
            return throwError(() => new Error('Failed to sign in')); // Return a user-friendly error message
         })
      );
   }

   /**
    * Fetches the list of businesses from the API.
    * 
    * @returns An observable that emits the list of businesses.
    * @throws Will throw an error if the API request fails.
    */
   getListOfBusinesses(): Observable<any> {
      return this.http.post(`${this.baseUrl}/list-of-business`, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of businesses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of businesses')); // Return a user-friendly error message
         })
      );
   }

   /**
  * Fetches the list of addresses from the API.
  *
  * @param businessId The ID of the business to fetch addresses for.
  * @returns An observable that emits the list of addresses.
  * @throws Will throw an error if the API request fails.
  */
   getAddressList(businessId: string): Observable<any> {
      const payload = { business_id: businessId }; // Add business_id to payload
      return this.http.post(`${this.baseUrl}/getAddressList`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }

   /**
 * Fetches the list of vehicle types from the API.
 *
 * @param superAdminId The ID of the super admin to fetch the vehicle types for.
 * @returns An observable that emits the list of vehicle types.
 * @throws Will throw an error if the API request fails.
 */
   getVehicleTypeList(superAdminId: string | number): Observable<any> {
      const payload = { super_admin_id: superAdminId }; // Add super_admin_id to payload
      return this.http.post(`${this.baseUrl}/get-vehicle-type-list`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of vehicle types:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of vehicle types')); // Return a user-friendly error message
         })
      );
   }

   getBusinessList(superAdminId: string): Observable<any> {
      const payload = { super_admin_id: superAdminId }; // Add super_admin_id to payload
      return this.http.post(`${this.baseUrl}/list-of-business`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of business:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }
   getOrderList(payload: Object): Observable<any> {
      return this.http.post(`${this.baseUrl}/get-order-invoice-list`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of business:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }
   createDelivery(payload: Object): Observable<any> {
      return this.http.post(`${this.baseUrl}/add-order-delivery-details`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of delivery:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }
   getStateList(countryId: string): Observable<any> {
      const payload = { country_id: countryId }; // Add super_admin_id to payload
      return this.http.get(`${this.baseUrl}/states?country_id=101`,this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of business:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }
   addBusiness(params: Object): Observable<any> {
     
      return this.http.post(`${this.baseUrl}/add-business`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of business:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }
   /**
    * Helper method to retrieve HTTP options with the authorization token.
    * 
    * @returns The HTTP options including headers with authorization token.
    */
   private getHttpOptions(): { headers: HttpHeaders } {
      const token = localStorage.getItem('authToken'); // Replace with a secure method if needed
      return {
         headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
         }),
      };
   }
   getLocalValueInJSON(value: any) {
      let localValueInString = JSON.stringify(value);
      try {
        let localValueConvertInJSONFormat = JSON.parse(localValueInString);      
        // console.log(localValueConvertInJSONFormat);
        return JSON.parse(localValueConvertInJSONFormat);
      } catch (error:any) {
        // console.error("Error parsing JSON:", error.message);
        console.error("Error parsing JSON:", error);
      }
    }
}
