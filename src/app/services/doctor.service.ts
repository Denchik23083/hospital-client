import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorWithUserResponse } from '../models/responses/doctor/doctor-with-user-responce.model';
import { HttpClient } from '@angular/common/http';
import { DoctorRequest } from '../models/requests/doctor-request.model';
import { DoctorFullRequest } from '../models/requests/doctor-full-request.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/doctor';

  getAllDoctors(): Observable<DoctorWithUserResponse[]> {
    return this.http.get<DoctorWithUserResponse[]>(this.apiUrl);
  }

  getDoctorByUser(): Observable<DoctorWithUserResponse> {
    return this.http.get<DoctorWithUserResponse>(`${this.apiUrl}/profile`);
  }

  updateDoctor(id: number, data: DoctorFullRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  updateDoctorByUser(data: DoctorRequest): Observable<unknown> {
    return this.http.put(this.apiUrl, data);
  }

  deleteDoctor(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
