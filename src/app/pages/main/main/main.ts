import { Component, inject, signal } from '@angular/core';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  isLogin = signal(false);
  isAdmin = signal(false);
  isPatient = signal(false);
  isDoctor = signal(false);

  ngOnInit() {
    this.checkRole();
  }

  checkRole() {
    const token = this.tokenStorage.getAccessToken();

    if (!token) {
      this.isLogin.set(false);
      return;
    }

    this.isLogin.set(true);

    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    this.isPatient.set(role === 'Patient');
    this.isDoctor.set(role === 'Doctor');
    this.isAdmin.set(role === 'Admin');
  }

  patients() {
    this.router.navigate(['/patients']);
  }

  doctors() {
    this.router.navigate(['/doctors']);
  }

  specialties() {
    this.router.navigate(['/specialties']);
  }

  myBookings() {
    this.router.navigate(['/mybookings']);
  }

  profilePatient() {
    this.router.navigate(['/profile/patient']);
  }

  replenish() {
    this.router.navigate(['/replenish']);
  }

  profileDoctor() {
    this.router.navigate(['/profile/doctor']);
  }

  mySlots() {
    this.router.navigate(['/myslots']);
  }

  notifications() {
    this.router.navigate(['/notifications']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}
