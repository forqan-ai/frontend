import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './core/guards/auth-guard';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then((r) => r.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((l) => l.LoginComponent),
  },
];
