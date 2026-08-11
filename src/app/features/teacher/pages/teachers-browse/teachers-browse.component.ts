import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  of,
  skip,
  Subject,
  switchMap,
} from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { TeacherService } from '../../services/teacher.service';
import { ITeacherListItem } from '../../models/teacher-list.model';
import { IPaginatedResult } from '../../../courses-browse/models/paginated-result.interface';

@Component({
  selector: 'app-teachers-browse',
  imports: [RouterLink],
  templateUrl: './teachers-browse.component.html',
  styleUrl: './teachers-browse.component.css',
})
export class TeachersBrowseComponent implements OnInit {
  private readonly teacherService = inject(TeacherService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  private readonly refreshTeachers$ = new Subject<void>();

  readonly searchInput = signal('');
  private readonly searchInput$ = toObservable(this.searchInput);
  private readonly searchQuery = signal('');

  readonly teachers = signal<ITeacherListItem[]>([]);
  readonly pageNumber = signal(1);
  readonly pageSize = 9;
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.listenToTeachersRequests();
    this.listenToSearchChanges();
    this.requestTeachers();
  }

  clearSearch(): void {
    this.searchInput.set('');
    this.searchQuery.set('');
    this.pageNumber.set(1);
    this.requestTeachers();
  }

  retry(): void {
    this.requestTeachers();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.pageNumber()) {
      return;
    }

    this.pageNumber.set(page);
    this.requestTeachers();

    window.scrollTo({
      top: 240,
      behavior: 'smooth',
    });
  }

  pageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.pageNumber();

    if (total <= 5) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);

    start = Math.max(1, end - 4);
    end = Math.min(total, start + 4);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  getTeacherImage(teacher: ITeacherListItem): string {
    return teacher.teacherImgUrl || 'images/avatar.webp';
  }

  getTeacherDetailsRoute(teacherId: string): string[] {
    if (this.router.url.startsWith('/student')) {
      return ['.', teacherId];
    }

    return ['/teachers', teacherId, 'details'];
  }

  joinedYear(joinedAt: string): string {
    if (!joinedAt) {
      return 'حديثًا';
    }

    return joinedAt.slice(0, 4);
  }

  primarySpecialty(teacher: ITeacherListItem): string {
    return teacher.specialties?.[0] || teacher.title || 'معلم علوم شرعية';
  }

  visibleSpecialties(teacher: ITeacherListItem): string[] {
    return teacher.specialties?.slice(0, 3) ?? [];
  }

  averageRating(): string {
    const ratedTeachers = this.teachers().filter((teacher) => teacher.rating > 0);

    if (ratedTeachers.length === 0) {
      return '4.8';
    }

    const total = ratedTeachers.reduce((sum, teacher) => sum + Number(teacher.rating), 0);

    return (total / ratedTeachers.length).toFixed(1);
  }

  verifiedTeachersOnPage(): number {
    return this.teachers().filter((teacher) => teacher.verifiedStatus).length;
  }

  private listenToTeachersRequests(): void {
    this.refreshTeachers$
      .pipe(
        switchMap(() => {
          this.isLoading.set(true);
          this.errorMessage.set('');

          return this.teacherService
            .getTeachers({
              pageNumber: this.pageNumber(),
              pageSize: this.pageSize,
              search: this.searchQuery() || undefined,
            })
            .pipe(
              catchError(() => {
                this.errorMessage.set('تعذر تحميل قائمة المعلمين. حاول مرة أخرى.');
                return of(null);
              }),
              finalize(() => this.isLoading.set(false)),
            );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (result === null) {
          this.teachers.set([]);
          this.totalCount.set(0);
          this.totalPages.set(0);
          return;
        }

        this.applyTeachersResult(result);
      });
  }

  private listenToSearchChanges(): void {
    this.searchInput$
      .pipe(
        skip(1),
        debounceTime(350),
        map((value) => value.trim()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((search) => {
        if (search === this.searchQuery()) {
          return;
        }

        this.searchQuery.set(search);
        this.pageNumber.set(1);
        this.requestTeachers();
      });
  }

  private applyTeachersResult(result: IPaginatedResult<ITeacherListItem>): void {
    this.teachers.set(result.items);
    this.totalCount.set(result.totalCount);
    this.totalPages.set(result.totalPages);
  }

  private requestTeachers(): void {
    this.refreshTeachers$.next();
  }
}
