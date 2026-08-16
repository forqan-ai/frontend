import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { SettingsService } from '../../Services/settings.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-student-mobile-sidebar',
  imports: [AvatarComponent, RouterLink],
  templateUrl: './student-mobile-sidebar.component.html',
  styleUrl: './student-mobile-sidebar.component.css',
})
export class StudentMobileSidebarComponent {

  private settingsService = inject(SettingsService);
  authService = inject(AuthService);
  private router = inject(Router);

  apiUrl = 'https://localhost:7054';

  activeRoute: string = 'home';
  user = this.settingsService.user;


  studentImage = computed(() =>
    this.getStudentImage(this.user()?.profileImageURL)
  );

  getStudentImage(imageUrl?: string | null): string {
    if (!imageUrl || imageUrl.toLowerCase() === 'null') {
      return 'images/avatar.webp';
    }

    return imageUrl.startsWith('http') ? imageUrl : this.apiUrl + imageUrl;
  }

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
    if (url.includes('consultations')) {
      this.activeRoute = 'consultations';
    } else if (url.includes('d/home')) {
      this.activeRoute = 'home';
    } else if (url.includes('/my-courses')) {
      this.activeRoute = 'my-courses';
    } else if (url.includes('/learning-circles')) {
      this.activeRoute = 'learning-circles';
    } else if (url.includes('/teachers')) {
      this.activeRoute = 'teachers';
    } else if (url.includes('/courses')) {
      this.activeRoute = 'courses';
    } else if (url.includes('/settings')) {
      this.activeRoute = 'settings';
    } else if (url.includes('teacher')) {
      this.activeRoute = 'teacher'
    } else if (url.includes('wishlist')) {
      this.activeRoute = 'wishlist'
    }
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