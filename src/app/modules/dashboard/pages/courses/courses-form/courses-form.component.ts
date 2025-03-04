import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoursesService } from '../../../../../core/services/courses.service'; 
import { generateRandomString } from '../../../../../shared/utils';
import { AuthService } from '../../../../../core/services/authservice';
import { Course } from '../models/courses.model';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';  // Importa el servicio MatDialog
import { CourseDetailsDialogComponent } from '../course-details-dialog/course-details-dialog.component';  // Ajusta la ruta si es necesario



@Component({
  selector: 'app-courses-form',
  standalone: false,
  templateUrl: './courses-form.component.html',
  styleUrls: ['./courses-form.component.scss']
})
export class CoursesFormComponent implements OnInit {

  searchText: string = '';
  daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  displayedColumns: string[] = ['id', 'courseName', 'description','courseDays','startTime','endTime','duration', 'teacher', 'actions'];
  dataSource: Course[] = [];
  filteredDataSource: Course[] | undefined;
  courseForm!: FormGroup; // Formulario para agregar o editar cursos
  readonly panelOpenState = signal(false);
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private snackBar: MatSnackBar,
    private authService: AuthService,  // Inyecta el servicio de autenticación
    private dialog: MatDialog  // Inyecta el servicio MatDialog para mostrar modales
  ) {
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', Validators.required],
      teacher: ['', Validators.required],
      courseDays: [[], Validators.required],   
      startTime: ['', Validators.required],    
      endTime: ['', Validators.required]       
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
  
  // Nueva función para verificar conflicto de horario
  checkForScheduleConflict(newCourse: Course): boolean {
    return this.dataSource.some(course => 
      course.courseDays.some(day => newCourse.courseDays.includes(day)) &&
      course.startTime === newCourse.startTime &&
      course.endTime === newCourse.endTime
    );
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const newCourse: Course = { ...this.courseForm.value, isEditing: false };

       // Validar si hay conflicto de horario
       if (this.checkForScheduleConflict(newCourse)) {
        Swal.fire({
          icon: 'error',
          title: 'Conflicto de horario',
          text: 'Ya existe un curso en los mismos días y horario.',
        });
        return;
      }
      
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

  // Nueva función para ver detalles del curso
  viewCourseDetails(course: Course): void {
    this.coursesService.getCourseDetails(course.id).subscribe((details) => {
      // Abre un modal o muestra los detalles de alguna otra forma
      this.openDetailsDialog(details);
    });
  }

  // Función para abrir un modal con los detalles del curso
  openDetailsDialog(course: any): void {
    const dialogRef = this.dialog.open(CourseDetailsDialogComponent, {
      width: '400px',
      data: course,
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('El diálogo de detalles del curso se cerró');
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
