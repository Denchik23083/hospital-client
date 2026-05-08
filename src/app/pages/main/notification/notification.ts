import { Component, inject, signal } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { NotificationResponce } from '../../../models/responses/others/notification-responce.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification {
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  notifications = signal<NotificationResponce[]>([]);

  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    this.notificationService.getAllNotifications().subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки уведомлений');
        this.isLoading.set(false);
      }
    });
  }
  
  back() {
    this.router.navigate(['/']);
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }

  deleteNotification(id: number){
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications.update((notifications) => notifications.filter((d) => d.id !== id));
      },
      error: () => {
        this.errorMessage.set('Ошибка удаления уведомления');
      },
    });
  }
}
