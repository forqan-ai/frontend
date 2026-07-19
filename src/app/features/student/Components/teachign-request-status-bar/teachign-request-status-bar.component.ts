// teachign-request-status-bar.component.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { RequestStatus } from '../../Models/TeachingRequestStatusDto';


@Component({
  selector: 'app-teachign-request-status-bar',
  templateUrl: './teachign-request-status-bar.component.html',
  styleUrls: ['./teachign-request-status-bar.component.css'],
  standalone: true
})
export class TeachignRequestStatusBarComponent implements OnInit, OnChanges {
  @Input() status: RequestStatus = 'not registered';

  currentStep: number = 1;

  ngOnInit(): void {
    this.updateStep();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status']) {
      this.updateStep();
    }
  }


  private updateStep(): void {
    switch (this.status) {
      case 'not registered':
        // First step - Form submission
        this.currentStep = 1;
        break;

      case 'Pending':
        // Second step - Under review
        this.currentStep = 2;
        break;

      case 'Refused':
        // Still on second step but with refused status
        this.currentStep = 2;
        break;

      case 'Accepted':
        // Third step - Accepted
        this.currentStep = 3;
        break;

      default:
        this.currentStep = 1;
    }
  }

  // Helper method to check if status is refused
  isRefused(): boolean {
    return this.status === 'Refused';
  }

  // Helper method to get status text
  getStatusText(): string {
    switch (this.status) {
      case 'not registered':
        return 'جاري إرسال الطلب';
      case 'Pending':
        return 'قيد المراجعة';
      case 'Accepted':
        return 'تم القبول';
      case 'Refused':
        return 'مرفوض';
      default:
        return '';
    }
  }
}