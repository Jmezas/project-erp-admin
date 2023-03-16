import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePaymentComponent } from './type-payment.component';

describe('TypePaymentComponent', () => {
  let component: TypePaymentComponent;
  let fixture: ComponentFixture<TypePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypePaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
