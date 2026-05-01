import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorWithUserResponse } from '../models/responses/doctor/doctor-with-user-responce.model';
import { HttpClient } from '@angular/common/http';
import { DoctorRequest } from '../models/requests/doctor-request.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/doctor';

  getDoctor(): Observable<DoctorWithUserResponse> {
    return this.http.get<DoctorWithUserResponse>(`${this.apiUrl}/profile`);
  }

  updateDoctor(data: DoctorRequest): Observable<unknown> {
    return this.http.put<unknown>(this.apiUrl, data);
  }
}
