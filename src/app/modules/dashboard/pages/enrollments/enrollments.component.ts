import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { EnrollmentActions } from './store/enrollment.actions';
import { generateRandomString } from '../../../../shared/utils';
import { forkJoin, Observable } from 'rxjs';
import { Enrollment } from './models';
import { Course } from '../courses/models/courses.model';
import { User } from '../users/models/index';
import { CoursesService } from '../../../../core/services/courses.service';
import { UsersService } from '../../../../core/services/user.service';
import { EnrollmentsService } from '../../../../core/services/enrollments.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../students/models/student.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentsService } from '../../../../core/services/students.service';
import { selectEnrollments, selectEnrollmentsError, selectIsLoadingEnrollments } from './store/enrollment.selectors';

@Component({
  selector: 'app-enrollments',
  standalone: false,
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.scss'],
})
export class EnrollmentsComponent implements OnInit, OnDestroy {
  enrollments$: Observable<Enrollment[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<unknown>;
  panelOpenState = signal(false);
  searchText: string = '';
  displayedColumns: string[] = ['id', 'name', 'lastname', 'age', 'email', 'country', 'address', 'course', 'actions'];
  dataSource: Student[] = [];
  filteredDataSource: Student[] | undefined;
  studentForm: FormGroup;
  courses: Course[] = [];
  students: User[] = [];
  enrollmentForm: FormGroup;
  studentCourses: Course[] = [];  // Almacena los cursos del alumno

  constructor(
    private fb: FormBuilder,
    private studentsService: StudentsService,
    private coursesService: CoursesService, // Servicio para obtener cursos
    private enrollmentService: EnrollmentsService,
    private snackBar: MatSnackBar,
    private store: Store,
    private usersService: UsersService
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

    this.enrollments$ = this.store.select(selectEnrollments);
    this.error$ = this.store.select(selectEnrollmentsError);
    this.isLoading$ = this.store.select(selectIsLoadingEnrollments);
    this.enrollmentForm = this.fb.group({
      studentId: [null, Validators.required],
      courseId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    
    this.loadCourses(); // Cargar cursos    
    this.store.dispatch(EnrollmentActions.loadEnrollments());
    this.loadStudentsAndCourses();
    this.loadStudents();
    this.loadCourses();
    this.loadStudentCourses();  // Cargar los cursos del estudiante
  }

  ngOnDestroy(): void {
    this.store.dispatch(EnrollmentActions.resetState());
  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log("cursos",this.courses);
      },
      error: (err: any) => {
        console.error('Error al cargar cursos', err);
        this.openSnackBar('Error al cargar cursos', 'Cerrar');
      },
    });
  }

  loadStudents(): void {
    this.studentsService.getStudents().subscribe({
      next: (students) => {
        this.dataSource = students;
        this.filteredDataSource = students;
      },
      error: (err: any) => {
        console.error('Error al cargar estudiantes', err);
        this.openSnackBar('Error al cargar estudiantes', 'Cerrar');
      },
    });
  }

  loadStudentsAndCourses(): void {
    forkJoin([this.coursesService.getCourses(), this.usersService.getStudentUsers()]).subscribe({
      next: ([courses, students]) => {
        this.courses = courses;
        this.students = students;
      },
    });
  }

  loadStudentCourses(): void {
    const studentId = this.enrollmentForm.get('studentId')?.value;
    if (studentId) {
      this.enrollmentService.getEnrollments().subscribe({
        next: (enrollments: Enrollment[]) => {  // Tipado de las inscripciones
          this.studentCourses = enrollments
            .filter((enrollment) => enrollment.studentId === studentId) // Filtrar por studentId
            .map((enrollment) => {
              return this.courses.find((course) => course.id === enrollment.courseId); // Encontrar el curso
            })
            .filter((course) => course !== undefined); // Filtrar cursos no encontrados
        },
        error: (err: any) => {  // Tipado de error
          console.error('Error al cargar inscripciones', err);
          this.openSnackBar('Error al cargar cursos', 'Cerrar');
        }
      });
    }
  }

  createEnrollment(): void {


    if (this.enrollmentForm.valid) {
      const studentId = this.enrollmentForm.get('studentId')?.value;
      const courseId = this.enrollmentForm.get('courseId')?.value;

      console.log("Student ID:", studentId);
      console.log("Course ID:", courseId);

      if (!studentId || !courseId) {
        this.openSnackBar('Por favor, selecciona un estudiante y un curso.', 'Cerrar');
        return;
      }


      const enrollmentData: Enrollment = {
        id: generateRandomString(6),
        studentId: studentId,
        courseId: courseId
      };

      this.enrollmentService.createEnrollment(enrollmentData).subscribe({
        next: (response: Enrollment) => {
          console.log('Inscripción creada con éxito', response);
          this.openSnackBar('Inscripción realizada con éxito!', 'Cerrar');
        },
        error: (err: any) => {
          console.error('Error al crear inscripción', err);
          this.openSnackBar('Error al realizar inscripción', 'Cerrar');
        }
      });
    } else {
      console.warn("Formulario de inscripción inválido. Revisando errores...");
      console.log("Errores de enrollmentForm:", this.enrollmentForm.errors);
      this.enrollmentForm.markAllAsTouched();
      this.enrollmentForm.updateValueAndValidity();
    }
  }

  // ✅ Corrección de la función para generar un ID de longitud exacta
  generateRandomString(length: number): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  onSubmit(): void {
    console.log("Ejecutando onSubmit()");

    if (this.studentForm.valid) {
      const newStudent: Student = { ...this.studentForm.value, isEditing: false };
         // Obtener el ID del curso seleccionado
         const courseId = this.studentForm.get('course')?.value;

         if (!courseId) {
           this.openSnackBar('Error: No se seleccionó un curso.', 'Cerrar');
           return;
         } 
      this.studentsService.addStudent(newStudent).subscribe({
        next: (student) => {
          console.log("Estudiante agregado con éxito:", student);
          this.openSnackBar('Te inscribiste exitosamente!', 'Cerrar');
       
          this.loadStudents();

       
          // Asignar ID del estudiante recién creado y el curso al formulario de inscripción
          this.enrollmentForm.patchValue({
            studentId: student.id,
            courseId: courseId
          });

          // Verifica que el courseId se haya asignado correctamente
          console.log("courseId en enrollmentForm:", this.enrollmentForm.get('courseId')?.value);

          // 🔥 Forzar validación después de actualizar el formulario
          this.enrollmentForm.markAllAsTouched();
          this.enrollmentForm.updateValueAndValidity();

          // Intentar la inscripción solo si el formulario es válido
          if (this.enrollmentForm.valid) {
            console.log("Llamando a createEnrollment()");
            this.createEnrollment();
          } else {
            console.error("Formulario de inscripción inválido:", this.enrollmentForm.errors);
          }
          this.studentForm.reset();
        
        },
        error: (err: any) => {
          console.error('Error al agregar alumno', err);
          this.openSnackBar('Error al Inscribirte', 'Cerrar');
        },
      });
    } else {

      console.warn("Formulario de estudiante inválido. Revisando errores...");
      this.studentForm.markAllAsTouched();
    }
  }

 

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}
