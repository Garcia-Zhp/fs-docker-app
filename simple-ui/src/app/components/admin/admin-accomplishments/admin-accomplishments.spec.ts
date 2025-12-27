import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccomplishments } from './admin-accomplishments';

describe('AdminAccomplishments', () => {
  let component: AdminAccomplishments;
  let fixture: ComponentFixture<AdminAccomplishments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAccomplishments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAccomplishments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
