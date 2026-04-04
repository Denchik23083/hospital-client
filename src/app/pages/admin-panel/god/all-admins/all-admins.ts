import { Component, inject, signal } from '@angular/core';
import { GodService } from '../../../../services/god.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../services/token-storage.service';
import { UserResponce } from '../../../../models/responces/user-responce.model';

@Component({
  selector: 'app-all-admins',
  imports: [],
  templateUrl: './all-admins.html',
  styleUrl: './all-admins.css',
})
export class AllAdmins {
  private readonly godService = inject(GodService);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  users = signal<UserResponce[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    this.godService.getAllAdmins().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки администраторов');
        this.isLoading.set(false);
      }
    });
  }

  details(id: number) {
    this.router.navigate(['/admins', id]);
  }

  back() {
    this.router.navigate(['/directions']);
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}
