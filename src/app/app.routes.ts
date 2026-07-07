import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './core/guards/auth-guard';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];
