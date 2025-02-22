import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAddressComponent } from './list-of-address.component';

describe('ListOfAddressComponent', () => {
  let component: ListOfAddressComponent;
  let fixture: ComponentFixture<ListOfAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
