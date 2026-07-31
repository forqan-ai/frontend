import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CirclePostFormComponent } from '../circle-post-form/circle-post-form.component';
import { CirclePost } from '../../models/circle-post.models';

@Component({
  selector: 'app-circle-post-card',
  imports: [DatePipe, CirclePostFormComponent],
  templateUrl: './circle-post-card.component.html',
  styleUrl: './circle-post-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePostCardComponent {
  readonly post = input.required<CirclePost>();
  readonly allowMutations = input(false);
  readonly actionsDisabled = input(false);
  readonly editing = input(false);
  readonly updating = input(false);
  readonly deleting = input(false);
  readonly pinning = input(false);

  readonly editRequested = output<void>();
  readonly editCancelled = output<void>();
  readonly updateRequested = output<string>();
  readonly deleteRequested = output<void>();
  readonly pinRequested = output<void>();

  readonly expanded = signal(false);

  readonly hasLongContent = computed(
    () => this.post().content.length > 700,
  );

  toggleExpanded(): void {
    this.expanded.update((expanded) => !expanded);
  }
}
