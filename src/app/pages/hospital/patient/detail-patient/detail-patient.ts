import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../../../services/patient.service';
import { Router, RouterModule } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { CommonModule } from '@angular/common';
import { PatientWithUserResponse } from '../../../../models/responses/patient/patient-with-user-response.model';

@Component({
  selector: 'app-detail-patient',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './detail-patient.html',
  styleUrl: './detail-patient.css',
})
export class DetailPatient {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly patientService = inject(PatientService);
  private readonly tokenStorage = inject(TokenStorageService);

  isLoading = signal(true);
  isSaving = signal(false);
  isEditMode = signal(false);
  errorMessage = signal('');

  patient = signal<PatientWithUserResponse | null>(null);

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    genderType: [1, [Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.patientService.getPatientByUser().subscribe({
      next: (patient) => {
        this.patient.set(patient);
        this.patchForm(patient);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки профиля');
        this.isLoading.set(false);
      },
    });
  }

  enableEdit(): void {
    const patient = this.patient();

    if (!patient) {
      return;
    }

    this.patchForm(patient);
    this.isEditMode.set(true);
    this.errorMessage.set('');
  }

  cancelEdit(): void {
    const patient = this.patient();

    if (patient) {
      this.patchForm(patient);
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

    this.patientService.updatePatientByUser(this.form.getRawValue()).subscribe({
      next: () => {
        const current = this.patient();

        if (current) {
          const updated = {
            ...current,
            ...this.form.getRawValue()
          };

          this.patient.set(updated);
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

  private patchForm(patient: any): void {
    this.form.patchValue({
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: this.toDateInputValue(patient.birthDate),
      genderType: patient.genderType,
      phone: patient.phone,
      email: patient.user.email,
      password: ''
    });
  }

  private toDateInputValue(date: string): string {
    return date.split('T')[0];
  }

  get firstName() {
    return this.form.controls.firstName;
  }

  get lastName() {
    return this.form.controls.lastName;
  }

  get birthDate() {
    return this.form.controls.birthDate;
  }

  get genderType() {
    return this.form.controls.genderType;
  }

  get phone() {
    return this.form.controls.phone;
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }
}
