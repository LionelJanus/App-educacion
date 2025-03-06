import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, Observable, of, switchMap } from 'rxjs';
import { Student } from '../../modules/dashboard/pages/students/models/student.model'; // Asegúrate de tener el modelo adecuado para Student
import { environment } from '../../../environments/environment'; // Asegúrate de que la URL base esté configurada correctamente
import { Course } from '../../modules/dashboard/pages/courses/models/courses.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private apiUrl = 'http://localhost:3000/students';

  constructor(private http: HttpClient, private store: Store) { }


// Obtener todos los estudiantes de un Profesor
  getStudentsByTeacher(teacherName: string): Observable<Student[]> {
    return this.getStudents().pipe(
      switchMap((students) =>
        this.getCourses().pipe(
          map((courses) => {
            // Filtrar los cursos que pertenecen al profesor
            const teacherCourses = courses.filter(course => course.teacher === teacherName);
            const teacherCourseIds = teacherCourses.map(course => course.id);

            // Filtrar los estudiantes inscritos en esos cursos
            return students.filter(student =>
              student.courses?.some(courseId => teacherCourseIds.includes(courseId))
            );
          })
        )
      )
    );
  }

  // Obtener todos los estudiantes desde la API
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl,);
  }

  // Servicio para obtener todos los cursos
  getCourses(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/courses');
  }


  // Obtener un estudiante por id desde la API
  getStudent(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  // Agregar un estudiante usando la API
  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  // Actualizar un estudiante usando la API
  updateStudent(id: string, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  // Eliminar un estudiante usando la API
  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

   /** 📌 Dar de baja a un estudiante de un curso */
   removeStudentFromCourse(studentId: string, courseId: string): Observable<Student> {
    return this.getStudent(studentId).pipe(
      switchMap((student) => {
        if (!student.courses) return of(student); // 🔥 Devolver Observable si no tiene cursos

        student.courses = student.courses.filter(id => id !== courseId);
        return this.updateStudent(studentId, student);
      })
    );
  }

  /** 📌 Agregar o actualizar nota de un estudiante en un curso */
  updateStudentGrade(studentId: string, courseId: string, grade: number): Observable<Student> {
    return this.getStudent(studentId).pipe(
      switchMap((student) => {
        if (!student.grades) student.grades = {};
        student.grades[courseId] = grade;
        return this.updateStudent(studentId, student);
      })
    );
  }

  /** 📌 Registrar asistencia de un estudiante */
  markAttendance(studentId: string, courseId: string, status: 'Presente' | 'Ausente'): Observable<Student> {
    return this.getStudent(studentId).pipe(
      switchMap((student) => {
        if (!student.attendance) student.attendance = {};
        if (!student.attendance[courseId]) student.attendance[courseId] = [];

        const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        student.attendance[courseId].push(`${today}: ${status}`);

        return this.updateStudent(studentId, student);
      })
    );
  }
}


