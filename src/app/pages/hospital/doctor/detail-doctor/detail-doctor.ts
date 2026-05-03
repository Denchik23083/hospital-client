import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DoctorService } from '../../../../services/doctor.service';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { DoctorWithUserResponse } from '../../../../models/responses/doctor/doctor-with-user-responce.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-doctor',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './detail-doctor.html',
  styleUrl: './detail-doctor.css',
})
export class DetailDoctor {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly doctorService = inject(DoctorService);
  private readonly tokenStorage = inject(TokenStorageService);

  isLoading = signal(true);
  isSaving = signal(false);
  isEditMode = signal(false);
  errorMessage = signal('');

  doctor = signal<DoctorWithUserResponse | null>(null);

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    genderType: [1, [Validators.required]],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.doctorService.getDoctorByUser().subscribe({
      next: (doctor) => {
        this.doctor.set(doctor);
        this.patchForm(doctor);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки профиля');
        this.isLoading.set(false);
      },
    });
  }

  enableEdit(): void {
    const doctor = this.doctor();

    if (!doctor) {
      return;
    }

    this.patchForm(doctor);
    this.isEditMode.set(true);
    this.errorMessage.set('');
  }

  cancelEdit(): void {
    const doctor = this.doctor();

    if (doctor) {
      this.patchForm(doctor);
    }

    this.isEditMode.set(false);
    this.errorMessage.set('');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.doctorService.updateDoctorByUser(this.form.getRawValue()).subscribe({
      next: () => {
        const current = this.doctor();

        if (current) {
          const updated = {
            ...current,
            ...this.form.getRawValue()
          };

          this.doctor.set(updated);
        }

        this.isEditMode.set(false);
        this.isSaving.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка обновления профиля');
        this.isSaving.set(false);
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

  private patchForm(doctor: any): void {
    this.form.patchValue({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      genderType: doctor.genderType,
    });
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
}
