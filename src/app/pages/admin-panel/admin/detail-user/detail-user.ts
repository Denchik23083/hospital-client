import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { UserResponce } from '../../../../models/responces/user-responce.model';
import { GodService } from '../../../../services/god.service';

@Component({
  selector: 'app-detail-user',
  imports: [],
  templateUrl: './detail-user.html',
  styleUrl: './detail-user.css',
})
export class DetailUser {
  private readonly adminService = inject(AdminService);
  private readonly godService = inject(GodService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tokenStorage = inject(TokenStorageService);

  user = signal<UserResponce | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');
  isGod = signal(false);

  ngOnInit() {
    this.checkRole();
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

  checkRole() {
    const token = this.tokenStorage.getAccessToken();

    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));

    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === 'God') {
      this.isGod.set(true);
    }
  }

  back() {
    this.router.navigate(['/users']);
  }

  makeAdmin() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.godService.makeAdmin(id).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: () => {
        this.errorMessage.set('Ошибка при назначении администратором');
      },
    });
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
