import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSpecialty } from './detail-specialty';

describe('DetailSpecialty', () => {
  let component: DetailSpecialty;
  let fixture: ComponentFixture<DetailSpecialty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSpecialty],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailSpecialty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
