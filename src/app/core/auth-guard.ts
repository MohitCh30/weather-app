import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = localStorage.getItem('loggedInUser');
  const guest = sessionStorage.getItem('guest') === '1';

  if (user || guest) return true;

  router.navigateByUrl('/');
  return false;
};
