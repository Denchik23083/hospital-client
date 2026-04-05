import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpecialtyResponce } from '../models/responces/specialty-responce.model';
import { DoctorResponce } from '../models/responces/doctor-responce.model';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/specialty';

  getAllSpecialties(): Observable<SpecialtyResponce[]> {
    return this.http.get<SpecialtyResponce[]>(this.apiUrl);
  }

  getAllDoctorsBySpecialty(specialtyId: number): Observable<DoctorResponce[]> {
    return this.http.get<DoctorResponce[]>(`${this.apiUrl}/${specialtyId}/doctors`);
  }
}
