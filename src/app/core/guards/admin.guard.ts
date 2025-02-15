import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authservice';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  console.log('[adminGuard] Se disparó adminGuard');

  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.getUserRole().pipe(
    map((role) => {
      if (role === 'ADMIN') {
        return true;
      }
      return router.createUrlTree(['/dashboard/home']); // Redirigir si no es admin
    })
  );
};
