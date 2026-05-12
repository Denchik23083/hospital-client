import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { DoctorService } from '../../../../services/doctor.service';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { SpecialtyResponse } from '../../../../models/responses/others/specialty-response.model';
import { DoctorWithUserResponse } from '../../../../models/responses/doctor/doctor-with-user-response.model';
import { SpecialtyService } from '../../../../services/specialty.service';

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
  private readonly specialtyService = inject(SpecialtyService);
  private readonly tokenStorage = inject(TokenStorageService);

  specialties = signal<SpecialtyResponse[]>([]);
  doctors = signal<DoctorWithUserResponse[]>([]);
  selectedDoctor = signal<DoctorWithUserResponse | null>(null);

  nameFilter = signal('');
  specialtyFilter = signal<number>(0);
  genderFilter = signal<number>(0);

  filteredDoctors = computed(() => {
    const name = this.nameFilter().trim().toLowerCase();
    const specialtyId = this.specialtyFilter();
    const gender = this.genderFilter();

    return this.doctors().filter((doctor) => {
      const firstName = doctor.firstName.toLowerCase();
      const lastName = doctor.lastName.toLowerCase();

      const matchesName =
        !name ||
        firstName.startsWith(name) ||
        lastName.startsWith(name);

      const matchesSpecialty =
        specialtyId === 0 || doctor.specialty.id === specialtyId;

      const matchesGender =
        gender === 0 || doctor.genderType === gender;

      return matchesName && matchesSpecialty && matchesGender;
    });
  });

  formMode = signal<'create' | 'edit' | null>(null);

  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    genderType: [1, [Validators.required]],
    experienceYears: [1, [Validators.required, Validators.min(1)]],
    workDayStart: ['09:00', [Validators.required]],
    workDayEnd: ['17:00', [Validators.required]],
    specialtyId: [0, [Validators.required, Validators.min(1)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.specialtyService.getAllSpecialties().subscribe({
      next: (specialties) => {
        this.specialties.set(specialties);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки направлений');
        this.isLoading.set(false);
      },
    });

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

  enableCreate(): void {
    this.selectedDoctor.set(null);
    this.formMode.set('create');
    this.errorMessage.set('');

    this.form.reset({
      firstName: '',
      lastName: '',
      genderType: 1,
      experienceYears: 1,
      workDayStart: '09:00',
      workDayEnd: '17:00',
      specialtyId: 0,
      email: '',
      password: '',
    });

    this.password.setValidators([Validators.required]);
    this.password.updateValueAndValidity();
  }

  enableEdit(doctor: DoctorWithUserResponse): void {
    this.selectedDoctor.set(doctor);
    this.formMode.set('edit');
    this.errorMessage.set('');

    this.form.patchValue({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      genderType: doctor.genderType,
      experienceYears: doctor.experienceYears,
      workDayStart: this.normalizeTime(doctor.workDayStart),
      workDayEnd: this.normalizeTime(doctor.workDayEnd),
      specialtyId: doctor.specialty.id,
      email: doctor.user.email,
      password: '',
    });

    this.password.clearValidators();
    this.password.updateValueAndValidity();
  }

  cancelForm(): void {
    this.selectedDoctor.set(null);
    this.formMode.set(null);
    this.errorMessage.set('');

    this.form.reset({
      firstName: '',
      lastName: '',
      genderType: 1,
      experienceYears: 1,
      workDayStart: '09:00',
      workDayEnd: '17:00',
      specialtyId: 0,
      email: '',
      password: '',
    });
  }

  submit(): void {
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

    if (this.formMode() === 'create') {
      this.createDoctor();
      return;
    }

    if (this.formMode() === 'edit') {
      this.updateDoctor();
      return;
    }
  }

  private createDoctor(): void {
    const model = this.form.getRawValue();

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.doctorService.createDoctor(model).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.cancelForm();
        this.load();
      },
      error: () => {
        this.errorMessage.set('Ошибка создания доктора');
        this.isSaving.set(false);
      },
    });
  }

  private updateDoctor(): void {
    const doctor = this.selectedDoctor();

    if (!doctor) {
      return;
    }

    const model = this.form.getRawValue();

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.doctorService.updateDoctor(doctor.id, model).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.cancelForm();
        this.load();
      },
      error: () => {
        this.errorMessage.set('Ошибка обновления доктора');
        this.isSaving.set(false);
      },
    });
  }

  deleteDoctor(id: number): void {
    if (!confirm('Вы точно хотите удалить доктора?')) return;

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

  onNameFilterChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.nameFilter.set(value);
  }

  onSpecialtyFilterChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.specialtyFilter.set(value);
  }

  onGenderFilterChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.genderFilter.set(value);
  }

  clearFilters(): void {
    this.nameFilter.set('');
    this.specialtyFilter.set(0);
    this.genderFilter.set(0);
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

  get specialtyId() {
    return this.form.controls.specialtyId;
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }
}