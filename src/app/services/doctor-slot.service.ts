import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorSlotResponse } from '../models/responses/doctor-slot-response.model';
import { DoctorSlotBookingResponse } from '../models/responses/doctor-slot-booking-response.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorSlotService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/doctorslot';
  
  getAllDoctorSlotsDatesByDoctorAsync(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/doctor-dates`);
  }

  getAllDoctorSlotsTimesByDoctorAsync(date: string): Observable<DoctorSlotBookingResponse[]> {
    return this.http.get<DoctorSlotBookingResponse[]>(`${this.apiUrl}/doctor-times?date=${date}`);
  }

  getAllDoctorSlotsDates(doctorId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${doctorId}/available-dates`);
  }

  getAllDoctorSlotsTimeByDate(doctorId: number, date: string): Observable<DoctorSlotResponse[]> {
    return this.http.get<DoctorSlotResponse[]>(`${this.apiUrl}/${doctorId}/available-times?date=${date}`);
  }

  addDoctorSlots(date: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}?date=${date}`, null);
  }
}
