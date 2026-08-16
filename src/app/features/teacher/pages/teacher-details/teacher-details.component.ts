import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import {
  ITeacherDetailsCourse,
  ITeacherDetailsDto,
} from '../../models/teacher-details-dto.interface';
import { ICourseCardDto } from '../../../Course/Models/course-card-dto.interface';
import { CourseCardComponent } from "../../../Course/Components/course-card/course-card.component";
import { AuthService } from '../../../../core/services/auth.service';
import { Role } from '../../../../core/models/auth.models';
import { BookConsultationModalComponent } from '../../../consultations/components/book-consultation-modal/book-consultation-modal.component';
import { finalize } from 'rxjs';
import { LearningCirclesGridComponent } from '../../../learning-circles/components/learning-circles-grid/learning-circles-grid.component';
import { LearningCirclesPaginationComponent } from '../../../learning-circles/components/learning-circles-pagination/learning-circles-pagination.component';
import { MembershipConfirmationModalComponent } from '../../../learning-circles/components/membership-confirmation-modal/membership-confirmation-modal.component';
import { CircleJoinPolicy, LearningCircleListItem } from '../../../learning-circles/models/learning-circle.models';
import { LearningCirclesService } from '../../../learning-circles/services/learning-circles.service';
import { CircleJoinRequestsService } from '../../../learning-circles/services/circle-join-requests.service';
import { CircleActionErrorService } from '../../../learning-circles/services/circle-action-error.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-teacher-details',
  imports: [
    RouterLink,
    CourseCardComponent,
    BookConsultationModalComponent,
    LearningCirclesGridComponent,
    LearningCirclesPaginationComponent,
    MembershipConfirmationModalComponent,
  ],
  templateUrl: './teacher-details.component.html',
  styleUrl: './teacher-details.component.css',
})
export class TeacherDetailsComponent implements OnInit {
  private readonly teacherService = inject(TeacherService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly circlesService = inject(LearningCirclesService);
  private readonly joinRequestsService = inject(CircleJoinRequestsService);
  private readonly circleActionError = inject(CircleActionErrorService);
  private readonly toast = inject(ToastService);

  readonly teacher = signal<ITeacherDetailsDto | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly consultationModalOpen = signal(false);
  readonly teacherCirclesOpen = signal(false);
  readonly teacherCircles = signal<LearningCircleListItem[]>([]);
  readonly circlesLoading = signal(false);
  readonly circlesLoadFailed = signal(false);
  readonly circlesPage = signal(1);
  readonly circlesTotalPages = signal(0);
  readonly circleActionId = signal<string | null>(null);
  readonly selectedCircle = signal<LearningCircleListItem | null>(null);
  readonly circlesPageSize = 6;
  readonly canBookConsultation = computed(
    () => this.authService.isLoggedIn() && this.authService.hasRole(Role.Student),
  );

  ngOnInit(): void {
    const teacherId = this.route.snapshot.paramMap.get('teacherid');

    if (!teacherId) {
      this.errorMessage.set('لم يتم العثور على بيانات المعلم المطلوبة.');
      return;
    }

    this.loadTeacherDetails(teacherId);
  }

  openConsultationModal(): void {
    if (this.canBookConsultation()) {
      this.consultationModalOpen.set(true);
    }
  }

  closeConsultationModal(): void {
    this.consultationModalOpen.set(false);
  }

  openTeacherCircles(): void {
    const teacherId = this.teacher()?.teacherID;
    if (!teacherId || !this.canBookConsultation()) return;
    this.teacherCirclesOpen.set(true);
    this.loadTeacherCircles();
  }

  closeTeacherCircles(): void {
    if (this.circleActionId() === null) this.teacherCirclesOpen.set(false);
  }

  loadTeacherCircles(): void {
    const teacherId = this.teacher()?.teacherID;
    if (!teacherId || this.circlesLoading()) return;
    this.circlesLoading.set(true);
    this.circlesLoadFailed.set(false);
    this.circlesService.getByTeacher(teacherId, {
      pageNumber: this.circlesPage(),
      pageSize: this.circlesPageSize,
    }).pipe(
      finalize(() => this.circlesLoading.set(false)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (page) => {
        this.teacherCircles.set(page.items);
        this.circlesTotalPages.set(page.totalPages);
      },
      error: () => {
        this.teacherCircles.set([]);
        this.circlesTotalPages.set(0);
        this.circlesLoadFailed.set(true);
      },
    });
  }

  changeCirclesPage(page: number): void {
    if (page === this.circlesPage()) return;
    this.circlesPage.set(page);
    this.loadTeacherCircles();
  }

  showCircleDetails(circle: LearningCircleListItem): void {
    void this.router.navigate(['/student/learning-circles', circle.circleId]);
  }

  openCircleJoin(circle: LearningCircleListItem): void {
    if (!circle.isMember && circle.joinPolicy === CircleJoinPolicy.Automatic) {
      this.selectedCircle.set(circle);
    }
  }

  closeCircleJoin(): void {
    if (this.circleActionId() === null) this.selectedCircle.set(null);
  }

  confirmCircleJoin(): void {
    const circle = this.selectedCircle();
    if (!circle || this.circleActionId() !== null) return;
    this.circleActionId.set(circle.circleId);
    this.circlesService.join(circle.circleId).pipe(
      finalize(() => this.circleActionId.set(null)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (joined) => {
        if (!joined) {
          this.toast.show('تعذر الانضمام إلى حلقة التعلم.', 'error');
          return;
        }
        this.selectedCircle.set(null);
        this.toast.show('تم الانضمام إلى حلقة التعلم بنجاح.');
        this.loadTeacherCircles();
      },
      error: (error: HttpErrorResponse) => this.toast.show(this.circleActionError.getMessage(error, 'join'), 'error'),
    });
  }

  requestCircleJoin(circle: LearningCircleListItem): void {
    if (this.circleActionId() !== null) return;
    this.circleActionId.set(circle.circleId);
    this.joinRequestsService.create(circle.circleId).pipe(
      finalize(() => this.circleActionId.set(null)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.toast.show('تم إرسال طلب الانضمام إلى الحلقة.');
        this.loadTeacherCircles();
      },
      error: () => this.toast.show('تعذر إرسال طلب الانضمام.', 'error'),
    });
  }

  cancelCircleJoinRequest(circle: LearningCircleListItem): void {
    if (this.circleActionId() !== null) return;
    this.circleActionId.set(circle.circleId);
    this.joinRequestsService.cancel(circle.circleId).pipe(
      finalize(() => this.circleActionId.set(null)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.toast.show('تم إلغاء طلب الانضمام.');
        this.loadTeacherCircles();
      },
      error: () => this.toast.show('تعذر إلغاء طلب الانضمام.', 'error'),
    });
  }

  retry(): void {
    const teacherId = this.route.snapshot.paramMap.get('teacherid');

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

  getCourseRoute(course: ICourseCardDto): string[] {
    if (this.router.url.startsWith('/student')) {
      return ['/student/courses', course.courseID];
    }

    return ['/course-details', course.courseID];
  }

  getTeachersRoute(): string[] {
    if (this.router.url.startsWith('/student')) {
      return ['/student/teachers'];
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
