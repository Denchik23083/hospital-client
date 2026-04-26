import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../models/responses/user-response.model';

@Injectable({
  providedIn: 'root',
})
export class GodService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/admin-panel/god';

  getAllAdmins(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  getAdmin(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  makeAdmin(id: number): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/${id}/make-admin`, null);
  }

  makeUser(id: number): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/${id}/make-user`, null);
  }
}
