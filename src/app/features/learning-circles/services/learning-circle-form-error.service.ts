import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type LearningCircleFormAction =
  | 'create'
  | 'load'
  | 'update';

@Injectable({ providedIn: 'root' })
export class LearningCircleFormErrorService {
  private readonly messages: Readonly<Record<string, string>> = {
    InvalidUserId:
      'تعذر التحقق من بيانات المستخدم. سجّل الدخول مرة أخرى.',
    UserNotFound:
      'تعذر العثور على حساب المستخدم.',
    TeacherRoleRequired:
      'إنشاء حلقات التعلم متاح للمعلمين فقط.',
    InactiveTeacher:
      'يجب أن يكون حساب المعلم نشطًا لإنشاء حلقة تعلم.',
    TeacherProfileNotFound:
      'يجب استكمال ملف المعلم قبل إنشاء حلقة تعلم.',
    CircleNotCreated:
      'تعذر إنشاء حلقة التعلم. حاول مرة أخرى.',
    CircleNotFound:
      'حلقة التعلم المطلوبة غير موجودة.',
    ArchivedCircleAccessDenied:
      'لا يمكنك الوصول إلى هذه الحلقة المؤرشفة.',
    CircleArchived:
      'لا يمكن تعديل حلقة تعلم مؤرشفة.',
    CircleEditForbidden:
      'لا تملك صلاحية تعديل هذه الحلقة.',
    CircleNotUpdated:
      'تعذر حفظ تعديلات الحلقة. حاول مرة أخرى.',
  };

  getMessage(
    error: HttpErrorResponse,
    action: LearningCircleFormAction,
  ): string {
    if (error.status === 0) {
      return 'تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مرة أخرى.';
    }

    if (error.status === 401) {
      return 'انتهت جلسة تسجيل الدخول. سجّل الدخول مرة أخرى.';
    }

    if (this.hasValidationErrors(error.error)) {
      return 'تحقق من بيانات الحلقة والقيود الموضحة أسفل الحقول.';
    }

    const errorCode = this.extractErrorCode(error.error);

    if (errorCode && this.messages[errorCode]) {
      return this.messages[errorCode];
    }

    switch (action) {
      case 'create':
        return 'تعذر إنشاء حلقة التعلم. حاول مرة أخرى.';

      case 'update':
        return 'تعذر حفظ تعديلات الحلقة. حاول مرة أخرى.';

      default:
        return 'تعذر تحميل بيانات الحلقة. حاول مرة أخرى.';
    }
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

  private hasValidationErrors(body: unknown): boolean {
    if (!this.isRecord(body)) {
      return false;
    }

    const errors = body['errors'];

    return this.isRecord(errors) &&
      Object.keys(errors).length > 0;
  }

  private isRecord(
    value: unknown,
  ): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
