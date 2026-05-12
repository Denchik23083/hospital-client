import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DoctorRequest } from '../models/requests/doctor-request.model';
import { DoctorFullRequest } from '../models/requests/doctor-full-request.model';
import { DoctorWithUserResponse } from '../models/responses/doctor/doctor-with-user-response.model';

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

  createDoctor(data: DoctorFullRequest): Observable<unknown> {
    return this.http.post(this.apiUrl, data);
  }

  updateDoctor(id: number, data: DoctorFullRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  updateDoctorByUser(data: DoctorRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/profile`, data);
  }

  deleteDoctor(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
