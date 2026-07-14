// import { Component, inject, signal } from '@angular/core';
// import { CourseService } from '../../services/course.service';
// import { Course } from '../../models/course.model';

// @Component({
//   selector: 'app-recent-courses',
//   standalone: true,
//   templateUrl: './recent-courses.component.html',
//   styleUrl: './recent-courses.component.css'
// })
// export class RecentCoursesComponent {

//   private courseService = inject(CourseService);

//   courses = signal<Course[]>([]);

//   constructor() {
//     this.loadCourses();
//   }

//   loadCourses() {

//     this.courseService.getMyCourses().subscribe({

//       next: (res) => {

//         this.courses.set(res);

//       }

//     });

//   }

// }