import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackToDashboard } from './back-to-dashboard';

describe('BackToDashboard', () => {
  let component: BackToDashboard;
  let fixture: ComponentFixture<BackToDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackToDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackToDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
