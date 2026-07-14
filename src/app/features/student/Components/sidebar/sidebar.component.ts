import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

import { SettingsService } from '../../Services/settings.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  apiUrl = 'https://localhost:7054';

  user = this.settingsService.user;

  studentImage = computed(() =>
    this.getStudentImage(this.user()?.profileImageURL)
  );

ngOnInit(): void {
  if (!this.settingsService.user()) {
    this.settingsService.getSettings().subscribe({
      next: (res) => {
        console.log('Sidebar got user:', res);
        this.settingsService.setUser(res);
      },
      error: (err) => console.error('Sidebar error:', err),
    });
  }
}

  getStudentImage(imageUrl?: string | null): string {
    if (!imageUrl || imageUrl.toLowerCase() === 'null') {
      return 'images/avatar.webp';
    }
    return imageUrl.startsWith('http') ? imageUrl : this.apiUrl + imageUrl;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}