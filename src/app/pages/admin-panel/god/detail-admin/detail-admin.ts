import { Component, inject, signal } from '@angular/core';
import { GodService } from '../../../../services/god.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { UserResponse } from '../../../../models/responses/user-response.model';

@Component({
  selector: 'app-detail-admin',
  imports: [],
  templateUrl: './detail-admin.html',
  styleUrl: './detail-admin.css',
})
export class DetailAdmin {
  private readonly godService = inject(GodService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tokenStorage = inject(TokenStorageService);

  admin = signal<UserResponse | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage.set('Некорректный id администратора');
      this.isLoading.set(false);
      return;
    }

    this.godService.getAdmin(id).subscribe({
      next: (data) => {
        this.admin.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки администратора');
        this.isLoading.set(false);
      }
    });
  }

  back() {
    this.router.navigate(['/admins']);
  }

  makeUser() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.godService.makeUser(id).subscribe({
      next: () => {
        this.router.navigate(['/admins']);
      },
      error: () => {
        this.errorMessage.set('Ошибка при назначении пациентом');
      },
    });
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}
