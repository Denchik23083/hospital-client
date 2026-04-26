import { Component, inject, signal } from '@angular/core';
import { BookingService } from '../../../../services/booking.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { BookingResponce } from '../../../../models/responces/booking-responce.model';

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

  bookings = signal<BookingResponce[]>([]);
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
        console.log(data)
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

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}
