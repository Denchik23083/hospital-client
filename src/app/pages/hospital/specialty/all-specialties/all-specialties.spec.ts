import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSpecialties } from './all-specialties';

describe('AllSpecialties', () => {
  let component: AllSpecialties;
  let fixture: ComponentFixture<AllSpecialties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSpecialties],
    }).compileComponents();

    fixture = TestBed.createComponent(AllSpecialties);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
