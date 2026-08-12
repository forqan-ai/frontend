import { Component, inject } from '@angular/core';
import { ButtonComponent } from "../../components/button/button.component";
import { RoutingService } from '../../../core/services/routing.service';

@Component({
  selector: 'app-not-found',
  imports: [ButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {

  routingService = inject(RoutingService);

}
