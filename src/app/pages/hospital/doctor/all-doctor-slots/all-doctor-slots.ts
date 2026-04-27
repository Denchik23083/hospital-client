import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorSlotService } from '../../../../services/doctor-slot.service';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { DoctorSlotBookingResponse } from '../../../../models/responses/doctor-slot-booking-response.model';
import { BookingService } from '../../../../services/booking.service';

@Component({
  selector: 'app-all-doctor-slots',
  imports: [CommonModule],
  templateUrl: './all-doctor-slots.html',
  styleUrl: './all-doctor-slots.css',
})
export class AllDoctorSlots {
  private readonly doctorSlotService = inject(DoctorSlotService);
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);

  private readonly tokenStorage = inject(TokenStorageService);

  dates = signal<string[]>([]);
  times = signal<DoctorSlotBookingResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  createDate = signal('');
  selectedDate = signal<string | null>(null);

  ngOnInit() {
    this.load();
  }

  load() {
    this.doctorSlotService.getAllDoctorSlotsDatesByDoctorAsync().subscribe({
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

  getTime(date: string) {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.selectedDate.set(date);

    this.doctorSlotService.getAllDoctorSlotsTimesByDoctorAsync(date).subscribe({
      next: (data) => {
        this.times.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки слотов');
        this.times.set([]);
        this.isLoading.set(false);
      }
    });
  }

  showDates() {
    this.selectedDate.set(null);
    this.times.set([]);
  }

  setCreateDate(event: Event) {
    const input = event.target as HTMLInputElement;
    this.createDate.set(input.value);
  }

  createSlots() {
    if (!this.createDate()) {
      this.errorMessage.set('Выберите дату');
      return;
    }

    this.doctorSlotService.addDoctorSlots(this.createDate()).subscribe({
      next: () => {
        this.errorMessage.set('');
        this.load();

        if (this.selectedDate() === this.createDate()) {
          this.getTime(this.createDate());
        }
      },
      error: () => {
        this.errorMessage.set('Слоты на эту дату уже существуют');
      }
    });
  }

  complete(bookingId: number) {
    if (!confirm('Вы точно хотите завершить запись?')) return;

    this.bookingService.completeBooking(bookingId).subscribe({
      next: () => {
        this.times.update(list =>
          list.map(s =>
            s.lastBooking?.id === bookingId
              ? { 
                  ...s, 
                  lastBooking: {
                    ...s.lastBooking,
                    bookingStatus: 'Completed'
                  }
                }
              : s
          )
        );
      },
      error: () => {
        alert('Ошибка при завершении записи');
      }
    });
  }

  back() {
    this.router.navigate(['/']);
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}
