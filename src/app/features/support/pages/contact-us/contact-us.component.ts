import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
})
export class ContactUsComponent {
  readonly supportEmail = 'info@furqan.com';

  getMailto(subject: string): string {
    return `mailto:${this.supportEmail}?subject=${encodeURIComponent(subject)}`;
  }
}
