import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

export type CircleContentSection = 'posts' | 'members';

@Component({
  selector: 'app-circle-content-navigation',
  templateUrl: './circle-content-navigation.component.html',
  styleUrl: './circle-content-navigation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleContentNavigationComponent {
  readonly activeSection =
    input.required<CircleContentSection>();
  readonly canViewPosts = input(false);
  readonly canViewMembers = input(false);
  readonly postsCount = input(0);
  readonly membersCount = input(0);

  readonly sectionChanged =
    output<CircleContentSection>();

  selectSection(section: CircleContentSection): void {
    const allowed =
      section === 'posts'
        ? this.canViewPosts()
        : this.canViewMembers();

    if (!allowed || section === this.activeSection()) {
      return;
    }

    this.sectionChanged.emit(section);
  }
}
