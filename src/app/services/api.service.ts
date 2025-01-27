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
    * Fetches the list of orders from the API.
    * 
    * @returns An observable that emits the list of orders.
    * @throws Will throw an error if the API request fails.
    */
   getOrders(): Observable<any> {
      return this.http.get(`${this.baseUrl}/orders`).pipe(
         catchError((error) => {
            console.error('Error fetching orders:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch orders')); // Return a user-friendly error message
         })
      );
   }

   /**
    * Creates a new order by sending the provided order data to the API.
    * 
    * @param orderData - The data representing the new order.
    * @returns An observable that emits the response from the create order API.
    * @throws Will throw an error if the API request fails.
    */
   createOrder(orderData: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/orders`, orderData, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error creating order:', error); // Log error for debugging
            return throwError(() => new Error('Failed to create order')); // Return a user-friendly error message
         })
      );
   }

   /**
    * Fetches customer details by ID from the API.
    * 
    * @param customerId - The unique identifier of the customer.
    * @returns An observable that emits the customer details.
    * @throws Will throw an error if the API request fails.
    */
   getCustomerById(customerId: string): Observable<any> {
      return this.http.get(`${this.baseUrl}/customers/${customerId}`, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching customer:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch customer')); // Return a user-friendly error message
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
}
