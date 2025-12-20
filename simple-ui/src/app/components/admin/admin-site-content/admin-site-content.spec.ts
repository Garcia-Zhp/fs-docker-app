import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSiteContent } from './admin-site-content';

describe('AdminSiteContent', () => {
  let component: AdminSiteContent;
  let fixture: ComponentFixture<AdminSiteContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSiteContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSiteContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
