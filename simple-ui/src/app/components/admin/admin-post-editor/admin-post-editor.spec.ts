import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPostEditor } from './admin-post-editor';

describe('AdminPostEditor', () => {
  let component: AdminPostEditor;
  let fixture: ComponentFixture<AdminPostEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPostEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPostEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
