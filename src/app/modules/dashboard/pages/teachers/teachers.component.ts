import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../../../core/services/students.service';
import { AuthService } from '../../../../core/services/authservice';
import { Student } from '../../../dashboard/pages/students/models/student.model';

@Component({
  selector: 'app-teachers',
  standalone:false,
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
})
export class TeachersComponent implements OnInit {
  students: Student[] = [];
  teacherName: string = '';

  constructor(private studentsService: StudentsService, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.teacherName = user.name;
      this.loadStudents();
    } else {
      console.error('No se encontró un usuario autenticado');
    }
  }
  
  getCourseName(courseId: string): string {
    // Simulación de obtención del nombre del curso
    const courses = [
      { id: '3c5c', courseName: 'HTML' },
      { id: 'a0b6', courseName: 'JavaScript' },
    ];
    const course = courses.find((c) => c.id === courseId);
    return course ? course.courseName : 'Desconocido';
  }

  loadStudents() {
    this.studentsService.getStudentsByTeacher(this.teacherName).subscribe((students) => {
      this.students = students;
    });
  }

  removeStudent(studentId: string, courseId: string) {
    this.studentsService.removeStudentFromCourse(studentId, courseId).subscribe(() => {
      this.loadStudents(); // Refrescar la lista de estudiantes
    });
  }
  
  setGrade(studentId: string, courseId: string, grade: number) {
    this.studentsService.updateStudentGrade(studentId, courseId, grade).subscribe(() => {
      alert('Nota actualizada correctamente');
    });
  }
  
  markAttendance(studentId: string, courseId: string, status: 'Presente' | 'Ausente') {
    this.studentsService.markAttendance(studentId, courseId, status).subscribe(() => {
      alert('Asistencia registrada correctamente');
    });
  }
  
}
