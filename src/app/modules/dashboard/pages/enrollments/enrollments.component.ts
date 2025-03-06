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
import Swal from 'sweetalert2';

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
       
      },
      error: (err: any) => {
      
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
        
          this.openSnackBar('Error al cargar cursos', 'Cerrar');
        }
      });
    }
  }

  createEnrollment(studentId: string, courseId: string): void {
    this.enrollmentService.getEnrollments().subscribe((enrollments) => {
      const existingEnrollment = enrollments.find(
        (enrollment) => enrollment.studentId === studentId && enrollment.courseId === courseId
      );
  
      if (existingEnrollment) {
        this.openSnackBar('El estudiante ya está inscrito en este curso.', 'Cerrar');
        return;
      }
  
      const enrollmentData: Enrollment = {
        id: generateRandomString(6),
        studentId,
        courseId
      };
  
      this.enrollmentService.createEnrollment(enrollmentData).subscribe({
        next: () => {
        
          this.openSnackBar('Inscripción realizada con éxito!', 'Cerrar');
        },
        error: (err) => console.error('Error al realizar inscripción', err)
      });
    });
  }
  
  

  // ✅ Corrección de la función para generar un ID de longitud exacta
  generateRandomString(length: number): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formData = this.studentForm.value;
  
      this.studentsService.getStudents().subscribe((students) => {
        const existingStudent = students.find(student => student.email === formData.email);
  
        if (existingStudent) {
          // Verificar si ya está inscrito en el curso
          if (existingStudent.courses && existingStudent.courses.includes(formData.course)) {
            Swal.fire({
              title: 'Estudiante ya inscrito',
              text: `El estudiante ${existingStudent.name} ya está inscrito en el curso ${formData.course}.`,
              icon: 'info',  // Usamos 'info' porque el estudiante ya está inscrito
              confirmButtonText: 'Cerrar',
            });
          } else {
            // Si no está inscrito en el curso, agregarlo
            const updatedStudent: Student = {
              ...existingStudent,
              courses: [...(existingStudent.courses || []), formData.course]
            };
  
            this.studentsService.updateStudent(existingStudent.id, updatedStudent).subscribe({
              next: () => {
                Swal.fire({
                  title: 'Inscripción exitosa',
                  text: `El estudiante ${existingStudent.name} ha sido inscrito en el curso ${formData.courseName}.`,
                  icon: 'success',  // Usamos 'success' porque ahora el estudiante está inscrito
                  confirmButtonText: 'Cerrar',
                });
                this.createEnrollment(existingStudent.id, formData.course);
              },
              error: (err) => console.error('Error al actualizar inscripción', err)
            });
          }
        } else {
          const newStudent: Student = { 
            id: generateRandomString(6), 
            ...formData, 
            courses: [formData.course],  // Se almacena como array
            isEditing: false 
          };
  
          this.studentsService.addStudent(newStudent).subscribe({
            next: (student) => {
              Swal.fire({
                title: 'Estudiante agregado',
                text: `El estudiante ${student.name} ha sido registrado y asignado al curso ${formData.course}.`,
                icon: 'success',  // Usamos 'success' porque el estudiante fue agregado y asignado al curso
                confirmButtonText: 'Cerrar',
              });
              this.createEnrollment(student.id, formData.course);
            },
            error: (err) => console.error('Error al agregar alumno', err)
          });
        }
      });
    } else {
      console.warn("Formulario de estudiante inválido.");
      this.studentForm.markAllAsTouched();
    }
  }
  
  
  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }

   
  
}
