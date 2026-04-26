import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorSlotService } from '../../../../services/doctor-slot.service';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { DoctorSlotBookingResponse } from '../../../../models/responses/doctor-slot-booking-response.model';

@Component({
  selector: 'app-all-doctor-slots',
  imports: [CommonModule],
  templateUrl: './all-doctor-slots.html',
  styleUrl: './all-doctor-slots.css',
})
export class AllDoctorSlots {
  private readonly doctorSlotService = inject(DoctorSlotService);
  private readonly router = inject(Router);

  private readonly tokenStorage = inject(TokenStorageService);

  dates = signal<string[]>([]);
  times = signal<DoctorSlotBookingResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
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

  back() {
    this.router.navigate(['/']);
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}
