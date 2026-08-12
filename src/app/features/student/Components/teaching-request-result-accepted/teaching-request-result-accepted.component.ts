import { Component } from '@angular/core';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-teaching-request-result-accepted',
  imports: [ButtonComponent, RouterLink],
  templateUrl: './teaching-request-result-accepted.component.html',
  styleUrl: './teaching-request-result-accepted.component.css',
})
export class TeachingRequestResultAcceptedComponent {

}
