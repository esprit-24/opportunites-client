import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const recruteurGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  const roles = authService.getUserRoles();

  if (roles.includes('ROLE_RECRUTEUR')) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }

};
