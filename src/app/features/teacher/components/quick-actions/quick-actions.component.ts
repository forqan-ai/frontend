import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  templateUrl: './quick-actions.component.html',
  styleUrl: './quick-actions.component.css'
})
export class QuickActionsComponent {

  private router = inject(Router);

  goToMyCourses() {
    this.router.navigate(['/teacher/my-courses']);
  }

  goToCreateCourse() {
    this.router.navigate(['/teacher/create-course']);
  }

  goToProfile() {
    this.router.navigate(['/teacher/profile']);
  }

  goToCircles() {
    this.router.navigate(['/teacher/circles']);
  }

}