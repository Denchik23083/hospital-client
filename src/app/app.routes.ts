import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'specialties',
    canActivate: [authGuard],
    data: { roles: ['Admin', 'God', 'Patient'] },
    loadComponent: () =>
      import('./pages/hospital/specialty/all-specialties/all-specialties').then(m => m.AllSpecialties)
  },
  {
    path: 'specialties/:specialtyId/doctors',
    canActivate: [authGuard],
    data: { roles: ['Admin', 'God', 'Patient'] },
    loadComponent: () =>
      import('./pages/hospital/specialty/detail-specialty/detail-specialty').then(m => m.DetailSpecialty)
  },
  {
    path: 'specialties/:specialtyId/doctors/:doctorId',
    canActivate: [authGuard],
    data: { roles: ['Admin', 'God', 'Patient'] },
    loadComponent: () =>
      import('./pages/hospital/booking/create-booking/create-booking').then(m => m.CreateBooking)
  },
  {
    path: 'users',
    canActivate: [authGuard],
    data: { roles: ['Admin', 'God'] },
    loadComponent: () =>
      import('./pages/admin-panel/admin/all-users/all-users').then(m => m.AllUsers)
  },
  {
    path: 'users/:id',
    canActivate: [authGuard],
    data: { roles: ['Admin', 'God'] },
    loadComponent: () =>
      import('./pages/admin-panel/admin/detail-user/detail-user').then(m => m.DetailUser)
  },
  {
    path: 'admins',
    canActivate: [authGuard],
    data: { roles: ['God'] },
    loadComponent: () =>
      import('./pages/admin-panel/god/all-admins/all-admins').then(m => m.AllAdmins)
  },
  {
    path: 'admins/:id',
    canActivate: [authGuard],
    data: { roles: ['God'] },
    loadComponent: () =>
      import('./pages/admin-panel/god/detail-admin/detail-admin').then(m => m.DetailAdmin)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register').then(m => m.Register)
  },
  {
    path: '',
    redirectTo: 'specialties',
    pathMatch: 'full'
  }
];
