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
   signIn(payload: object): Observable<any> {
      return this.http.post(`${this.baseUrl}/sign-in`, payload).pipe(
         catchError((error) => {
            console.error('Error signing in:', error); // Log error for debugging
            return throwError(() => new Error('Failed to sign in')); // Return a user-friendly error message
         })
      );
   }

   signUp(payload: object): Observable<any> {
      return this.http.post(`${this.baseUrl}/sign-up`, payload).pipe(
         catchError((error) => {
            console.error('Error signing in:', error); // Log error for debugging
            return throwError(() => new Error('Failed to sign in')); // Return a user-friendly error message
         })
      );
   }
   /**f
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
   // list_of_banner(payload: object): Observable<any> {
   //    return this.http.post(`${this.baseUrl}/get-public-banner-list`, payload, this.getHttpOptions()).pipe(
   //       catchError((error) => {
   //          console.error('Error fetching the list of businesses:', error); // Log error for debugging
   //          return throwError(() => new Error('Failed to fetch the list of businesses')); // Return a user-friendly error message
   //       })
   //    );
   // }
   list_of_banner(payload: object): Observable<any> {
      return this.http.post(`${this.baseUrl}/get-super-banner-list`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of businesses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of businesses')); // Return a user-friendly error message
         })
      );
   }
   refresh_token(): Observable<any> {
      const token = localStorage.getItem('authToken');
    
      return this.http.post(
        `${this.baseUrl}/refresh-token`,
        {}, // send body here if needed, or replace `{}` with actual data
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
          }),
        }
      ).pipe(
        catchError((error) => {
          console.error('Error in refresh token:', error);
          return throwError(() => new Error('Failed to refresh token'));
        })
      );
    }
    
   create_wallet_amount(payload: object): Observable<any> {
      return this.http.post(`${this.baseUrl}/create-wallet`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of businesses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of businesses')); // Return a user-friendly error message
         })
      );
   }
   get_wallet_amount(payload: object): Observable<any> {
      return this.http.post(`${this.baseUrl}/get-total-wallet-balance`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of businesses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of businesses')); // Return a user-friendly error message
         })
      );
   }
   add_wallet_amount(payload: object): Observable<any> {
      return this.http.post(`${this.baseUrl}/add-wallet-balance`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of businesses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of businesses')); // Return a user-friendly error message
         })
      );
   }
   deduct_wallet_amount(payload: object): Observable<any> {
      return this.http.post(`${this.baseUrl}/deduct-wallet-balance`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of businesses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of businesses')); // Return a user-friendly error message
         })
      );
   }
   delete_address(payload: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/deleteAddress`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of businesses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of businesses')); // Return a user-friendly error message
         })
      );
   }

   list_of_coupan(payload: any): Observable<any> {
      // Convert payload to URL parameters
      const queryParams = new URLSearchParams();
      for (const key in payload) {
         if (payload.hasOwnProperty(key) && payload[key] !== undefined && payload[key] !== null) {
            queryParams.append(key, payload[key]);
         }
      }
      const devURL = "https://api2.magicqr.in"
      const url = `${devURL}/coupon/get-coupons-list?${queryParams.toString()}`;

      return this.http.get(url, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of businesses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of businesses')); // Return a user-friendly error message
         })
      );
   }
   redeem_coupan(payload: any): Observable<any> {
      const devURL = "https://api2.magicqr.in"
      return this.http.post(`${devURL}/coupon/redeem/verify-redeem-coupon`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the redeem coupan:', error.error.error); // Log error for debugging
            return throwError(() => new Error(error.error.error)); // Return a user-friendly error message
         })
      );
   }
   add_redeem(payload: any): Observable<any> {
      const devURL = "https://api2.magicqr.in"
      return this.http.post(`${devURL}/coupon/redeem/add-redeem-coupon`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the redeem coupan:', error.error.error); // Log error for debugging
            return throwError(() => new Error(error.error.error)); // Return a user-friendly error message
         })
      );
   }
   last_invoice(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-last-invoice`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   add_address(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/addAddress`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   get_address(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/getAddress`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   edit_address(params: object): Observable<any> {
console.log("payadd",params)
      return this.http.post(`${this.baseUrl}/editAddress`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   add_user(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/addUser`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   add_role_allot(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/add-role-allot`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   get_user(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/getUser`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }

   search_user(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/search-users`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   edit_user(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/editUser`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   getOrderDeliveryDetail(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-order-delivery-details`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   getDelivery(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-delivery-type`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   getVehicle(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-vehicle-type`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   getTimeSlots(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-time-slot`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }

   getOrderStatus(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-master-order-status-list`, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }

   getOrderDelivery(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-order-delivery-details-list`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
           
            console.error('Error fetching in delivery detail:', error.error.msg); // Log error for debugging
            return throwError(() => new Error(error.error.msg)); // Return a user-friendly error message
         })
      );
   }
   getInvoice(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-invoice`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
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
   getAddressList(payload: any): Observable<any> {
      // const payload = { business_id: businessId }; // Add business_id to payload
      return this.http.post(`${this.baseUrl}/getAddressList`, payload, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   getTransactionList(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-transaction-list`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   getTimeSlot(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-time-slot-list`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of addresses:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of addresses')); // Return a user-friendly error message
         })
      );
   }
   getDeliveryType(params: object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-delivery-type-list`, params, this.getHttpOptions()).pipe(
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
      return this.http.get(`${this.baseUrl}/states?country_id=101`, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of business:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }
   get_financial_year_list(): Observable<any> {

      return this.http.get(`${this.baseUrl}/get-financial-year-list`, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of business:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }

   getLedger(params: Object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-ledger-list`, params, this.getHttpOptions()).pipe(
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
   editBusiness(params: Object): Observable<any> {

      return this.http.post(`${this.baseUrl}/edit-business`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of business:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }


   getBusiness(params: Object): Observable<any> {

      return this.http.post(`${this.baseUrl}/get-business`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of business:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }
   addInvoice(params: Object): Observable<any> {

      return this.http.post(`${this.baseUrl}/add-invoice`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of business:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }
   editInvoice(params: Object): Observable<any> {

      return this.http.post(`${this.baseUrl}/edit-invoice`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of business:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }
   addTransaction(params: Object): Observable<any> {

      return this.http.post(`${this.baseUrl}/add-transaction`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of business:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }
   addNotification(params: Object): Observable<any> {

      // return this.http.post(`https://practice-world-backend.vercel.app/rider-location/active-rider-location-for-order`, params).pipe(
      return this.http.post(`${this.baseUrl}/active-rider-location-for-order`, params, this.getHttpOptions()).pipe(
         catchError((error) => {
            console.error('Error fetching the list of business:', error); // Log error for debugging
            return throwError(() => new Error('Failed to fetch the list of business')); // Return a user-friendly error message
         })
      );
   }
   edit_order_delivery_details(params: Object): Observable<any> {

      return this.http.post(`${this.baseUrl}/edit-order-delivery-details`, params, this.getHttpOptions()).pipe(
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
      const refreshToken = localStorage.getItem('refreshToken'); 
      const token = localStorage.getItem('authToken'); // Replace with a secure method if needed
      return {
         headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
         }),
      };
   }
   private getHttpOptionMaster(): { headers: HttpHeaders } {
      const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLm1hZ2ljcXIuaW5cL3B1YmxpY1wvYXBpXC9zdXBlci1hZG1pbi1zaWduLWluIiwiaWF0IjoxNzQ2NDI0NjM3LCJleHAiOjE3NDcwMjk0MzcsIm5iZiI6MTc0NjQyNDYzNywianRpIjoibGlsTnRTMXVaSXBhOThRWCIsInN1YiI6OCwicHJ2IjoiOTcxMDBmOGFjNDQyY2FiMWNkY2RlZmNkNjZkMDZmYzE4YzE0MGZmZCIsImVtYWlsIjoiZHJvcHpvbmVAZ21haWwuY29tIiwicGhvbmUiOiIxMjU0NjMyNTYxIiwiaWQiOjgsInVzZXIiOnsiZW1haWwiOm51bGwsInBob25lIjpudWxsLCJpZCI6bnVsbH19.p2N6hijIinP5UG8wjXFloCnTOfO24kYMp-4_Ca3wY9k"; // Replace with a secure method if needed
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
      } catch (error: any) {
         // console.error("Error parsing JSON:", error.message);
         console.error("Error parsing JSON:", error);
      }
   }
}
