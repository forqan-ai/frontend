import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import {
  ITeacherDetailsCourse,
  ITeacherDetailsDto,
} from '../../models/teacher-details-dto.interface';

@Component({
  selector: 'app-teacher-details',
  imports: [RouterLink],
  templateUrl: './teacher-details.component.html',
  styleUrl: './teacher-details.component.css',
})
export class TeacherDetailsComponent implements OnInit {
  private readonly teacherService = inject(TeacherService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly teacher = signal<ITeacherDetailsDto | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    const teacherId = this.route.snapshot.paramMap.get('id');

    if (!teacherId) {
      this.errorMessage.set('لم يتم العثور على بيانات المعلم المطلوبة.');
      return;
    }

    this.loadTeacherDetails(teacherId);
  }

  retry(): void {
    const teacherId = this.route.snapshot.paramMap.get('id');

    if (teacherId) {
      this.loadTeacherDetails(teacherId);
    }
  }

  getTeacherImage(): string {
    return this.teacher()?.teacherImgUrl || 'images/avatar.webp';
  }

  joinedYear(joinedAt: string | undefined): string {
    if (!joinedAt) {
      return 'حديثا';
    }

    return joinedAt.slice(0, 4);
  }

  formattedDuration(totalSeconds: number): string {
    if (!totalSeconds || totalSeconds <= 0) {
      return 'مدة غير محددة';
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0 && minutes > 0) {
      return `${hours} س ${minutes} د`;
    }

    if (hours > 0) {
      return `${hours} ساعة`;
    }

    return `${minutes || 1} دقيقة`;
  }

  formattedPrice(price: number): string {
    if (!price || price <= 0) {
      return 'مجانية';
    }

    return `${price} نقطة`;
  }

  getCourseRoute(course: ITeacherDetailsCourse): string[] {
    if (this.router.url.startsWith('/dashboard/student')) {
      return ['/dashboard/student/courses', course.courseID];
    }

    return ['/course-details', course.courseID];
  }

  getTeachersRoute(): string[] {
    if (this.router.url.startsWith('/dashboard/student')) {
      return ['/dashboard/student/teachers'];
    }

    return ['/teachers'];
  }

  onTeacherImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.onerror = null;
    image.src = 'images/avatar.webp';
  }

  onCourseImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.onerror = null;
    image.src = 'images/card1.jfif';
  }

  private loadTeacherDetails(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.teacherService
      .getTeacherDetails(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.teacher.set(res);
          this.isLoading.set(false);
        },
        error: () => {
          this.teacher.set(null);
          this.errorMessage.set('تعذر تحميل بيانات المعلم. حاول مرة أخرى.');
          this.isLoading.set(false);
        },
      });
  }
}
