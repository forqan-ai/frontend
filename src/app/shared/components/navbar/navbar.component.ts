import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from "../button/button.component";
import { AvatarComponent } from "../avatar/avatar.component";
import { SettingsService } from '../../../features/student/Services/settings.service';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ButtonComponent, AvatarComponent],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

  private router = inject(Router);



  authService = inject(AuthService);
  settingsService = inject(SettingsService);

  user = this.settingsService.user;



  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 991) {
      this.isMenuOpen = false;
    }
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}