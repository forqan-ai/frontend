import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reward } from '../../models/Reward';

@Component({
  selector: 'app-reward-popup',
  imports: [],
  templateUrl: './reward-popup.component.html',
  styleUrl: './reward-popup.component.css',
})
export class RewardPopupComponent {
  @Input({ required: true })
  reward!: Reward;

  @Input()
  loading = false;

  @Output()
  claim = new EventEmitter<void>();

  @Output()
  close = new EventEmitter<void>();

  onClaim() {
    this.claim.emit();
  }

  onClose() {
    this.close.emit();
  }
}
