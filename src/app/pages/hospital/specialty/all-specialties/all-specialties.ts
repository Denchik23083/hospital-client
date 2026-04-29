import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { SpecialtyService } from '../../../../services/specialty.service';
import { SpecialtyResponse } from '../../../../models/responses/specialty-response.model';

@Component({
  selector: 'app-all-specialties',
  imports: [],
  templateUrl: './all-specialties.html',
  styleUrl: './all-specialties.css',
})

export class AllSpecialties {
  private readonly specialtyService = inject(SpecialtyService);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  specialties = signal<SpecialtyResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    this.specialtyService.getAllSpecialties().subscribe({
      next: (data) => {
        this.specialties.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки направлений');
        this.isLoading.set(false);
      }
    });
  }
  
  details(id: number) {
    this.router.navigate(['/specialties', id, 'doctors']);
  }

  back() {
    this.router.navigate(['/']);
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}

