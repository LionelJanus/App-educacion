import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { UserActions } from '../../modules/dashboard/pages/users/store/user.actions';
import { environment } from '../../../environments/environment';
import { User } from '../../modules/dashboard/pages/users/models';

@Injectable({ providedIn: 'root' })

export class UsersService {
 

  private apiUrl = `${environment.baseApiUrl}/courses`; // URL de tu JSON server
  
  constructor(private httpClient: HttpClient, private store: Store) {}

  createUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${environment.baseApiUrl}/users`, user);
  }
  
  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${environment.baseApiUrl}/users`);
  }

  getStudentUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(
      `${environment.baseApiUrl}/users?role=STUDENT`
    );
  }

  loadUsers(): void {
    this.store.dispatch(UserActions.loadUsers());
  }

  deleteUser(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.baseApiUrl}/users/${id}`);
  }

  resetUserState(): void {
    this.store.dispatch(UserActions.resetState());
  }
}