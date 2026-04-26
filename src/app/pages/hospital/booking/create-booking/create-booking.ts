import { Component, inject, signal } from '@angular/core';
import { BookingService } from '../../../../services/booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { CommonModule } from '@angular/common';
import { DoctorSlotResponse } from '../../../../models/responses/doctor-slot-response.model';
import { DoctorSlotService } from '../../../../services/doctor-slot.service';

@Component({
  selector: 'app-create-booking',
  imports: [CommonModule],
  templateUrl: './create-booking.html',
  styleUrl: './create-booking.css',
})
export class CreateBooking {
  private readonly bookingService = inject(BookingService);
  private readonly doctorSlotService = inject(DoctorSlotService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly tokenStorage = inject(TokenStorageService);

  dates = signal<string[]>([]);
  times = signal<DoctorSlotResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  selectedDate = signal<string | null>(null);
  isPatient = signal(false);

  ngOnInit() {
    this.checkRole();
    this.load();
  }

  load() {
    const specialtyId = Number(this.route.snapshot.paramMap.get('specialtyId'));

    if (!specialtyId) {
      this.errorMessage.set('Некорректный id направления');
      this.isLoading.set(false);
      return;
    }

    const doctorId = Number(this.route.snapshot.paramMap.get('doctorId'));

    if (!doctorId) {
      this.errorMessage.set('Некорректный id доктора');
      this.isLoading.set(false);
      return;
    }

    this.doctorSlotService.getAllDoctorSlotsDates(doctorId).subscribe({
      next: (data) => {
        this.dates.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки дат');
        this.isLoading.set(false);
      }
    });
  }

  checkRole() {
    const token = this.tokenStorage.getAccessToken();

    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));

    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === 'Patient') {
      this.isPatient.set(true);
    }
  }

  getTime(date: string) {
    const doctorId = Number(this.route.snapshot.paramMap.get('doctorId'));

    if (!doctorId) {
      this.errorMessage.set('Некорректный id доктора');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.selectedDate.set(date);

    this.doctorSlotService.getAllDoctorSlotsTimeByDate(doctorId, date).subscribe({
      next: (data) => {
        this.times.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки времени');
        this.times.set([]);
        this.isLoading.set(false);
      }
    });
  }

  showDates() {
    this.selectedDate.set(null);
    this.times.set([]);
  }

  createBooking(slotId: number){
    this.bookingService.createBooking(slotId).subscribe({
      next: () => {
        alert('Вы успешно записались');

        this.router.navigate(['/']);
      },
      error: () => {
        alert('Ошибка при записи');
      }
    });
  }

  back() {
    const specialtyId = Number(this.route.snapshot.paramMap.get('specialtyId'));

    if (!specialtyId) {
      this.errorMessage.set('Некорректный id направления');
      return;
    }

    this.router.navigate(['/specialties', specialtyId, 'doctors']);
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}
