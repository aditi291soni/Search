import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { of } from 'rxjs';

@Component({
   selector: 'app-search-bar',
   imports: [CommonModule],
   templateUrl: './search-bar.component.html',
   styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
   dataList: any[] = [
      { name: 'Item 1', description: 'Description for item 1' },
      { name: 'Item 2', description: 'Description for item 2' },
      { name: 'Item 3', description: 'Description for item 3' },
      { name: 'Item 4', description: 'Description for item 4' }
   ];
   searchResults: any;
   searchQuery: any;
   getSearchResults(query: string) {
      return of(
         this.dataList.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
         )
      );
   }
}
