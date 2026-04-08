import { Component, inject, signal } from '@angular/core';
import { SpecialtyService } from '../../../../services/specialty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { DoctorResponce } from '../../../../models/responces/doctor-responce.model';

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

  doctors = signal<DoctorResponce[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  //isGod = signal(false);

  ngOnInit() {
    //this.checkRole();
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

  /*checkRole() {
    const token = this.tokenStorage.getAccessToken();

    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));

    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === 'God') {
      this.isGod.set(true);
    }
  }*/

  details(doctorsId: number) {
    const specialtyId = Number(this.route.snapshot.paramMap.get('specialtyId'));

    this.router.navigate(['/specialties/', specialtyId, 'doctors', doctorsId]);
  }

  back() {
    this.router.navigate(['/specialties']);
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}