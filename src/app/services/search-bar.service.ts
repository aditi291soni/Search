import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from './api.service';
@Injectable({
   providedIn: 'root'
})
export class SearchBarService {



   // Simulated search data (this could be a large data set or fetched from an API)
   // dataList: any[] = [
   //    { name: 'Item 1', description: 'Description for item 1' },
   //    { name: 'Item 2', description: 'Description for item 2' },
   //    { name: 'Item 3', description: 'Description for item 3' },
   //    { name: 'Item 4', description: 'Description for item 4' }
   // ];

   // constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {
   //    this.router.events.subscribe(() => {
   //       this.updateDataList();
   //    });
   // }

   // // Search for items based on the query
   // getSearchResults(query: string) {
   //    return of(
   //       this.dataList.filter(item => {
   //          return Object.values(item).some((value: any) => {
   //             // Ensure the value is a string before using `includes`
   //             const stringValue = value != null ? value.toString() : ''; // Handle null or undefined
   //             return stringValue.toLowerCase().includes(query.toLowerCase());
   //          });
   //       })
   //    );
   // }

   // getAddressData() {
   //    // In a real scenario, you would fetch this from localStorage or an API
   //    return this.apiService.getLocalValueInJSON(localStorage.getItem('address'));
   // }

   // getOrderData() {
   //    // In a real scenario, you would fetch this from localStorage or an API
   //    return this.apiService.getLocalValueInJSON(localStorage.getItem('order'));
   // }
   // // Simulated method to get customer data (could be from localStorage, API, etc.)
   // getCustomerData() {
   //    // In a real scenario, you would fetch this from localStorage or an API
   //    return this.apiService.getLocalValueInJSON(localStorage.getItem('customer'));
   // }
   // updateDataList() {
   //    const currentUrl = this.router.url;

   //    if (currentUrl.includes('select-pickup') || currentUrl.includes('select-drop')) {
   //       this.dataList = this.getAddressData();
   //    } else if (currentUrl.includes('customers')) {
   //       this.dataList = this.getCustomerData();
   //    } else if (currentUrl.includes('orders')) {
   //       this.dataList = this.getOrderData();
   //    }

   //    else {
   //       this.dataList = [];
   //    }
   // }
}


