import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTags } from './admin-tags';

describe('AdminTags', () => {
  let component: AdminTags;
  let fixture: ComponentFixture<AdminTags>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTags]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTags);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
