import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
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
import { ICourseListItem } from '../../models/course-list-item.interface';
import { ICategory } from '../../models/category.interface';
import { CoursesBrowseService } from '../../services/courses-browse.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { IPaginatedResult } from '../../models/paginated-result.interface';
import { CoursesBrowseCardComponent } from "../../components/courses-browse-card/courses-browse-card.component";

@Component({
  selector: 'app-courses-browse',
  imports: [RouterLink, CoursesBrowseCardComponent],
  templateUrl: './courses-browse.component.html',
  styleUrl: './courses-browse.component.css',
})
export class CoursesBrowseComponent implements OnInit {
private readonly coursesBrowseService =
    inject(CoursesBrowseService);

  private readonly destroyRef =
    inject(DestroyRef);

  private readonly refreshCourses$ =
    new Subject<void>();

  readonly searchInput = signal('');

  private readonly searchQuery = signal('');

  private readonly searchInput$ = toObservable(this.searchInput);

  readonly courses = signal<ICourseListItem[]>([]);

  readonly categories = signal<ICategory[]>([]);

  readonly selectedCategoryId = signal<string | null>(null);

  readonly pageNumber = signal(1);

  readonly pageSize = 6;

  readonly totalPages = signal(0);

  readonly totalCount = signal(0);

  readonly isLoadingCourses =
    signal(false);

  readonly coursesError =
    signal('');

  readonly categoriesError =
    signal('');

  ngOnInit(): void {
    this.loadCategories();
    this.listenToCoursesRequests();
    this.listenToSearchChanges();
    this.requestCourses();
  }

  private loadCategories(): void {
    this.categoriesError.set('');

    this.coursesBrowseService
      .getCategories()
      .pipe(
        takeUntilDestroyed(
          this.destroyRef,
        ),
      )
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
        },
        error: () => {
          this.categories.set([]);
          this.categoriesError.set(
            'تعذر تحميل التصنيفات.',
          );
        },
      });
  }

  private listenToCoursesRequests(): void {
    this.refreshCourses$.pipe(
        switchMap(() => {
          this.isLoadingCourses.set(true);
          this.coursesError.set('');

          return this.coursesBrowseService
            .getCourses({
              pageNumber:
                this.pageNumber(),
              pageSize:
                this.pageSize,
              search:
                this.searchQuery(),
              categoryId:
                this.selectedCategoryId()
                ?? undefined,
            })
            .pipe(
              catchError(() => {
                this.coursesError.set(
                  'حدث خطأ أثناء تحميل الدورات. حاول مرة أخرى.',
                );

                return of(null);
              }),
              finalize(() => {
                this.isLoadingCourses
                  .set(false);
              }),
            );
        }),
        takeUntilDestroyed(
          this.destroyRef,
        ),
      )
      .subscribe((result) => {
        if (result === null) {
          this.courses.set([]);
          this.totalCount.set(0);
          this.totalPages.set(0);
          return;
        }

        this.applyCoursesResult(result);
      });
  }

  private listenToSearchChanges(): void {
    this.searchInput$
      .pipe(
        skip(1),
        debounceTime(400),
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
        this.requestCourses();
      });
  }

  private applyCoursesResult(
    result:
      IPaginatedResult<ICourseListItem>,
  ): void {
    this.courses.set(result.items);
    this.totalCount.set(
      result.totalCount,
    );
    this.totalPages.set(
      result.totalPages,
    );
  }

  selectCategory(
    categoryId: string | null,
  ): void {
    if (
      this.selectedCategoryId()
      === categoryId
    ) {
      return;
    }

    this.selectedCategoryId.set(
      categoryId,
    );

    this.pageNumber.set(1);
    this.requestCourses();
  }

  clearFilters(): void {
    this.searchInput.set('');
    this.searchQuery.set('');
    this.selectedCategoryId.set(null);
    this.pageNumber.set(1);
    this.requestCourses();
  }

  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages() ||
      page === this.pageNumber()
    ) {
      return;
    }

    this.pageNumber.set(page);
    this.requestCourses();

    window.scrollTo({
      top: 240,
      behavior: 'smooth',
    });
  }

  retryCourses(): void {
    this.requestCourses();
  }

  retryCategories(): void {
    this.loadCategories();
  }

  pageNumbers(): number[] {
    const total =
      this.totalPages();

    const current =
      this.pageNumber();

    if (total <= 5) {
      return Array.from(
        { length: total },
        (_, index) => index + 1,
      );
    }

    let start = Math.max(
      1,
      current - 2,
    );

    let end = Math.min(
      total,
      start + 4,
    );

    start = Math.max(
      1,
      end - 4,
    );

    end = Math.min(
      total,
      start + 4,
    );

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index,
    );
  }

  private requestCourses(): void {
    this.refreshCourses$.next();
  }
}
