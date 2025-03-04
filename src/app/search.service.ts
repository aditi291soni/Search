import { Injectable, signal } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class SearchService {

   constructor() { }

   searchQuery = signal('');

   setSearchQuery(query: string) {
      this.searchQuery.set(query);
   }

}
