import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultStockComponent } from './consult-stock.component';

describe('ConsultStockComponent', () => {
  let component: ConsultStockComponent;
  let fixture: ComponentFixture<ConsultStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
