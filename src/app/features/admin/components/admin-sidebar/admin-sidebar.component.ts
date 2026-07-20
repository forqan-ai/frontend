import { Component, inject, OnInit, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { SettingsService } from '../../../student/Services/settings.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AvatarComponent } from "../../../../shared/components/avatar/avatar.component";

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
})
export class AdminSidebarComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  apiUrl = 'https://localhost:7054';
  activeRoute: string = '';

  user = this.settingsService.user;

  studentImage = computed(() =>
    this.getStudentImage(this.user()?.profileImageURL)
  );

  ngOnInit(): void {
    // Load user data
    if (!this.settingsService.user()) {
      this.settingsService.getSettings().subscribe({
        next: (res) => {
          console.log('Sidebar got user:', res);
          this.settingsService.setUser(res);
        },
        error: (err) => console.error('Sidebar error:', err),
      });
    }

    // Set active route based on current URL
    // First, set it immediately on load
    const currentUrl = this.router.url;
    this.updateActiveRoute(currentUrl);

    // Then listen for changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.updateActiveRoute(url);
        console.log(url);
      }
    });
  }

  private updateActiveRoute(url: string): void {
    if (url.includes('teaching-requests')) {
      this.activeRoute = 'teaching-requests';
    } else if (url.includes('my-courses')) {
      this.activeRoute = 'my-courses';
    }
  }

  getStudentImage(imageUrl?: string | null): string {
    if (!imageUrl || imageUrl.toLowerCase() === 'null') {
      return 'images/avatar.webp';
    }

    return imageUrl.startsWith('http') ? imageUrl : this.apiUrl + imageUrl;
  }

  setActiveRoute(route: string): void {
    this.activeRoute = route;
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}