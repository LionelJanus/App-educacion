// courses.service.ts
import { Injectable } from '@angular/core';
import { Course } from '../../modules/dashboard/pages/courses/models/courses.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.development'; // Asegúrate de importar el archivo de entorno


@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = `${environment.baseApiUrl}/courses`; // URL de tu JSON server

  constructor(private httpClient: HttpClient) {}
  
  inscribeUsuario(courseId: string, userId: string): Observable<Course> {
    return this.httpClient.get<Course[]>(this.apiUrl).pipe(
      map(courses => {
        const course = courses.find(c => c.id === courseId);
        if (course && !course.enrolledUsers.includes(userId)) {
          course.enrolledUsers.push(userId);  // Agregar al usuario a la lista de inscritos
        }
        return course;
      }),
      switchMap(updatedCourse => this.httpClient.put<Course>(`${this.apiUrl}/${courseId}`, updatedCourse))  // Actualizar el curso
    );
  }
    
  getCourseById(courseId: string) {
    return this.httpClient.get<Course>(`http://localhost:3000/courses/${courseId}`);
  }
  
  // Obtener todos los cursos
  getCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(this.apiUrl);
  }

  // Obtener un curso específico por su ID
  getCourseDetails(courseId: string): Observable<Course> {
    return this.httpClient.get<Course>(`${this.apiUrl}/${courseId}`).pipe(
      map(course => {
        
        return course;
      })
    );
  }
  

  // Obtener un curso por ID
  getCourse(id: string): Observable<Course> {
    return this.httpClient.get<Course>(`${this.apiUrl}/${id}`);
  }

  // Agregar un nuevo curso
  addCourse(course: Course): Observable<Course> {
    return this.httpClient.post<Course>(this.apiUrl, course);
  }

  // Actualizar un curso existente
  updateCourse(id: string, updatedCourse: Course): Observable<Course> {
    return this.httpClient.put<Course>(`${this.apiUrl}/${id}`, updatedCourse);
  }

  // Eliminar un curso
  deleteCourse(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
