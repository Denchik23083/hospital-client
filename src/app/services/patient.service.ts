import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientRequest } from '../models/requests/patient-request.model';
import { PatientWithUserResponse } from '../models/responses/patient/patient-with-user-responce.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/patient';

  getPatient(): Observable<PatientWithUserResponse> {
    return this.http.get<PatientWithUserResponse>(`${this.apiUrl}/profile`);
  }

  getPatientBalance(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/balance`);
  }

  updatePatient(data: PatientRequest): Observable<unknown> {
    return this.http.put<unknown>(this.apiUrl, data);
  }
}
