import { Component, Input } from '@angular/core';
import { ButtonComponent } from "../../../../shared/components/button/button.component";

@Component({
  selector: 'app-teaching-request-result-rejected',
  imports: [ButtonComponent],
  templateUrl: './teaching-request-result-rejected.component.html',
  styleUrl: './teaching-request-result-rejected.component.css',
})
export class TeachingRequestResultRejectedComponent {

  @Input() rejectionReason: string = '';

}
