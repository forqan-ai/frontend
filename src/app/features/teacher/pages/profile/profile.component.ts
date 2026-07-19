import { Component, inject, input, OnInit, signal } from '@angular/core';

import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

import { TeacherService } from '../../services/teacher.service';
import { TeacherProfile } from '../../models/teacher-profile.model';
import { ProfileSummaryComponent } from '../../components/profile-summary/profile-summary.component';
import { ProfileFormComponent } from '../../components/profile-form/profile-form.component';
import { TeacherDashboard } from '../../models/teacher-dashboard.model';
import { SpecialtiesCardComponent } from '../../components/specialties-card/specialties-card.component';
import { ProfileStatisticsComponent } from '../../components/profile-statistics/profile-statistics.component';
import { QuickActionsComponent } from '../../components/quick-actions/quick-actions.component';
import { Specialty } from '../../models/specialty.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    ProfileSummaryComponent,
    ProfileFormComponent,
    SpecialtiesCardComponent,
    ProfileStatisticsComponent,
    QuickActionsComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private toast = inject(ToastService);
  profile = signal<TeacherProfile | null>(null);
  dashboard = signal<TeacherDashboard | null>(null);
  specialties = signal<Specialty[]>([]);
  selectedImage: File | null = null;
  sidebarOpen = signal(false);

  ngOnInit(): void {
    this.loadProfile();
    this.loadDashboard();
    this.loadSpecialties();
  }

  loadProfile() {
    this.teacherService.getProfile().subscribe({
      next: (res) => {
        console.log('ProfileComponent', res.specialties);

        console.log(res);
        this.profile.set(res);
      },
      error: console.error,
    });
  }

  loadDashboard() {
    this.teacherService.getDashboard().subscribe({
      next: (res) => this.dashboard.set(res),
    });
  }

  loadSpecialties() {
    this.teacherService.getAllSpecialties().subscribe({
      next: (res) => {
        this.specialties.set(res);
      },
      error: console.error,
    });
  }
  onProfileUpdated() {
    this.loadProfile();
  }
  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
  updateProfile(data: any) {
    const formData = new FormData();

    formData.append('fullName', data.fullName);

    formData.append('bio', data.bio ?? '');

    if (this.selectedImage) {
      formData.append('profileImage', this.selectedImage);
    }

    this.teacherService.updateProfile(formData).subscribe({
      next: () => {
        this.loadProfile();

        this.selectedImage = null;

        this.toast.show('تم تحديث الملف الشخصي بنجاح');
      },

      error: (err) => {
        console.error(err);

        this.toast.show('حدث خطأ أثناء تحديث الملف الشخصي', 'error');
      },
    });
  }
  onImageSelected(file: File) {
    this.selectedImage = file;
  }

  saveSpecialties(ids: string[]) {
    this.teacherService.updateTeacherSpecialties(ids).subscribe({
      next: () => {
        this.loadProfile();

        this.loadSpecialties();
      },
      error: console.error,
    });
  }
}
