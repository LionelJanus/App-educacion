import { Injectable } from '@angular/core';
import { LoginPayload } from '../../modules/auth/models';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../../modules/dashboard/pages/users/models/index';
import { generateRandomString } from '../../shared/utils';
import { Router } from '@angular/router';

const FAKE_USERS_DB: User[] = [
  {
    id: generateRandomString(6),
    email: 'admin@email.com',
    password: '123456',
    name: 'Administrador',
    accessToken: 'djMDFJNdfmvcJKDFdsmd23GFuedsvFGD2d32',
    role: 'ADMIN',
  },
  {
    id: generateRandomString(6),
    email: 'employee@email.com',
    password: '123456',
    name: 'Empleado',
    accessToken: 'djMDFJNd3gngh61DFd56hhgfddd23GFue232',
    role: 'EMPLOYEE',
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authUser$ = new BehaviorSubject<null | User>(null);
  authUser$ = this._authUser$.asObservable();

  constructor(private router: Router) {}

  get isAdmin$(): Observable<boolean> {
    return this.authUser$.pipe(map((x) => x?.role === 'ADMIN'));
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this._authUser$.next(null);
    this.router.navigate(['auth', 'login']);
  }

  login(payload: LoginPayload): void {
    const loginResult = FAKE_USERS_DB.find(
      (user) =>
        user.email === payload.email && user.password === payload.password
    );
    if (!loginResult) {
      alert('Email o password invalidos');
      return;
    }
    localStorage.setItem('access_token', loginResult.accessToken);
    this._authUser$.next(loginResult);
    this.router.navigate(['dashboard', 'home']);
  }

  isAuthenticated(): Observable<boolean> {
    /**
     * authUser = null entonces quiero retornar false
     * authUSer != null entonces quiero retornar true
     */
    const storegeUser = FAKE_USERS_DB.find(
      (x) => x.accessToken === localStorage.getItem('access_token')
    );
    this._authUser$.next(storegeUser || null);
    return this.authUser$.pipe(map((x) => !!x));
  }
}