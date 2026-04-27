import { Component, inject, signal } from '@angular/core';
import { BookingService } from '../../../../services/booking.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { BookingResponse } from '../../../../models/responses/booking-response.model';

@Component({
  selector: 'app-all-patient-bookings',
  imports: [],
  templateUrl: './all-patient-bookings.html',
  styleUrl: './all-patient-bookings.css',
})
export class AllPatientBookings {
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  bookings = signal<BookingResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  //isGod = signal(false);

  ngOnInit() {
    //this.checkRole();
    this.load();
  }

  load() {
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки записей');
        this.isLoading.set(false);
      }
    });
  }

  /*checkRole() {
    const token = this.tokenStorage.getAccessToken();

    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));

    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === 'God') {
      this.isGod.set(true);
    }
  }*/

  back() {
    this.router.navigate(['/']);
  }

  cancel(bookingId: number) {
    if (!confirm('Вы точно хотите отменить запись?')) return;

    this.bookingService.cancelBooking(bookingId).subscribe({
      next: () => {
        this.bookings.update(list =>
          list.map(b =>
            b.id === bookingId
              ? { ...b, bookingStatus: 'Cancelled' }
              : b
          )
        );
      },
      error: () => {
        alert('Ошибка при отмене записи');
      }
    });
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}
