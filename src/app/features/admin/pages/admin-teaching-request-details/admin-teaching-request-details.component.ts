import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeachingRequestDto } from '../../models/TeachingRequestDto';
import { RequestState } from '../../models/RequestState';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminTeachingRequestsService } from '../../services/admin-teaching-requests.service';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { RequestResponseDto } from '../../models/RequestResponseDto';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-teaching-request-details',
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './admin-teaching-request-details.component.html',
  styleUrl: './admin-teaching-request-details.component.css',
})
export class AdminTeachingRequestDetailsComponent {

  readonly RequestState = RequestState;
  loading = signal<boolean>(true);
  rejectionReason = signal('');

  request = signal<TeachingRequestDto | null>(null);
  adminTeachingRequestsService = inject(AdminTeachingRequestsService);
  route = inject(ActivatedRoute);
  toast = inject(ToastService);
  userService = inject(AuthService);

  specializations = signal<string[]>([]);

  adminService = inject(AdminTeachingRequestsService);


  ngOnInit() {
    const requestId = this.route.snapshot.paramMap.get('id');

    if (!requestId) {
      console.error('Request id not found.');
      return;
    }
    console.log(requestId);
    this.adminTeachingRequestsService.getRequestDetails(requestId).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.request.set(res);
        this.request.set({
          ...res,
          specializations: JSON.parse(res.specializations as unknown as string)
        });
      },
      error: (err) => {
        this.loading.set(false);
        console.log(err)
      }
    })
  }


  acceptRequest(): void {
    const response: RequestResponseDto = {
      requestId: this.request()?.id!,
      userId: this.request()?.userId!,
      reviewerId: this.userService.getUserId()!,
      rejectionReason: "",
      status: RequestState.Accepted
    }
    this.adminService.SetRequestResponse(response).subscribe({
      next: (res) => {
        this.toast.show('تم إرسال التقييم بنجاح')
        //update request state : 
        this.request.update(request => {
          if (request === null) {
            return null;
          }
          return {
            ...request,
            status: RequestState.Accepted
          };
        });
      }
      ,
      error: (err) => {
        console.log(err);
        this.toast.show('حدث خطاء اثناء إرسال الطلب, يرجي المحاولة لاحقا', 'error')
      }
    })
  }



  rejectRequest(): void {
    const response: RequestResponseDto = {
      requestId: this.request()?.id!,
      userId: this.request()?.userId!,
      reviewerId: this.userService.getUserId()!,
      rejectionReason: this.rejectionReason(),
      status: RequestState.Refused
    }
    this.adminService.SetRequestResponse(response).subscribe({
      next: (res) => {
        this.toast.show('تم إرسال التقييم بنجاح')
        //update request state : 
        this.request.update(request => {
          if (request === null) {
            return null;
          }
          return {
            ...request,
            status: RequestState.Refused
          };
        });
      }
      ,
      error: (err) => {
        console.log(err);
        this.toast.show('حدث خطاء اثناء إرسال الطلب, يرجي المحاولة لاحقا', 'error')
      }
    })
  }

  openAttachment(url: string): void {
    window.open(url, '_blank');
  }

  isPdf(url: string): boolean {
    return url.toLowerCase().includes('.pdf');
  }

  disableRejectReason = signal(true);


}