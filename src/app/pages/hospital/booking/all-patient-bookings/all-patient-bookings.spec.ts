import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPatientBookings } from './all-patient-bookings';

describe('AllPatientBookings', () => {
  let component: AllPatientBookings;
  let fixture: ComponentFixture<AllPatientBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPatientBookings],
    }).compileComponents();

    fixture = TestBed.createComponent(AllPatientBookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
