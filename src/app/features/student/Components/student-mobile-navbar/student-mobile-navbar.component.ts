import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationBellComponent } from '../../../../shared/components/notification-bell/notification-bell.component';

@Component({
  selector: 'app-student-mobile-navbar',
  imports: [RouterLink, NotificationBellComponent],
  templateUrl: './student-mobile-navbar.component.html',
  styleUrl: './student-mobile-navbar.component.css',
})
export class StudentMobileNavbarComponent {

}
