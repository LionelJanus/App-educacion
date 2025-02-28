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
export class StudentsFormComponent implements OnInit {
  panelOpenState = signal(false);
  searchText: string = '';
  displayedColumns: string[] = ['id', 'name', 'lastname', 'age', 'email', 'country', 'address', 'course', 'actions'];
  dataSource: Student[] = [];
  filteredDataSource: Student[] | undefined;
  studentForm!: FormGroup;
  courses: any[] = [];  // Lista de cursos

  constructor(
    private fb: FormBuilder,
    private studentsService: StudentsService,
    private coursesService: CoursesService, // Servicio para obtener cursos
    private snackBar: MatSnackBar
  ) {
    this.studentForm = this.fb.group({
      id: [generateRandomString(6), Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      address: ['', Validators.required],
      course: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();  // Cargar los cursos
  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (err) => {
        console.error('Error al cargar cursos', err);
        this.openSnackBar('Error al cargar cursos', 'Cerrar');
      },
    });
  }

  loadStudents(): void {
    this.studentsService.getStudents().subscribe({
      next: (students) => {
        this.dataSource = students;
        this.filteredDataSource = students; // Establecer el filtro inicial
      },
      error: (err) => {
        console.error('Error al cargar estudiantes', err);
        this.openSnackBar('Error al cargar estudiantes', 'Cerrar');
      },
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const newStudent: Student = { ...this.studentForm.value, isEditing: false };
      this.studentsService.addStudent(newStudent).subscribe({
        next: () => {
          this.openSnackBar('Te inscribiste exitosamente!', 'Cerrar');
          this.studentForm.reset(); // Resetea el formulario
          this.loadStudents(); // Recargar la lista de estudiantes
        },
        error: (err) => {
          this.openSnackBar('Error al Inscribirte', 'Cerrar');
          console.error('Error al agregar alumno', err);
        },
      });
    }
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000, // 3 segundos de duración
    });
  }
}
