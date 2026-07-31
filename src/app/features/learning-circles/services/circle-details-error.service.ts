import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface CircleDetailsLoadError {
  title: string;
  message: string;
  retryable: boolean;
}

@Injectable({ providedIn: 'root' })
export class CircleDetailsErrorService {
  private readonly archiveMessages: Readonly<Record<string, string>> = {
    InvalidUserId:
      'تعذر التحقق من بيانات المستخدم. سجّل الدخول مرة أخرى.',
    UserNotFound:
      'تعذر العثور على حساب المستخدم.',
    CircleNotFound:
      'حلقة التعلم المطلوبة غير موجودة.',
    CircleAlreadyArchived:
      'تمت أرشفة هذه الحلقة بالفعل.',
    CircleArchiveForbidden:
      'لا تملك صلاحية أرشفة هذه الحلقة.',
    CircleNotArchived:
      'تعذر أرشفة الحلقة. حاول مرة أخرى.',
    AccessCheckFailed:
      'تعذر التحقق من صلاحيات الحلقة. حاول مرة أخرى.',
  };

  getLoadError(error: HttpErrorResponse): CircleDetailsLoadError {
    if (error.status === 0) {
      return {
        title: 'تعذر الاتصال بالخادم',
        message:
          'تحقق من الاتصال بالإنترنت ثم حاول تحميل الحلقة مرة أخرى.',
        retryable: true,
      };
    }

    if (error.status === 401) {
      return {
        title: 'انتهت جلسة تسجيل الدخول',
        message: 'سجّل الدخول مرة أخرى للوصول إلى تفاصيل الحلقة.',
        retryable: false,
      };
    }

    const errorCode = this.extractErrorCode(error.error);

    if (
      error.status === 404 ||
      errorCode === 'CircleNotFound'
    ) {
      return {
        title: 'الحلقة غير موجودة',
        message:
          'قد تكون الحلقة حُذفت أو أن الرابط المستخدم غير صحيح.',
        retryable: false,
      };
    }

    if (
      error.status === 403 ||
      errorCode === 'ArchivedCircleAccessDenied'
    ) {
      return {
        title: 'لا يمكنك الوصول إلى هذه الحلقة',
        message:
          'تفاصيل الحلقة المؤرشفة متاحة لأعضائها فقط.',
        retryable: false,
      };
    }

    return {
      title: 'تعذر تحميل تفاصيل الحلقة',
      message: 'حدث خطأ غير متوقع. حاول مرة أخرى.',
      retryable: true,
    };
  }

  getArchiveMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مرة أخرى.';
    }

    if (error.status === 401) {
      return 'انتهت جلسة تسجيل الدخول. سجّل الدخول مرة أخرى.';
    }

    const errorCode = this.extractErrorCode(error.error);

    if (errorCode && this.archiveMessages[errorCode]) {
      return this.archiveMessages[errorCode];
    }

    return 'تعذر أرشفة الحلقة. حاول مرة أخرى.';
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
