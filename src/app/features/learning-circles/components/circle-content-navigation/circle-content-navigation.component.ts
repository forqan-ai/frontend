import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

export type CircleContentSection = 'posts' | 'members' | 'chat' | 'sessions';

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
  readonly canViewChat = input(false);
  readonly canViewSessions = input(false);
  readonly postsCount = input(0);
  readonly membersCount = input(0);

  readonly sectionChanged =
    output<CircleContentSection>();

  selectSection(section: CircleContentSection): void {
    let allowed = false;
    if (section === 'posts') allowed = this.canViewPosts();
    else if (section === 'members') allowed = this.canViewMembers();
    else if (section === 'chat') allowed = this.canViewChat();
    else if (section === 'sessions') allowed = this.canViewSessions();

    if (!allowed || section === this.activeSection()) {
      return;
    }

    this.sectionChanged.emit(section);
  }
}
