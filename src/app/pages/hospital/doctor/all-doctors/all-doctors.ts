import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { DoctorService } from '../../../../services/doctor.service';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { DoctorWithUserResponse } from '../../../../models/responses/doctor/doctor-with-user-responce.model';

@Component({
  selector: 'app-all-doctors',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './all-doctors.html',
  styleUrl: './all-doctors.css',
})
export class AllDoctors {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly doctorService = inject(DoctorService);
  private readonly tokenStorage = inject(TokenStorageService);

  doctors = signal<DoctorWithUserResponse[]>([]);
  selectedDoctor = signal<DoctorWithUserResponse | null>(null);

  isLoading = signal(true);
  isSaving = signal(false);
  isEditMode = signal(false);
  errorMessage = signal('');

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    genderType: [1, [Validators.required]],
    experienceYears: [1, [Validators.required, Validators.min(1)]],
    workDayStart: ['09:00', [Validators.required]],
    workDayEnd: ['17:00', [Validators.required]],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.doctorService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors.set(doctors);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки докторов');
        this.isLoading.set(false);
      },
    });
  }

  enableEdit(doctor: DoctorWithUserResponse): void {
    this.selectedDoctor.set(doctor);
    this.isEditMode.set(true);
    this.errorMessage.set('');

    this.form.patchValue({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      genderType: doctor.genderType,
      experienceYears: doctor.experienceYears,
      workDayStart: this.normalizeTime(doctor.workDayStart),
      workDayEnd: this.normalizeTime(doctor.workDayEnd),
    });
  }

  cancelEdit(): void {
    this.selectedDoctor.set(null);
    this.isEditMode.set(false);
    this.errorMessage.set('');

    this.form.reset({
      firstName: '',
      lastName: '',
      genderType: 1,
      experienceYears: 0,
      workDayStart: '09:00',
      workDayEnd: '17:00',
    });
  }

  submit(): void {
    const doctor = this.selectedDoctor();

    if (!doctor) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const model = this.form.getRawValue();

    if (!this.isValidWorkTime(model.workDayStart, model.workDayEnd)) {
      this.errorMessage.set(
        'Рабочее время должно быть c 09:00 до 17:00 и только c шагом 30 минут'
      );
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.doctorService.updateDoctor(doctor.id, model).subscribe({
      next: () => {
        const updatedDoctor: DoctorWithUserResponse = {
          ...doctor,
          firstName: model.firstName,
          lastName: model.lastName,
          genderType: model.genderType,
          experienceYears: model.experienceYears,
          workDayStart: model.workDayStart,
          workDayEnd: model.workDayEnd,
        };

        this.doctors.update((doctors) =>
          doctors.map((d) => (d.id === doctor.id ? updatedDoctor : d))
        );

        this.selectedDoctor.set(null);
        this.isEditMode.set(false);
        this.isSaving.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка обновления доктора');
        this.isSaving.set(false);
      },
    });
  }

  deleteDoctor(id: number): void {
    this.doctorService.deleteDoctor(id).subscribe({
      next: () => {
        this.doctors.update((doctors) => doctors.filter((d) => d.id !== id));
      },
      error: () => {
        this.errorMessage.set('Ошибка удаления доктора');
      },
    });
  }

  back(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }

  private normalizeTime(time: string): string {
    return time.slice(0, 5);
  }

  private isValidWorkTime(start: string, end: string): boolean {
    return (
      start >= '09:00' &&
      end <= '17:00' &&
      start < end &&
      this.isValidHalfHour(start) &&
      this.isValidHalfHour(end)
    );
  }

  private isValidHalfHour(time: string): boolean {
    return time.endsWith(':00') || time.endsWith(':30');
  }

  get firstName() {
    return this.form.controls.firstName;
  }

  get lastName() {
    return this.form.controls.lastName;
  }

  get genderType() {
    return this.form.controls.genderType;
  }

  get experienceYears() {
    return this.form.controls.experienceYears;
  }

  get workDayStart() {
    return this.form.controls.workDayStart;
  }

  get workDayEnd() {
    return this.form.controls.workDayEnd;
  }
}


