import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExperienceEditor } from './admin-experience-editor';

describe('AdminExperienceEditor', () => {
  let component: AdminExperienceEditor;
  let fixture: ComponentFixture<AdminExperienceEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminExperienceEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminExperienceEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
