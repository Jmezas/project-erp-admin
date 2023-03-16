import { TestBed } from '@angular/core/testing';

import { TypePaymentService } from './type-payment.service';

describe('TypePaymentService', () => {
  let service: TypePaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypePaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
