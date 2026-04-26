import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { UserResponse } from '../../../../models/responses/user-response.model';

@Component({
  selector: 'app-all-users',
  imports: [],
  templateUrl: './all-users.html',
  styleUrl: './all-users.css',
})
export class AllUsers {
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  users = signal<UserResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  isGod = signal(false);

  ngOnInit() {
    this.checkRole();
    this.load();
  }

  load() {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки пациентов');
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

  details(id: number) {
    this.router.navigate(['/users', id]);
  }

  back() {
    this.router.navigate(['/']);
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}
