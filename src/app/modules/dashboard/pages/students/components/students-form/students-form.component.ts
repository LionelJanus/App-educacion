import { Component, OnInit, signal } from '@angular/core';
import { StudentsService } from '../../../../../../core/services/students.service';
import { CoursesService } from '../../../../../../core/services/courses.service'; // Asegúrate de tener este servicio
import { Student } from '../../models/student.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { generateRandomString } from '../../../../../../shared/utils';

@Component({
  selector: 'app-students-form',
  standalone: false,
  templateUrl: './students-form.component.html',
  styleUrls: ['./students-form.component.scss'],
})
export class StudentsFormComponent  {

}
