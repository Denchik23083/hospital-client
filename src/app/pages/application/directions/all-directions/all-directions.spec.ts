import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDirections } from './all-directions';

describe('AllDirections', () => {
  let component: AllDirections;
  let fixture: ComponentFixture<AllDirections>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDirections],
    }).compileComponents();

    fixture = TestBed.createComponent(AllDirections);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
