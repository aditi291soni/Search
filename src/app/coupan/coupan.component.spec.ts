import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupanComponent } from './coupan.component';

describe('CoupanComponent', () => {
  let component: CoupanComponent;
  let fixture: ComponentFixture<CoupanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoupanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoupanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
