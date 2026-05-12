import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { PatientService } from '../../../../services/patient.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientWithUserResponse } from '../../../../models/responses/patient/patient-with-user-response.model';

@Component({
  selector: 'app-all-patients',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './all-patients.html',
  styleUrl: './all-patients.css',
})
export class AllPatients {
  private readonly router = inject(Router);
  private readonly patientService = inject(PatientService);
  private readonly tokenStorage = inject(TokenStorageService);

  isAdmin = signal(false);
  
  patients = signal<PatientWithUserResponse[]>([]);

  nameFilter = signal('');
  phoneFilter = signal('');
  genderFilter = signal<number>(0);

  filteredPatients = computed(() => {
    const name = this.nameFilter().trim().toLowerCase();
    const phone = this.phoneFilter().trim().toLowerCase();
    const gender = this.genderFilter();

    return this.patients().filter((patient) => {
      const firstName = patient.firstName.toLowerCase();
      const lastName = patient.lastName.toLowerCase();
      const patientPhone = patient.phone.toLowerCase();

      const matchesName =
        !name ||
        firstName.startsWith(name) ||
        lastName.startsWith(name);

      const matchesPhone =
        !phone ||
        patientPhone.startsWith(phone);

      const matchesGender =
        gender === 0 || patient.genderType === gender;

      return matchesName && matchesPhone && matchesGender;
    });
  });

  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.checkRole();
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.patientService.getAllPatients().subscribe({
      next: (patients) => {
        this.patients.set(patients);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки пациентов');
        this.isLoading.set(false);
      },
    });
  }

  deletePatient(id: number): void {
    if (!confirm('Вы точно хотите удалить пациента?')) return;

    this.patientService.deletePatient(id).subscribe({
      next: () => {
        this.patients.update((patients) => patients.filter((p) => p.id !== id));
      },
      error: () => {
        this.errorMessage.set('Ошибка удаления пациента');
      },
    });
  }

  checkRole() {
    const token = this.tokenStorage.getAccessToken();

    if (!token) {
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    this.isAdmin.set(role === 'Admin');
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

  onPhoneFilterChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.phoneFilter.set(value);
  }

  onGenderFilterChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.genderFilter.set(value);
  }

  clearFilters(): void {
    this.nameFilter.set('');
    this.phoneFilter.set('');
    this.genderFilter.set(0);
  }
}
