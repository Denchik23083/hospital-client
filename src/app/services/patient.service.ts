import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/patient';

  getPatientBalance(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/balance`);
  }
}
