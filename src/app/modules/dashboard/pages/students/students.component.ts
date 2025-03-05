import { Component, OnInit } from '@angular/core';
import { EnrollmentsService } from '../../../../core/services/enrollments.service';
import { CoursesService } from '../../../../core/services/courses.service';
import { AuthService } from '../../../../core/services/authservice';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from '../courses/models/courses.model';
import { Enrollment } from '../enrollments/models';

@Component({
  selector: 'app-students',
  standalone: false,
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'courseName', 'description', 'teacher', 'actions'];
  enrolledCourses: Course[] = []; // Cursos en los que el estudiante está inscrito

  constructor(
    private authService: AuthService,
    private enrollmentsService: EnrollmentsService,
    private coursesService: CoursesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStudentCourses();
  }

 loadStudentCourses(): void {
  const currentUser = this.authService.getCurrentUser();
  
  if (currentUser && currentUser.role === 'STUDENT') {
    const studentId = currentUser.id;

    this.enrollmentsService.getEnrollments().subscribe((enrollments: Enrollment[]) => {
      const studentEnrollments = enrollments.filter(enrollment => enrollment.studentId === studentId);

      const courseRequests = studentEnrollments.map(enrollment => 
        this.coursesService.getCourseById(enrollment.courseId).toPromise()
      );

      // Resolver todas las promesas y filtrar cursos no encontrados
      Promise.all(courseRequests)
        .then((courses) => {
          this.enrolledCourses = courses.filter((course): course is Course => !!course); // Filtra valores undefined
        })
        .catch(() => {
          this.openSnackBar('Error al cargar los cursos', 'Cerrar');
        });
    });
  } else {
    this.openSnackBar('No tienes permisos para ver los cursos', 'Cerrar');
  }
}

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}