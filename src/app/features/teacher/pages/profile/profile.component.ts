import { Component, inject, OnInit, signal } from '@angular/core';

import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

import { TeacherService } from '../../services/teacher.service';
import { TeacherProfile } from '../../models/teacher-profile.model';
import { ProfileSummaryComponent } from "../../components/profile-summary/profile-summary.component";
import { ProfileFormComponent } from "../../components/profile-form/profile-form.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    ProfileSummaryComponent,
    ProfileFormComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  private teacherService = inject(TeacherService);

  profile = signal<TeacherProfile | null>(null);

  sidebarOpen = signal(false);

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.teacherService.getProfile().subscribe({
      next: res => this.profile.set(res),
      error: console.error
    });
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

}