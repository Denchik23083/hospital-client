import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  form = this.fb.nonNullable.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.form.reset({
          userName: '',
          email: '',
          password: '',
        });
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Ошибка регистрации');
      },
    });
  }

  get userName() {
    return this.form.controls.userName;
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }
}