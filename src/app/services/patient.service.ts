import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientRequest } from '../models/requests/patient-request.model';
import { PatientWithUserResponse } from '../models/responses/patient/patient-with-user-responce.model';
import { PatientReplenishBalanceRequest } from '../models/requests/patient-replenish-balance-request.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/patient';

  getPatientByUser(): Observable<PatientWithUserResponse> {
    return this.http.get<PatientWithUserResponse>(`${this.apiUrl}/profile`);
  }

  getPatientBalance(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/balance`);
  }

  updatePatientByUser(data: PatientRequest): Observable<unknown> {
    return this.http.put(this.apiUrl, data);
  }

  replenishBalance(data: PatientReplenishBalanceRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/replenish`, data);
  }
}
