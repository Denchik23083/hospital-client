import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorResponse } from '../models/responses/doctor/doctor-response.model';
import { SpecialtyResponse } from '../models/responses/others/specialty-response.model';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/specialty';

  getAllSpecialties(): Observable<SpecialtyResponse[]> {
    return this.http.get<SpecialtyResponse[]>(this.apiUrl);
  }

  getSpecialtyPrice(specialtyId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${specialtyId}/price`);
  }

  getAllDoctorsBySpecialty(specialtyId: number): Observable<DoctorResponse[]> {
    return this.http.get<DoctorResponse[]>(`${this.apiUrl}/${specialtyId}/doctors`);
  }
}
