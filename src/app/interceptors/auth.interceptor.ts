import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

const RETRY_WITH_REFRESH = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (req.url.includes('/refresh')) {
    return next(req);
  }

  const accessToken = tokenStorage.getAccessToken();

  const authReq = accessToken
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (req.context.get(RETRY_WITH_REFRESH)) {
        tokenStorage.clearTokens();
        router.navigate(['/login']);
        return throwError(() => error);
      }

      const refreshToken = tokenStorage.getRefreshToken();
      const userId = tokenStorage.getUserIdFromToken();

      if (!refreshToken || userId === null) {
        tokenStorage.clearTokens();
        router.navigate(['/login']);
        return throwError(() => error);
      }

      return authService.refresh(userId, refreshToken).pipe(
        switchMap((tokens) => {
          tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);

          const retryReq = req.clone({
            context: req.context.set(RETRY_WITH_REFRESH, true),
            setHeaders: {
              Authorization: `Bearer ${tokens.accessToken}`
            }
          });

          return next(retryReq);
        }),
        catchError((refreshError) => {
          tokenStorage.clearTokens();
          router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};