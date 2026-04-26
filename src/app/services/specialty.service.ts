import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorResponse } from '../models/responses/doctor-response.model';
import { SpecialtyResponse } from '../models/responses/specialty-response.model';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/specialty';

  getAllSpecialties(): Observable<SpecialtyResponse[]> {
    return this.http.get<SpecialtyResponse[]>(this.apiUrl);
  }

  getAllDoctorsBySpecialty(specialtyId: number): Observable<DoctorResponse[]> {
    return this.http.get<DoctorResponse[]>(`${this.apiUrl}/${specialtyId}/doctors`);
  }
}
