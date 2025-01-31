import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data-found',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './no-data-found.component.html',
  styleUrl: './no-data-found.component.css'
})
export class NoDataFoundComponent {
   @Input() imageUrl: string = 'assets/brand/nodata.gif';
   @Input() message: string = 'No data available';
}
