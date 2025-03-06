import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginPayload } from '../../modules/auth/models';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../../modules/dashboard/pages/users/models';
import { generateRandomString } from '../../shared/utils';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  

  getUserId(): string {
    return localStorage.getItem('userId') || ''; 
  }
  

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
        Swal.fire("El usuario con este correo ya existe!");
        return;
      }

      // Generar un ID aleatorio y un token de acceso
      newUser.id = generateRandomString(6);
      newUser.accessToken = generateRandomString(32);

      // Realizar la solicitud POST para agregar el nuevo usuario
      this.http.post(this.apiUrl, newUser).subscribe(() => {
        Swal.fire("Usuario creado con exito!");
      });
    });
  }

  // Método de login
  login(payload: LoginPayload): Observable<User | null> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const loginResult = users.find(
          user => user.email === payload.email && user.password === payload.password
        );
        if (loginResult) {
          localStorage.setItem('access_token', loginResult.accessToken);
          localStorage.setItem('userId', loginResult.id); // Guardamos el ID del usuario también
          this._authUser$.next(loginResult);
        }
        return loginResult || null;
      })
    );
  }
  
  

  // Método de logout
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId'); // Eliminar el ID también si es necesario
    this._authUser$.next(null);
    this.router.navigate(['auth', 'login']);
  }
  

  // Verificar si está autenticado
  isAuthenticated(): Observable<boolean> {
    const storedToken = localStorage.getItem('access_token');
    if (!storedToken) {
      this._authUser$.next(null); // Si no hay token, no hay usuario autenticado
      return new Observable<boolean>((observer) => observer.next(false));
    }
  
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.accessToken === storedToken);
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