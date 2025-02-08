import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDialogFormComponent } from './student-dialog-form.component';

describe('StudentDialogFormComponent', () => {
  let component: StudentDialogFormComponent;
  let fixture: ComponentFixture<StudentDialogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentDialogFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
