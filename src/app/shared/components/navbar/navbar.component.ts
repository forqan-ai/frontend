import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from "../button/button.component";
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ButtonComponent],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

  private router = inject(Router);


  constructor(public authService: AuthService) { }




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