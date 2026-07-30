import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, finalize } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { CirclePostCardComponent } from '../circle-post-card/circle-post-card.component';
import { CirclePostFormComponent } from '../circle-post-form/circle-post-form.component';
import { DeleteCirclePostConfirmationModalComponent } from '../delete-circle-post-confirmation-modal/delete-circle-post-confirmation-modal.component';
import { LearningCirclesPaginationComponent } from '../learning-circles-pagination/learning-circles-pagination.component';
import {
  CirclePost,
  CreateCirclePostRequest,
} from '../../models/circle-post.models';
import { LearningCircleDetails } from '../../models/learning-circle.models';
import {
  CirclePostAction,
  CirclePostsErrorService,
  CirclePostsLoadError,
} from '../../services/circle-posts-error.service';
import { CirclePostsService } from '../../services/circle-posts.service';

type PendingPostAction = {
  type: Exclude<CirclePostAction, 'create'>;
  postId: string;
};

@Component({
  selector: 'app-circle-posts-section',
  imports: [
    CirclePostFormComponent,
    CirclePostCardComponent,
    LearningCirclesPaginationComponent,
    DeleteCirclePostConfirmationModalComponent,
  ],
  templateUrl: './circle-posts-section.component.html',
  styleUrl: './circle-posts-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePostsSectionComponent implements OnInit {
  private readonly postsService =
    inject(CirclePostsService);

  private readonly errorService =
    inject(CirclePostsErrorService);

  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly details = input.required<LearningCircleDetails>();
  readonly active = input(true);
  readonly detailsRefreshRequested = output<void>();

  readonly posts = signal<CirclePost[]>([]);
  readonly pageNumber = signal(1);
  readonly pageSize = 8;
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(false);
  readonly loadError =
    signal<CirclePostsLoadError | null>(null);

  readonly createPending = signal(false);
  readonly createFormResetVersion = signal(0);
  readonly editingPostId = signal<string | null>(null);
  readonly postToDelete = signal<CirclePost | null>(null);
  readonly pendingAction =
    signal<PendingPostAction | null>(null);

  readonly canCreatePost = computed(() => {
    const circle = this.details();

    return (
      !circle.isArchived &&
      circle.permissions.canCreatePost
    );
  });

  readonly allowMutations = computed(
    () => !this.details().isArchived,
  );

  readonly mutationPending = computed(
    () =>
      this.createPending() ||
      this.pendingAction() !== null,
  );

  private listSubscription: Subscription | null = null;
  private requestId = 0;

  constructor() {
    effect(() => {
      const interactionsUnavailable =
        !this.active() ||
        this.details().isArchived ||
        !this.details().permissions.canViewPosts;

      if (interactionsUnavailable) {
        untracked(() => {
          this.editingPostId.set(null);
          this.postToDelete.set(null);
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  createPost(request: CreateCirclePostRequest): void {
    if (
      !this.canCreatePost() ||
      this.mutationPending() ||
      this.editingPostId()
    ) {
      return;
    }

    this.createPending.set(true);

    this.postsService
      .createPost(this.details().circleId, request)
      .pipe(
        finalize(() => this.createPending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.createFormResetVersion.update(
            (version) => version + 1,
          );
          this.pageNumber.set(1);
          this.toast.show('تم نشر المنشور بنجاح.');
          this.loadPosts();
          this.detailsRefreshRequested.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.handleActionError(error, 'create');
        },
      });
  }

  startEditing(post: CirclePost): void {
    if (
      !this.allowMutations() ||
      !post.canEdit ||
      this.mutationPending() ||
      this.editingPostId() !== null
    ) {
      return;
    }

    this.editingPostId.set(post.postId);
    this.postToDelete.set(null);
  }

  cancelEditing(): void {
    if (!this.mutationPending()) {
      this.editingPostId.set(null);
    }
  }

  updatePost(post: CirclePost, content: string): void {
    if (
      !this.allowMutations() ||
      !post.canEdit ||
      this.mutationPending() ||
      this.editingPostId() !== post.postId
    ) {
      return;
    }

    this.pendingAction.set({
      type: 'update',
      postId: post.postId,
    });

    this.postsService
      .updatePost(
        this.details().circleId,
        post.postId,
        { content },
      )
      .pipe(
        finalize(() => this.pendingAction.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (updatedPost) => {
          this.posts.update((posts) =>
            posts.map((item) =>
              item.postId === updatedPost.postId
                ? updatedPost
                : item,
            ),
          );
          this.editingPostId.set(null);
          this.toast.show('تم تحديث المنشور بنجاح.');
          this.detailsRefreshRequested.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.handleActionError(error, 'update');
        },
      });
  }

  openDeleteConfirmation(post: CirclePost): void {
    if (
      !this.allowMutations() ||
      !post.canDelete ||
      this.mutationPending() ||
      this.editingPostId() !== null
    ) {
      return;
    }

    this.editingPostId.set(null);
    this.postToDelete.set(post);
  }

  closeDeleteConfirmation(): void {
    if (!this.mutationPending()) {
      this.postToDelete.set(null);
    }
  }

  confirmDelete(): void {
    const post = this.postToDelete();

    if (
      !post ||
      !this.allowMutations() ||
      !post.canDelete ||
      this.mutationPending()
    ) {
      return;
    }

    this.pendingAction.set({
      type: 'delete',
      postId: post.postId,
    });

    this.postsService
      .deletePost(this.details().circleId, post.postId)
      .pipe(
        finalize(() => this.pendingAction.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (deleted) => {
          if (!deleted) {
            this.toast.show(
              'تعذر حذف المنشور. حاول مرة أخرى.',
              'error',
            );
            return;
          }

          if (
            this.posts().length === 1 &&
            this.pageNumber() > 1
          ) {
            this.pageNumber.update((page) => page - 1);
          }

          this.postToDelete.set(null);
          this.toast.show('تم حذف المنشور بنجاح.');
          this.loadPosts();
          this.detailsRefreshRequested.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.handleActionError(error, 'delete');
        },
      });
  }

  togglePin(post: CirclePost): void {
    if (
      !this.allowMutations() ||
      !post.canPin ||
      this.mutationPending() ||
      this.editingPostId() !== null
    ) {
      return;
    }

    const willPin = !post.isPinned;

    this.pendingAction.set({
      type: 'pin',
      postId: post.postId,
    });

    this.postsService
      .setPin(
        this.details().circleId,
        post.postId,
        { isPinned: willPin },
      )
      .pipe(
        finalize(() => this.pendingAction.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.editingPostId.set(null);
          this.pageNumber.set(1);
          this.toast.show(
            willPin
              ? 'تم تثبيت المنشور بنجاح.'
              : 'تم إلغاء تثبيت المنشور.',
          );
          this.loadPosts();
          this.detailsRefreshRequested.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.handleActionError(error, 'pin');
        },
      });
  }

  goToPage(page: number): void {
    this.editingPostId.set(null);
    this.pageNumber.set(page);
    this.loadPosts();
  }

  retry(): void {
    this.loadPosts();
  }

  isEditing(post: CirclePost): boolean {
    return this.editingPostId() === post.postId;
  }

  isUpdating(post: CirclePost): boolean {
    return this.isActionPending('update', post.postId);
  }

  isDeleting(post: CirclePost): boolean {
    return this.isActionPending('delete', post.postId);
  }

  isPinning(post: CirclePost): boolean {
    return this.isActionPending('pin', post.postId);
  }

  contentPreview(content: string): string {
    const normalized = content.trim();

    return normalized.length > 180
      ? `${normalized.slice(0, 180)}…`
      : normalized;
  }

  private loadPosts(): void {
    if (!this.details().permissions.canViewPosts) {
      return;
    }

    const currentRequestId = ++this.requestId;

    this.listSubscription?.unsubscribe();
    this.loading.set(true);
    this.loadError.set(null);

    this.listSubscription = this.postsService
      .getPosts(this.details().circleId, {
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize,
      })
      .pipe(
        finalize(() => {
          if (currentRequestId === this.requestId) {
            this.loading.set(false);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          if (currentRequestId !== this.requestId) {
            return;
          }

          if (
            result.totalPages > 0 &&
            this.pageNumber() > result.totalPages
          ) {
            this.pageNumber.set(result.totalPages);
            this.loadPosts();
            return;
          }

          if (
            result.totalPages === 0 &&
            this.pageNumber() !== 1
          ) {
            this.pageNumber.set(1);
          }

          this.posts.set(result.items);
          this.totalCount.set(result.totalCount);
          this.totalPages.set(result.totalPages);
        },
        error: (error: HttpErrorResponse) => {
          if (currentRequestId !== this.requestId) {
            return;
          }

          this.resetPosts();
          this.loadError.set(
            this.errorService.getLoadError(error),
          );

          if (this.errorService.shouldResync(error)) {
            this.detailsRefreshRequested.emit();
          }
        },
      });
  }

  private handleActionError(
    error: HttpErrorResponse,
    action: CirclePostAction,
  ): void {
    this.toast.show(
      this.errorService.getActionMessage(error, action),
      'error',
    );

    if (this.errorService.shouldResync(error, action)) {
      this.editingPostId.set(null);
      this.postToDelete.set(null);
      this.loadPosts();
      this.detailsRefreshRequested.emit();
    }
  }

  private isActionPending(
    type: PendingPostAction['type'],
    postId: string,
  ): boolean {
    const action = this.pendingAction();

    return (
      action?.type === type &&
      action.postId === postId
    );
  }

  private resetPosts(): void {
    this.posts.set([]);
    this.totalCount.set(0);
    this.totalPages.set(0);
  }
}
