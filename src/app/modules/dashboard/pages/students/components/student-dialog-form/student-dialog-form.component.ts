import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-dialog-form',
  standalone: false,
  templateUrl: './student-dialog-form.component.html',
  styleUrl: './student-dialog-form.component.scss'
})
export class StudentDialogFormComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Student,
    private dialogRef: MatDialogRef<StudentDialogFormComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close();  // Esto cierra el diálogo
  }
}

