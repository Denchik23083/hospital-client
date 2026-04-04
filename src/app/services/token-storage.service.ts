import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly accessTokenKey = 'accessToken';
  private readonly refreshTokenKey = 'refreshToken';

  setTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(this.accessTokenKey, accessToken);
    sessionStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.refreshTokenKey);
  }

  clearTokens(): void {
    sessionStorage.removeItem(this.accessTokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
  }

  hasAccessToken(): boolean {
    return !!this.getAccessToken();
  }

  hasRefreshToken(): boolean {
    return !!this.getRefreshToken();
  }

  getUserIdFromToken(): number | null {
    const token = this.getAccessToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

      return userId ? Number(userId) : null;
    } catch {
      return null;
    }
  }
}