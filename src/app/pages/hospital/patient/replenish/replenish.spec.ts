import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Replenish } from './replenish';

describe('Replenish', () => {
  let component: Replenish;
  let fixture: ComponentFixture<Replenish>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Replenish],
    }).compileComponents();

    fixture = TestBed.createComponent(Replenish);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
