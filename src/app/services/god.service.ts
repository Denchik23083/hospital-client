import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserResponce } from '../models/responces/user-responce.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GodService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/admin-panel/god';

  getAllAdmins(): Observable<UserResponce[]> {
    return this.http.get<UserResponce[]>(this.apiUrl);
  }

  getAdmin(id: number): Observable<UserResponce> {
    return this.http.get<UserResponce>(`${this.apiUrl}/${id}`);
  }

  makeAdmin(id: number): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/${id}/make-admin`, null);
  }

  makeUser(id: number): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/${id}/make-user`, null);
  }
}
