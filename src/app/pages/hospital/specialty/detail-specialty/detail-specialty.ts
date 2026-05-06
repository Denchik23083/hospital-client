import { Component, computed, inject, signal } from '@angular/core';
import { SpecialtyService } from '../../../../services/specialty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { DoctorResponse } from '../../../../models/responses/doctor/doctor-response.model';

@Component({
  selector: 'app-detail-specialty',
  imports: [],
  templateUrl: './detail-specialty.html',
  styleUrl: './detail-specialty.css',
})
export class DetailSpecialty {
  private readonly specialtyService = inject(SpecialtyService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly tokenStorage = inject(TokenStorageService);

  doctors = signal<DoctorResponse[]>([]);

  nameFilter = signal('');
  genderFilter = signal<number>(0);

  filteredDoctors = computed(() => {
    const name = this.nameFilter().trim().toLowerCase();
    const gender = this.genderFilter();

    return this.doctors().filter((doctor) => {
      const firstName = doctor.firstName.toLowerCase();
      const lastName = doctor.lastName.toLowerCase();

      const matchesName =
        !name ||
        firstName.startsWith(name) ||
        lastName.startsWith(name);

      const matchesGender =
        gender === 0 || doctor.genderType === gender;

      return matchesName && matchesGender;
    });
  });

  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    const specialtyId = Number(this.route.snapshot.paramMap.get('specialtyId'));

    if (!specialtyId) {
      this.errorMessage.set('Некорректный id направления');
      this.isLoading.set(false);
      return;
    }

    this.specialtyService.getAllDoctorsBySpecialty(specialtyId).subscribe({
      next: (data) => {
        this.doctors.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки докторов');
        this.isLoading.set(false);
      }
    });
  }

  details(doctorsId: number) {
    const specialtyId = Number(this.route.snapshot.paramMap.get('specialtyId'));

    this.router.navigate(['/specialties', specialtyId, 'doctors', doctorsId]);
  }

  back() {
    this.router.navigate(['/specialties']);
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }

  onNameFilterChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.nameFilter.set(value);
  }

  onGenderFilterChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.genderFilter.set(value);
  }

  clearFilters(): void {
    this.nameFilter.set('');
    this.genderFilter.set(0);
  }
}