import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { first, map } from 'rxjs';
import { AuthService } from '../services/user/auth.service';

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
