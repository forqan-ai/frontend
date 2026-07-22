import { Component, inject, OnInit, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd, RouterLinkActive } from '@angular/router';
import { SettingsService } from '../../Services/settings.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AvatarComponent } from "../../../../shared/components/avatar/avatar.component";

@Component({
  selector: 'app-student-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, RouterLinkActive],
  templateUrl: './student-sidebar.component.html',
  styleUrl: './student-sidebar.component.css',
})
export class StudentSidebarComponent implements OnInit {
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
    if (url.includes('home')) {
      this.activeRoute = 'home';
    } else if (url.includes('my-courses')) {
      this.activeRoute = 'my-courses';
    } else if (url.includes('learning-circles')) {
      this.activeRoute = 'learning-circles';
    } else if (url.includes('teachers')) {
      this.activeRoute = 'teachers';
    } else if (url.includes('courses')) {
      this.activeRoute = 'courses';
    } else if (url.includes('my-certificates')) {
      this.activeRoute = 'my-certificates';
    } else if (url.includes('settings')) {
      this.activeRoute = 'settings';
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