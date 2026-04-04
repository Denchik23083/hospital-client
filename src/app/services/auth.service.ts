import { inject, Injectable } from '@angular/core';
import { RegisterRequest } from '../models/requests/register-request.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../models/responces/token-responce.model';
import { LoginRequest } from '../models/requests/login-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient)

  private readonly apiUrl = '/api/auth/auth';

  register(data: RegisterRequest): Observable<unknown>{
    return this.http.post(`${this.apiUrl}/register`, data)
  }

  login(data: LoginRequest): Observable<TokenResponse>{
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, data)
  }

  refresh(userId: number, refreshToken: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.apiUrl}/refresh`,
      { userId, refreshToken }
    );
  }
}
