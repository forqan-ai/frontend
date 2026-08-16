import { Component, input, output } from '@angular/core';
import { NotificationBellComponent } from '../../../../shared/components/notification-bell/notification-bell.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NotificationBellComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {

  teacherName = input('Teacher');

  image = input('');

  menuClick = output<void>();

}