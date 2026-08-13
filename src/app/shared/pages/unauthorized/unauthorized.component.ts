import { Component, inject } from '@angular/core';
import { ButtonComponent } from "../../components/button/button.component";
import { RoutingService } from '../../../core/services/routing.service';

@Component({
  selector: 'app-unauthorized',
  imports: [ButtonComponent],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css',
})
export class UnauthorizedComponent {

  routingService = inject(RoutingService);
}
