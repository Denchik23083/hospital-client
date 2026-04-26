import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDoctorSlots } from './all-doctor-slots';

describe('AllDoctorSlots', () => {
  let component: AllDoctorSlots;
  let fixture: ComponentFixture<AllDoctorSlots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDoctorSlots],
    }).compileComponents();

    fixture = TestBed.createComponent(AllDoctorSlots);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
