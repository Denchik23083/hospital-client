import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAdmin } from './detail-admin';

describe('DetailAdmin', () => {
  let component: DetailAdmin;
  let fixture: ComponentFixture<DetailAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
