import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule here

@Component({
   selector: 'app-root',
   standalone: true,
   imports: [MenubarModule, RouterOutlet, FormsModule],  // Add FormsModule here
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent {
}
