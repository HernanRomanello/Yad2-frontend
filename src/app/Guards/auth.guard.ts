import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/user/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isUserLogin.pipe(
    map((user) => {
      if (!user) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
