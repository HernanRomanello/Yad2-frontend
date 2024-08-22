import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/user/auth.service';
import { first, map } from 'rxjs';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isUserLogin.pipe(
    first(),
    map((user) => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
