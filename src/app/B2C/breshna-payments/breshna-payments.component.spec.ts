import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreshnaPaymentsComponent } from './breshna-payments.component';

describe('BreshnaPaymentsComponent', () => {
  let component: BreshnaPaymentsComponent;
  let fixture: ComponentFixture<BreshnaPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreshnaPaymentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BreshnaPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
