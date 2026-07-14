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

  goToCourses() {
    this.router.navigate(['/teacher/courses']);
  }

  goToCreateCourse() {
    this.router.navigate(['/teacher/courses/create']);
  }

  goToStudents() {
    this.router.navigate(['/teacher/students']);
  }

  goToProfile() {
    this.router.navigate(['/teacher/profile']);
  }

  goToCircles() {
    this.router.navigate(['/teacher/circles']);
  }

}