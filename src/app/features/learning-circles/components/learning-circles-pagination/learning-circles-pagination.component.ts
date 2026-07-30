import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-learning-circles-pagination',
  templateUrl: './learning-circles-pagination.component.html',
  styleUrl: './learning-circles-pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningCirclesPaginationComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly disabled = input(false);
  readonly ariaLabel = input('صفحات حلقات التعلم');

  readonly pageChanged = output<number>();

  readonly pageNumbers = computed<number[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 5) {
      return Array.from(
        { length: total },
        (_, index) => index + 1,
      );
    }

    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);

    start = Math.max(1, end - 4);
    end = Math.min(total, start + 4);

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index,
    );
  });

  changePage(page: number): void {
    if (
      this.disabled() ||
      page < 1 ||
      page > this.totalPages() ||
      page === this.currentPage()
    ) {
      return;
    }

    this.pageChanged.emit(page);
  }
}
