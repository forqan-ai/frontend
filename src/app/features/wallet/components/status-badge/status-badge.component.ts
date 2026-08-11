import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithdrawalStatus, WithdrawalStatusClass, WithdrawalStatusLabel } from '../../wallet.models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css',
})
export class StatusBadgeComponent {
  status = input.required<WithdrawalStatus>();

  get label(): string {
    return WithdrawalStatusLabel[this.status()];
  }

  get cssClass(): string {
    return WithdrawalStatusClass[this.status()] ?? 'badge-pending';
  }
}
