import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'doctors',
    canActivate: [authGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./pages/hospital/doctor/all-doctors/all-doctors').then(m => m.AllDoctors)
  },
  {
    path: 'patients',
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Doctor'] },
    loadComponent: () =>
      import('./pages/hospital/patient/all-patients/all-patients').then(m => m.AllPatients)
  },
  {
    path: 'specialties',
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Patient'] },
    loadComponent: () =>
      import('./pages/hospital/specialty/all-specialties/all-specialties').then(m => m.AllSpecialties)
  },
  {
    path: 'specialties/:specialtyId/doctors',
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Patient'] },
    loadComponent: () =>
      import('./pages/hospital/specialty/detail-specialty/detail-specialty').then(m => m.DetailSpecialty)
  },
  {
    path: 'specialties/:specialtyId/doctors/:doctorId',
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Patient'] },
    loadComponent: () =>
      import('./pages/hospital/booking/create-booking/create-booking').then(m => m.CreateBooking)
  },
  {
    path: 'replenish',
    canActivate: [authGuard],
    data: { roles: ['Patient'] },
    loadComponent: () =>
      import('./pages/hospital/patient/replenish/replenish').then(m => m.Replenish)
  },
  {
    path: 'mybookings',
    canActivate: [authGuard],
    data: { roles: ['Patient'] },
    loadComponent: () =>
      import('./pages/hospital/booking/all-patient-bookings/all-patient-bookings').then(m => m.AllPatientBookings)
  },
  {
    path: 'myslots',
    canActivate: [authGuard],
    data: { roles: ['Doctor'] },
    loadComponent: () =>
      import('./pages/hospital/doctor/all-doctor-slots/all-doctor-slots').then(m => m.AllDoctorSlots)
  },
  {
    path: 'profile/patient',
    canActivate: [authGuard],
    data: { roles: ['Patient'] },
    loadComponent: () =>
      import('./pages/hospital/patient/detail-patient/detail-patient').then(m => m.DetailPatient)
  },
  {
    path: 'profile/doctor',
    canActivate: [authGuard],
    data: { roles: ['Doctor'] },
    loadComponent: () =>
      import('./pages/hospital/doctor/detail-doctor/detail-doctor').then(m => m.DetailDoctor)
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
    path: 'notifications',
    canActivate: [authGuard],
    data: { roles: ['Doctor', 'Patient'] },
    loadComponent: () =>
      import('./pages/main/notification/notification').then(m => m.Notification),
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/main/main/main').then(m => m.Main),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
