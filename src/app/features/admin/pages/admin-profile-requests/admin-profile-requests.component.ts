import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AdminProfileService } from '../../services/admin-profile.service';
import {
  ProfileChangeRequest,
  ReviewProfileChangeRequest,
} from '../../models/profile-change-request.model';

@Component({
  selector: 'app-admin-profile-requests',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './admin-profile-requests.component.html',
  styleUrl: './admin-profile-requests.component.css',
})
export class AdminProfileRequestsComponent implements OnInit {
  private adminProfileService = inject(AdminProfileService);

  requests = signal<ProfileChangeRequest[]>([]);

  selectedRequest = signal<ProfileChangeRequest | null>(null);

  loading = signal(false);
  actionLoading = signal(false);

  rejectDialog = signal(false);
  rejectionReason = signal('');

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading.set(true);

    this.adminProfileService.getPendingRequests().subscribe({
      next: (res) => {
        this.requests.set(res);
        this.loading.set(false);
      },

      error: (err) => {
        console.error('Error loading profile requests:', err);
        this.loading.set(false);
      },
    });
  }

  openRequest(request: ProfileChangeRequest): void {
    this.selectedRequest.set(request);
  }

  closeRequest(): void {
    this.selectedRequest.set(null);
    this.rejectDialog.set(false);
    this.rejectionReason.set('');
  }

  approveRequest(): void {
    const request = this.selectedRequest();

    if (!request) {
      return;
    }

    this.actionLoading.set(true);

    const body: ReviewProfileChangeRequest = {
      approve: true,
    };

    this.adminProfileService.reviewRequest(request.id, body).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.closeRequest();
        this.loadRequests();
      },

      error: (err) => {
        console.error('Approve request error:', err);
        this.actionLoading.set(false);
      },
    });
  }

  openRejectDialog(): void {
    this.rejectionReason.set('');
    this.rejectDialog.set(true);
  }

  closeRejectDialog(): void {
    this.rejectDialog.set(false);
    this.rejectionReason.set('');
  }

  onRejectionReasonChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;

    this.rejectionReason.set(target.value);
  }

  rejectRequest(): void {
    const request = this.selectedRequest();

    if (!request) {
      return;
    }

    const reason = this.rejectionReason().trim();

    if (!reason) {
      return;
    }

    this.actionLoading.set(true);

    const body: ReviewProfileChangeRequest = {
      approve: false,
      rejectionReason: reason,
    };

    this.adminProfileService.reviewRequest(request.id, body).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.closeRequest();
        this.loadRequests();
      },

      error: (err) => {
        console.error('Reject request error:', err);
        this.actionLoading.set(false);
      },
    });
  }
}
