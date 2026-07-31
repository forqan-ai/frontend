import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CircleMembershipAction } from '../models/circle-action.models';

@Injectable({ providedIn: 'root' })
export class CircleActionErrorService {
  private readonly commonMessages: Readonly<Record<string, string>> = {
    InvalidUserId:
      'تعذر التحقق من بيانات المستخدم. سجّل الدخول مرة أخرى.',
    UserNotFound:
      'تعذر العثور على حساب المستخدم.',
    CircleNotFound:
      'حلقة التعلم المطلوبة غير موجودة.',
    AccessCheckFailed:
      'تعذر التحقق من صلاحيات الحلقة. حاول مرة أخرى.',
  };

  private readonly joinErrorMessages: Readonly<Record<string, string>> = {
    AlreadyCircleMember: 'أنت عضو في حلقة التعلم بالفعل.',
    CircleArchived: 'لا يمكن الانضمام إلى حلقة مؤرشفة.',
    CircleClosed: 'هذه الحلقة متاحة للانضمام عن طريق الدعوة فقط.',
    CircleJoinForbidden: 'لا تملك صلاحية الانضمام إلى هذه الحلقة.',
    CircleJoinFailed: 'تعذر الانضمام إلى الحلقة. حاول مرة أخرى.',
    CircleJoinConflict: 'تعذر إتمام الانضمام. قد تكون عضوًا بالفعل.',
  };

  private readonly leaveErrorMessages: Readonly<Record<string, string>> = {
    CircleArchived: 'لا يمكن مغادرة حلقة مؤرشفة.',
    NotCircleMember: 'أنت لست عضوًا في هذه الحلقة.',
    OwnerCannotLeave: 'مالك الحلقة لا يمكنه مغادرتها.',
    CircleLeaveForbidden: 'لا تملك صلاحية مغادرة هذه الحلقة.',
    CircleLeaveFailed: 'تعذر مغادرة الحلقة. حاول مرة أخرى.',
  };

  getMessage(
    error: HttpErrorResponse,
    action: CircleMembershipAction,
  ): string {
    if (error.status === 401) {
      return 'انتهت جلسة تسجيل الدخول. سجّل الدخول مرة أخرى.';
    }

    if (error.status === 0) {
      return 'تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مرة أخرى.';
    }

    const errorCode = this.extractErrorCode(error.error);

    if (errorCode && this.commonMessages[errorCode]) {
      return this.commonMessages[errorCode];
    }

    const messages =
      action === 'join'
        ? this.joinErrorMessages
        : this.leaveErrorMessages;

    if (errorCode && messages[errorCode]) {
      return messages[errorCode];
    }

    return action === 'join'
      ? 'تعذر الانضمام إلى الحلقة. حاول مرة أخرى.'
      : 'تعذر مغادرة الحلقة. حاول مرة أخرى.';
  }

  private extractErrorCode(body: unknown): string | null {
    if (!this.isRecord(body)) {
      return null;
    }

    const errorCode = body['errorCode'];

    if (typeof errorCode === 'string') {
      return errorCode;
    }

    const code = body['code'];

    return typeof code === 'string' ? code : null;
  }

  private isRecord(
    value: unknown,
  ): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
