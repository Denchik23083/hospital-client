import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { SpecialtyService } from '../../../../services/specialty.service';
import { SpecialtyResponce } from '../../../../models/responces/specialty-responce.model';

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

  specialties = signal<SpecialtyResponce[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  //isGod = signal(false);

  ngOnInit() {
    //this.checkRole();
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

  /*checkRole() {
    const token = this.tokenStorage.getAccessToken();

    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));

    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === 'God') {
      this.isGod.set(true);
    }
  }*/

  details(id: number) {
    console.log(id)
    this.router.navigate(['/specialties/', id, 'doctors']);
  }

  back() {
    //TODO: Change laterto main
    this.router.navigate(['/login']);
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}

