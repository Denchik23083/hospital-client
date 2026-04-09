import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorSlotResponce } from '../models/responces/doctor-slot-responce.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorSlotService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/doctorslot';
  
  getAllDoctorSlotsDates(doctorId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${doctorId}/available-dates`);
  }

  getAllDoctorSlotsTimeByDate(doctorId: number, date: string): Observable<DoctorSlotResponce[]> {
    return this.http.get<DoctorSlotResponce[]>(`${this.apiUrl}/${doctorId}/available-times?date=${date}`);
  }
}
