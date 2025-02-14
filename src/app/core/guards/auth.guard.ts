import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authservice';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('[authGuard] Se disparó authGuard');

  const router = inject(Router);
  const authService = inject(AuthService);


  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        return router.createUrlTree(['auth', 'login']);
      }
      return isAuthenticated;
    }),
  );
};