import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Enrollment } from '../../modules/dashboard/pages/enrollments/models/index';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnrollmentsService {

  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000/api';  // Asegúrate de que esta URL sea correcta

  

  createEnrollment(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.post<Enrollment>('http://localhost:3000/enrollments', enrollment);
  }
  



  getEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.apiUrl);
  }
}