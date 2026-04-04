import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.tokenStorage.setTokens(response.accessToken, response.refreshToken);
        this.router.navigate(['/directions']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message ||
          err?.error?.title ||
          'Ошибка входа'
        );
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}