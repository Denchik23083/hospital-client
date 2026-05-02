import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PatientService } from '../../../../services/patient.service';
import { TokenStorageService } from '../../../../services/token-storage.service';

@Component({
  selector: 'app-replenish',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './replenish.html',
  styleUrl: './replenish.css',
})
export class Replenish {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly patientService = inject(PatientService);
  private readonly tokenStorage = inject(TokenStorageService);

  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');

  balance = signal(0);

  form = this.fb.nonNullable.group({
    amount: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.patientService.getPatientBalance().subscribe({
      next: (data) => {
        this.balance.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка загрузки баланса');
        this.isLoading.set(false);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    const amount = this.form.getRawValue().amount;

    this.patientService.replenishBalance(this.form.getRawValue()).subscribe({
      next: () => {
        this.balance.set(this.balance() + amount);
        this.form.reset({ amount: 1 });
        this.isSaving.set(false);
      },
      error: () => {
        this.errorMessage.set('Ошибка пополнения баланса');
        this.isSaving.set(false);
      },
    });
  }

  back(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }

  get amount() {
    return this.form.controls.amount;
  }
}