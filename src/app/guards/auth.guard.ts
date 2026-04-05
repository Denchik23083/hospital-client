import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  const token = tokenStorage.getAccessToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // 👉 если роли не заданы — пускаем
  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  if (!requiredRoles) return true;

  // 👉 достаем роль из JWT
  const payload = JSON.parse(atob(token.split('.')[1]));
  const roles = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  const hasAccess =
    Array.isArray(roles)
      ? roles.some(r => requiredRoles.includes(r))
      : requiredRoles.includes(roles);

  if (!hasAccess) {
    router.navigate(['/specialties']); // или на 403 страницу
    return false;
  }

  return true;
};
