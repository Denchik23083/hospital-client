import { Component, inject, signal } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';
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
  isGod = signal(false);
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

    console.log(role)

    switch (role) {
      case 'God':
        this.isGod.set(true);
        break;
      case 'Admin':
        this.isAdmin.set(true);
        break;
      case 'Doctor':
        this.isDoctor.set(true);
        break;
      case 'Patient':
        this.isPatient.set(true);
        break;
      default:
        break;
    }

    /*if (role === 'Admin') {
      this.isAdmin.set(true);
    }

    if (role === 'God') {
      this.isGod.set(true);
    }*/
  }

  users() {
    this.router.navigate(['/users']);
  }

  admins() {
    this.router.navigate(['/admins']);
  }

  specialties() {
    this.router.navigate(['/specialties']);
  }

  myBookings() {
    this.router.navigate(['/mybookings']);
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
