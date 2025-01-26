import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { RouterOutlet } from '@angular/router';

@Component({
   selector: 'app-root',
   standalone: true,
   imports: [MenubarModule, RouterOutlet],
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent {
   
}
