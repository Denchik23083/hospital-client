import { Component, inject, signal } from '@angular/core';
import { SpecialtyService } from '../../../../services/specialty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { DoctorResponse } from '../../../../models/responses/doctor-response.model';

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
}