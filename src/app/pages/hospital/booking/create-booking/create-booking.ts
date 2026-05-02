import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { BookingService } from '../../../../services/booking.service';
import { DoctorSlotService } from '../../../../services/doctor-slot.service';
import { SpecialtyService } from '../../../../services/specialty.service';
import { PatientService } from '../../../../services/patient.service';
import { TokenStorageService } from '../../../../services/token-storage.service';

import { DoctorSlotResponse } from '../../../../models/responses/doctor-slot/doctor-slot-response.model';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-booking.html',
  styleUrl: './create-booking.css',
})
export class CreateBooking {
  private readonly bookingService = inject(BookingService);
  private readonly doctorSlotService = inject(DoctorSlotService);
  private readonly specialtyService = inject(SpecialtyService);
  private readonly patientService = inject(PatientService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  dates = signal<string[]>([]);
  times = signal<DoctorSlotResponse[]>([]);

  isLoading = signal(true);
  errorMessage = signal('');
  selectedDate = signal<string | null>(null);

  isPatient = signal(false);
  isAdmin = signal(false);

  price = signal(0);
  balance = signal(0);

  ngOnInit(): void {
    this.checkRole();
    this.load();
  }

  load(): void {
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

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.specialtyService.getSpecialtyPrice(specialtyId).subscribe({
      next: (data) => {
        this.price.set(data);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки цены');
      },
    });

    if (this.isPatient()) {
      this.patientService.getPatientBalance().subscribe({
        next: (data) => {
          this.balance.set(data);
        },
        error: () => {
          this.errorMessage.set('Ошибка загрузки баланса');
        },
      });
    } else {
      this.balance.set(0);
    }

    const datesRequest = this.isAdmin()
      ? this.doctorSlotService.getAdminDoctorSlotsDates(doctorId)
      : this.doctorSlotService.getAllDoctorSlotsDates(doctorId);

    datesRequest.subscribe({
      next: (data) => {
        this.dates.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки дат');
        this.isLoading.set(false);
      },
    });
  }

  getTime(date: string): void {
    const doctorId = Number(this.route.snapshot.paramMap.get('doctorId'));

    if (!doctorId) {
      this.errorMessage.set('Некорректный id доктора');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.selectedDate.set(date);

    const timesRequest = this.isAdmin()
      ? this.doctorSlotService.getAdminDoctorSlotsTimeByDate(doctorId, date)
      : this.doctorSlotService.getAllDoctorSlotsTimeByDate(doctorId, date);

    timesRequest.subscribe({
      next: (data) => {
        this.times.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки времени');
        this.times.set([]);
        this.isLoading.set(false);
      },
    });
  }

  createBooking(slotId: number): void {
    if (!this.isPatient()) {
      return;
    }

    if (!confirm('Вы точно хотите записаться на прием?')) {
      return;
    }

    this.bookingService.createBooking(slotId).subscribe({
      next: () => {
        alert('Вы успешно записались');
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Ошибка при записи');
      },
    });
  }

  showDates(): void {
    this.selectedDate.set(null);
    this.times.set([]);
  }

  back(): void {
    const specialtyId = Number(this.route.snapshot.paramMap.get('specialtyId'));

    if (!specialtyId) {
      this.errorMessage.set('Некорректный id направления');
      return;
    }

    this.router.navigate(['/specialties', specialtyId, 'doctors']);
  }

  logout(): void {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }

  private checkRole(): void {
    const token = this.tokenStorage.getAccessToken();

    if (!token) {
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    this.isPatient.set(role === 'Patient');
    this.isAdmin.set(role === 'Admin');
  }
}