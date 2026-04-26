import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingResponce } from '../models/responces/booking-responce.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/booking';

  getAllBookings(): Observable<BookingResponce[]> {
      return this.http.get<BookingResponce[]>(this.apiUrl);
  }

  createBooking(slotId: number): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/${slotId}`, null);
  }
}
