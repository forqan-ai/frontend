import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../../../features/teacher/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../features/teacher/components/header/header.component';
import { QuickActionsComponent } from '../../../features/teacher/components/quick-actions/quick-actions.component';

import { TeacherProfile } from '../../../features/teacher/models/teacher-profile.model';
import { TeacherService } from '../../../features/teacher/services/teacher.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    QuickActionsComponent,
    ToastComponent,
  ],
  templateUrl: './teacher-layout.component.html',
  styleUrls: ['./teacher-layout.component.css'],
})
export class TeacherLayoutComponent implements OnInit {
  private readonly teacherService = inject(TeacherService);

  sidebarOpen = signal(false);

  teacher = signal<TeacherProfile | null>(null);

  ngOnInit(): void {
    this.teacherService.getProfile().subscribe({
      next: (res) => {
        this.teacher.set(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}