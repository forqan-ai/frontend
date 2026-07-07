import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './core/guards/auth-guard';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    title: 'إنشاء حساب',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: ' تسجيل الدخول',
  },
];
