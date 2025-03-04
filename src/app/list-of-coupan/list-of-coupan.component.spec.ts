import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfCoupanComponent } from './list-of-coupan.component';

describe('ListOfCoupanComponent', () => {
  let component: ListOfCoupanComponent;
  let fixture: ComponentFixture<ListOfCoupanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfCoupanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfCoupanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
