import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/booking';

  createBooking(slotId: number, userId: number): Observable<unknown> {
    return this.http.post(`${this.apiUrl}`, { slotId, userId });
  }
}
