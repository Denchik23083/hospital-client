import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { SpecialtyService } from '../../../../services/specialty.service';
import { SpecialtyResponse } from '../../../../models/responses/others/specialty-response.model';

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

  nameFilter = signal('');
  priceFilter = signal<number>(0);

  filteredSpecialties = computed(() => {
    const name = this.nameFilter().trim().toLowerCase();
    const price = this.priceFilter();

    return this.specialties().filter((specialty) => {
      const firstName = specialty.name.toLowerCase();
      const prices = specialty.price;

      const matchesName =
        !name ||
        firstName.startsWith(name);

      const matchesPrice =
        !price ||
        prices === price;

      return matchesName && matchesPrice;
    });
  });

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

  onNameFilterChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.nameFilter.set(value);
  }

  onPriceFilterChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.priceFilter.set(value ? Number(value) : 0);
  }

  clearFilters(): void {
    this.nameFilter.set('');
    this.priceFilter.set(0);
  }
}

