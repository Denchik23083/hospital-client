import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingResponse } from '../models/responses/booking-response.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/booking';

  getAllBookings(): Observable<BookingResponse[]> {
      return this.http.get<BookingResponse[]>(this.apiUrl);
  }

  createBooking(slotId: number): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/${slotId}`, null);
  }

  completeBooking(bookingId: number) {
    return this.http.put(`${this.apiUrl}/${bookingId}/complete`, null);
  }

  cancelBooking(bookingId: number) {
    return this.http.put(`${this.apiUrl}/${bookingId}/cancel`, null);
  }
}
