import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginPayload } from '../../modules/auth/models';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../../modules/dashboard/pages/users/models';
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
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authUser$ = new BehaviorSubject<null | User>(null);
  authUser$ = this._authUser$.asObservable();
  private apiUrl = 'http://localhost:3000/users'; // URL del servidor json-server

  constructor(private router: Router, private http: HttpClient) {}

  // Obtener los usuarios con rol ADMIN
  get isAdmin$(): Observable<boolean> {
    return this.authUser$.pipe(map((x) => x?.role === 'ADMIN'));
  }

  // Método para crear un nuevo usuario
  createUser(newUser: User): void {
    const currentUser = this.getCurrentUser();
    if (currentUser?.role !== 'ADMIN') {
      alert('Solo los administradores pueden crear nuevos usuarios');
      return;
    }

    // Verificar si el usuario con ese email ya existe
    this.http.get<User[]>(this.apiUrl).subscribe(users => {
      if (users.some(user => user.email === newUser.email)) {
        alert('El usuario con este correo ya existe');
        return;
      }

      // Generar un ID aleatorio y un token de acceso
      newUser.id = generateRandomString(6);
      newUser.accessToken = generateRandomString(32);

      // Realizar la solicitud POST para agregar el nuevo usuario
      this.http.post(this.apiUrl, newUser).subscribe(() => {
        alert('Usuario creado con éxito');
      });
    });
  }

  // Método de login
  login(payload: LoginPayload): void {
    this.http.get<User[]>(this.apiUrl).subscribe(users => {
      const loginResult = users.find(
        (user) => user.email === payload.email && user.password === payload.password
      );
      if (!loginResult) {
        alert('Email o password inválidos');
        return;
      }
      localStorage.setItem('access_token', loginResult.accessToken);
      this._authUser$.next(loginResult);
      this.router.navigate(['dashboard', 'home']);
    });
  }

  // Método de logout
  logout(): void {
    localStorage.removeItem('access_token');
    this._authUser$.next(null);
    this.router.navigate(['auth', 'login']);
  }

  // Verificar si está autenticado
  isAuthenticated(): Observable<boolean> {
    const storedUser = localStorage.getItem('access_token') || '';
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.accessToken === storedUser);
        this._authUser$.next(user || null);
        return !!user;
      })
    );
  }

  // Obtener el rol de usuario actual
  getUserRole(): Observable<string | null> {
    return this.authUser$.pipe(
      map(user => user?.role || null)
    );
  }

  // Obtener el usuario actual
  getCurrentUser(): User | null {
    return this._authUser$.value;
  }
}