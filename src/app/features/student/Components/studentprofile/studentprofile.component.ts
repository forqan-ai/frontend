import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// import { ICategoryProgress } from '../../models/category-progress.interface';
import { ICategoryProgress } from '../../Models/category-progress.interface';
import { IRecentActivity } from '../../Models/recent-activity.interface';
import { IStudentCourse } from '../../Models/student-course.interface';
import { IStudentProfile } from '../../Models/student-profile.interface';
import { StudentService } from '../../Services/student.service';

@Component({
  selector: 'app-studentprofile',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './studentprofile.component.html',
  styleUrl: './studentprofile.component.css',
})
export class StudentprofileComponent implements OnInit {
  private studentService = inject(StudentService);

  apiUrl = 'https://localhost:7054';

  loading = signal(true);

  student = signal<IStudentProfile | null>(null);
  courses = signal<IStudentCourse[]>([]);
  categories = signal<ICategoryProgress[]>([]);
  activities = signal<IRecentActivity[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    this.studentService.getStudentProfile().subscribe({
      next: (res) => this.student.set(res),
      error: (err) => console.error(err),
    });

    this.studentService.getCourses().subscribe({
      next: (res) => this.courses.set(res),
      error: (err) => console.error(err),
    });

    this.studentService.getCategories().subscribe({
      next: (res) => this.categories.set(res),
      error: (err) => console.error(err),
    });

    this.studentService.getActivities().subscribe({
      next: (res) => {
        this.activities.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  completedCourses = computed(() => this.courses().filter((x) => x.isCompleted).length);

  inProgressCourses = computed(() => this.courses().filter((x) => !x.isCompleted).length);

  currentCourse = computed(() => this.courses().find((x) => !x.isCompleted) ?? null);

  totalCourses = computed(() => this.courses().length);

  totalCategories = computed(() => this.categories().length);

  knowledgePoints = computed(() => this.student()?.knowledgePoints ?? 0);

  knowledgeProgress = computed(() => this.student()?.knowledgeProgress ?? 0);

  streak = computed(() => this.student()?.streakCount ?? 0);

  averageProgress = computed(() => {
    if (!this.courses().length) return 0;

    const total = this.courses().reduce((sum, c) => sum + c.progressPercent, 0);

    return Math.round(total / this.courses().length);
  });

  latestActivities = computed(() => this.activities().slice(0, 5));

  getStudentImage(imageUrl?: string | null): string {
    if (!imageUrl || imageUrl.toLowerCase() === 'null') return 'images/avatar.png';

    return imageUrl.startsWith('http') ? imageUrl : this.apiUrl + imageUrl;
  }

  getCourseImage(imageUrl?: string | null): string {
    if (!imageUrl || imageUrl.toLowerCase() === 'null') return 'images/book.png';

    return imageUrl.startsWith('http') ? imageUrl : this.apiUrl + imageUrl;
  }

  progressColor(progress: number): string {
    if (progress >= 80) return '#6e8f6b';

    if (progress >= 50) return '#341b16';
    if (progress >= 25) return '#c1663c';

    return '#7a635d';
  }

  progressStatus(progress: number): string {
    if (progress >= 100) return 'مكتمل';

    if (progress >= 75) return 'ممتاز';

    if (progress >= 50) return 'جيد';

    if (progress >= 25) return 'مستمر';

    return 'بدأ للتو';
  }

  getGreeting(): string {
    const hour = new Date().getUTCHours();

    if (hour < 12) return 'صباح الخير';

    if (hour < 17) return 'مساء الخير';

    return 'أهلاً بك';
  }
}
