import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
   let component: LayoutComponent;
   let fixture: ComponentFixture<LayoutComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [LayoutComponent]
      })
         .compileComponents();

      fixture = TestBed.createComponent(LayoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
