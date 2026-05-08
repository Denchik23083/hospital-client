import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NotificationResponce } from '../models/responses/others/notification-responce.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/hospital/notification';

  getAllNotifications(): Observable<NotificationResponce[]> {
    return this.http.get<NotificationResponce[]>(this.apiUrl);
  }

  deleteNotification(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
