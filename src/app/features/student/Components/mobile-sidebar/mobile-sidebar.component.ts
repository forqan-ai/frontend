import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { SettingsService } from '../../Services/settings.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-mobile-sidebar',
  imports: [AvatarComponent, RouterLink],
  templateUrl: './mobile-sidebar.component.html',
  styleUrl: './mobile-sidebar.component.css',
})
export class MobileSidebarComponent {

  private settingsService = inject(SettingsService);
  private authService = inject(AuthService);
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
    if (url.includes('/dashboard/home')) {
      this.activeRoute = 'home';
    } else if (url.includes('/dashboard/my-courses')) {
      this.activeRoute = 'my-courses';
    } else if (url.includes('/dashboard/learning-circles')) {
      this.activeRoute = 'learning-circles';
    } else if (url.includes('/dashboard/teachers')) {
      this.activeRoute = 'teachers';
    } else if (url.includes('/dashboard/courses')) {
      this.activeRoute = 'courses';
      // } else if (url.includes('/dashboard/my-certificates')) {
      //   this.activeRoute = 'my-certificates';
    } else if (url.includes('/dashboard/settings')) {
      this.activeRoute = 'settings';
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