import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoursesService } from '../../../../../core/services/courses.service'; 
import { generateRandomString } from '../../../../../shared/utils';
import { AuthService } from '../../../../../core/services/authservice';
import { Course } from '../models/courses.model';
import Swal from 'sweetalert2';

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
    private snackBar: MatSnackBar,
    private authService: AuthService // Inyecta el servicio de autenticación
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
  
  loadCourses(): void {
    const currentUser = this.authService.getCurrentUser(); // Obtener el usuario actual (profesor o admin)
    
    if (currentUser) {
      if (currentUser.role === 'ADMIN') {
        // Si el rol es ADMIN, carga todos los cursos sin filtro
        this.coursesService.getCourses().subscribe(
          (courses) => {
            this.dataSource = courses;  // No se aplica ningún filtro por profesor
            this.filteredDataSource = [...this.dataSource];
          },
          (error) => {
            this.openSnackBar('Error al cargar los cursos', 'Cerrar');
          }
        );
      } else if (currentUser.role === 'TEACHER') {
        // Si el rol es TEACHER, filtra los cursos por el nombre del profesor
        this.coursesService.getCourses().subscribe(
          (courses) => {
            this.dataSource = courses.filter(course => course.teacher === currentUser.name); // Filtrar por nombre de profesor
            this.filteredDataSource = [...this.dataSource];
          },
          (error) => {
            this.openSnackBar('Error al cargar los cursos', 'Cerrar');
          }
        );
      } else {
        this.openSnackBar('No tienes permisos para ver los cursos', 'Cerrar');
      }
    } else {
      this.openSnackBar('No se pudo obtener la información del usuario', 'Cerrar');
    }
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
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.coursesService.deleteCourse(courseId).subscribe(
          () => {
            this.dataSource.splice(index, 1);
            this.filteredDataSource = [...this.dataSource];
            Swal.fire('Eliminado', 'El curso ha sido eliminado con éxito.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'Hubo un problema al eliminar el curso.', 'error');
          }
        );
      }
    });
  }
  

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }

  applyFilter() {
    if (this.searchText) {
      this.filteredDataSource = this.dataSource.filter(course =>
        course.courseName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        course.teacher.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredDataSource = [...this.dataSource];
    }
  }
}