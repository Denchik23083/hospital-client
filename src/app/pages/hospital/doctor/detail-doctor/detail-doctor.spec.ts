import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDoctor } from './detail-doctor';

describe('DetailDoctor', () => {
  let component: DetailDoctor;
  let fixture: ComponentFixture<DetailDoctor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailDoctor],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailDoctor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
