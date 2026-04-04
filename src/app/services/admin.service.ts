import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponce } from '../models/responces/user-responce.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/admin-panel/admin';

  getAllUsers(): Observable<UserResponce[]> {
    return this.http.get<UserResponce[]>(this.apiUrl);
  }

  getUser(id: number): Observable<UserResponce> {
    return this.http.get<UserResponce>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
