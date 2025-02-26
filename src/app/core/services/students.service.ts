import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Student } from '../../modules/dashboard/pages/students/models/student.model'; // Asegúrate de tener el modelo adecuado para Student
import { environment } from '../../../environments/environment'; // Asegúrate de que la URL base esté configurada correctamente

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private apiUrl = `${environment.baseApiUrl}/students`; // URL de tu API

  constructor(private httpClient: HttpClient, private store: Store) {}

  // Obtener todos los estudiantes desde la API
  getStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(this.apiUrl);
  }

  // Obtener un estudiante por id desde la API
  getStudent(id: string): Observable<Student> {
    return this.httpClient.get<Student>(`${this.apiUrl}/${id}`);
  }

  // Agregar un estudiante usando la API
  addStudent(student: Student): Observable<Student> {
    return this.httpClient.post<Student>(this.apiUrl, student);
  }

  // Actualizar un estudiante usando la API
  updateStudent(id: string, updatedStudent: Student): Observable<Student> {
    return this.httpClient.put<Student>(`${this.apiUrl}/${id}`, updatedStudent);
  }

  // Eliminar un estudiante usando la API
  deleteStudent(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
