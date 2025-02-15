import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoursesService } from '../../../../../core/services/courses.service'; 
import { generateRandomString } from '../../../../../shared/utils';
import { Course } from '../models/courses.model';

@Component({
  selector: 'app-courses-form',
  standalone: false,
  templateUrl: './courses-form.component.html',
  styleUrls: ['./courses-form.component.scss']
})
export class CoursesFormComponent implements OnInit {

  searchText: string = '';
  displayedColumns: string[] = ['id', 'courseName', 'description', 'duration', 'teacher', 'actions'];
  dataSource: Course[] = [];
  filteredDataSource: Course[] | undefined;
  courseForm!: FormGroup; // Formulario para agregar o editar cursos
  readonly panelOpenState = signal(false);
  isSubmitting: boolean = false;

  
  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private snackBar: MatSnackBar
  ) {
    this.courseForm = this.fb.group({
      id: [generateRandomString(6), Validators.required], 
      courseName: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      teacher: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCourses(); // Cargar los cursos desde el servicio
  }

  // Función para cargar los cursos desde el servidor
  loadCourses(): void {
    this.coursesService.getCourses().subscribe(
      (courses) => {
        this.dataSource = courses;
        this.filteredDataSource = [...this.dataSource];
      },
      (error) => {
        this.openSnackBar('Error al cargar los cursos', 'Cerrar');
      }
    );
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const newCourse: Course = { ...this.courseForm.value, isEditing: false };
      this.coursesService.addCourse(newCourse).subscribe(
        (addedCourse) => {
          this.dataSource.push(addedCourse);
          this.filteredDataSource = [...this.dataSource];
          this.openSnackBar('Curso agregado exitosamente!', 'Cerrar');
          this.courseForm.reset();
          this.courseForm.patchValue({ id: generateRandomString(6) });
        },
        (error) => {
          this.openSnackBar('Error al agregar el curso', 'Cerrar');
        }
      );
    }
  }

  enableEdit(index: number): void {
    this.dataSource = this.dataSource.map((course, i) => 
      i === index ? { ...course, isEditing: true } : { ...course, isEditing: false }
    );
    this.filteredDataSource = [...this.dataSource]; // Forzar la actualización
  }
  
  
  
  saveEdit(index: number): void {
    const updatedCourse = { ...this.dataSource[index], isEditing: false }; // Asegurar que se quite isEditing
    const courseId = updatedCourse.id;  
  
    this.coursesService.updateCourse(courseId, updatedCourse).subscribe(
      (updated) => {
        this.dataSource[index] = { ...updated, isEditing: false }; // Mantener la reactividad
        this.filteredDataSource = [...this.dataSource]; // Forzar actualización de la lista
        this.openSnackBar('Curso actualizado exitosamente!', 'Cerrar');
      },
      (error) => {
        this.openSnackBar('Error al actualizar el curso', 'Cerrar');
      }
    );
  }
  
  

  cancelEdit(index: number): void {
    this.loadCourses(); // Recargar desde el servidor para evitar inconsistencias
  }
  

  deleteCourse(index: number): void {
    const courseId = this.dataSource[index].id;
    this.coursesService.deleteCourse(courseId).subscribe(
      () => {
        this.dataSource.splice(index, 1);
        this.filteredDataSource = [...this.dataSource];
        this.openSnackBar('Curso eliminado exitosamente!', 'Cerrar');
      },
      (error) => {
        this.openSnackBar('Error al eliminar el curso', 'Cerrar');
      }
    );
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }

  applyFilter(): void {
    const filterValue = this.searchText.trim().toLowerCase();
    if (filterValue) {
      this.filteredDataSource = this.dataSource.filter((course) =>
        course.courseName.toLowerCase().includes(filterValue) ||
        course.teacher.toLowerCase().includes(filterValue)
      );
    } else {
      this.filteredDataSource = this.dataSource;
    }
  }
}
