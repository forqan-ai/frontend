import { Component, DestroyRef, effect, inject, Injector, OnInit, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { catchError, finalize, of, Subject, switchMap } from 'rxjs';
import { ICourseListItem } from '../../models/course-list-item.interface';
import {debounce, form, FormField} from '@angular/forms/signals';
import { ICategory } from '../../models/category.interface';
import { CoursesBrowseService } from '../../services/courses-browse.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IPaginatedResult } from '../../models/paginated-result.interface';
import { CoursesBrowseCardComponent } from "../../components/courses-browse-card/courses-browse-card.component";

@Component({
  selector: 'app-courses-browse',
  imports: [FormField, RouterLink, CoursesBrowseCardComponent],
  templateUrl: './courses-browse.component.html',
  styleUrl: './courses-browse.component.css',
})
export class CoursesBrowseComponent implements OnInit {
private readonly coursesBrowseService =
    inject(CoursesBrowseService);

  private readonly destroyRef =
    inject(DestroyRef);

  private readonly injector =
    inject(Injector);

  private readonly refreshCourses$ =
    new Subject<void>();

  readonly filtersModel = signal({
    search: '',
  });

  readonly filtersForm = form(
    this.filtersModel,
    (path) => {
      debounce(path.search, 400);
    },
  );
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
                this.filtersModel().search,
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
    effect(
      () => {
        this.filtersModel().search;

        this.pageNumber.set(1);
        this.requestCourses();
      },
      {
        injector: this.injector,
      },
    );
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
    const searchWasAlreadyEmpty =
      this.filtersModel().search === '';

    this.selectedCategoryId.set(null);
    this.pageNumber.set(1);

    this.filtersModel.update((model) => ({
      ...model,
      search: '',
    }));

    if (searchWasAlreadyEmpty) {
      this.requestCourses();
    }
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
