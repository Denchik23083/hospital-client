import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { UserResponse } from '../../../../models/responses/user-response.model';

@Component({
  selector: 'app-detail-user',
  imports: [],
  templateUrl: './detail-user.html',
  styleUrl: './detail-user.css',
})
export class DetailUser {
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tokenStorage = inject(TokenStorageService);

  user = signal<UserResponse | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage.set('Некорректный id пользователя');
      this.isLoading.set(false);
      return;
    }

    this.adminService.getUser(id).subscribe({
      next: (data) => {
        this.user.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки пользователя');
        this.isLoading.set(false);
      }
    });
  }

  back() {
    this.router.navigate(['/users']);
  }

  deleteUser() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!confirm('Удалить пользователя?')) return;

    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: () => {
        this.errorMessage.set('Ошибка при удалении пациента');
      },
    });
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}
