import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/authservice';
import { map, Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const allowedRoles: string[] = route.data['roles'] || []; // Obtener los roles permitidos desde `data`

  return new Observable<boolean | import("@angular/router").UrlTree>((observer) => {
    authService.getUserRole().subscribe(userRole => {
      if (userRole && allowedRoles.includes(userRole)) {
        observer.next(true); // Permitir el acceso
      } else {
        observer.next(router.createUrlTree(['/dashboard/home'])); // Redirigir si no tiene permiso
      }
      observer.complete();
    });
  });
};
