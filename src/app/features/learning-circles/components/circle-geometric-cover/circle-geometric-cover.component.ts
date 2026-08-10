import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-circle-geometric-cover',
  templateUrl: './circle-geometric-cover.component.html',
  styleUrl: './circle-geometric-cover.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleGeometricCoverComponent {
  readonly circleId = input.required<string>();
  readonly circleName = input('');
  readonly compact = input(false);

  readonly variant = computed(() => {
    const value = this.circleId() || this.circleName() || 'forqan';
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }

    return (hash % 8) + 1;
  });
}
