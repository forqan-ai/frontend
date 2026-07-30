import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type CirclePostAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'pin';

export interface CirclePostsLoadError {
  title: string;
  message: string;
  retryable: boolean;
}

@Injectable({ providedIn: 'root' })
export class CirclePostsErrorService {
  private readonly commonMessages: Readonly<Record<string, string>> = {
    InvalidUserId:
      'تعذر التحقق من بيانات المستخدم. سجّل الدخول مرة أخرى.',
    UserNotFound:
      'تعذر العثور على حساب المستخدم.',
    CircleNotFound:
      'حلقة التعلم المطلوبة غير موجودة.',
    AccessCheckFailed:
      'تعذر التحقق من صلاحيات الحلقة. حاول مرة أخرى.',
    CircleArchived:
      'الحلقة مؤرشفة، لذلك لا يمكن إجراء تغييرات على منشوراتها.',
    CirclePostNotFound:
      'المنشور المطلوب لم يعد موجودًا.',
    InvalidPostContent:
      'محتوى المنشور مطلوب ويجب ألا يزيد عن 5000 حرف.',
    PostImageEmpty:
      'الصورة المحددة فارغة. اختر صورة أخرى.',
    PostImageTooLarge:
      'يجب ألا يزيد حجم صورة المنشور عن 5 ميجابايت.',
    PostImageTypeNotAllowed:
      'يُسمح فقط بصور JPEG وPNG وWebP.',
  };

  private readonly actionMessages: Readonly<
    Record<CirclePostAction, Readonly<Record<string, string>>>
  > = {
    create: {
      PostCreationForbidden:
        'لا تملك صلاحية نشر محتوى داخل هذه الحلقة.',
      PostNotCreated:
        'تعذر إنشاء المنشور. حاول مرة أخرى.',
      CreatedPostNotLoaded:
        'تم حفظ المنشور، لكن تعذر تحميله. حدّث القائمة.',
      PostImageUploadFailed:
        'تعذر رفع صورة المنشور. حاول مرة أخرى.',
    },
    update: {
      PostUpdateForbidden:
        'لا تملك صلاحية تعديل هذا المنشور.',
      PostAuthorRequired:
        'كاتب المنشور فقط يمكنه تعديل محتواه.',
      PostContentUnchanged:
        'لم يتغير محتوى المنشور.',
      PostNotUpdated:
        'تعذر تحديث المنشور. حاول مرة أخرى.',
      UpdatedPostNotLoaded:
        'تم تحديث المنشور، لكن تعذر تحميل النسخة الجديدة.',
    },
    delete: {
      PostDeletionForbidden:
        'لا تملك صلاحية حذف هذا المنشور.',
      PostNotDeleted:
        'تعذر حذف المنشور. حاول مرة أخرى.',
    },
    pin: {
      PostPinForbidden:
        'لا تملك صلاحية تثبيت المنشورات في هذه الحلقة.',
      PostPinStatusUnchanged:
        'تم تغيير حالة تثبيت المنشور بالفعل.',
      PostPinNotUpdated:
        'تعذر تحديث حالة تثبيت المنشور. حاول مرة أخرى.',
      PinnedPostNotLoaded:
        'تم تحديث حالة التثبيت، لكن تعذر تحميل المنشور.',
    },
  };

  getLoadError(error: HttpErrorResponse): CirclePostsLoadError {
    if (error.status === 0) {
      return {
        title: 'تعذر تحميل منشورات الحلقة',
        message:
          'تحقق من الاتصال بالإنترنت ثم حاول تحميل المنشورات مرة أخرى.',
        retryable: true,
      };
    }

    if (error.status === 401) {
      return {
        title: 'انتهت جلسة تسجيل الدخول',
        message:
          'سجّل الدخول مرة أخرى للوصول إلى منشورات حلقة التعلم.',
        retryable: false,
      };
    }

    const errorCode = this.extractErrorCode(error.error);

    if (
      error.status === 404 ||
      errorCode === 'CircleNotFound'
    ) {
      return {
        title: 'تعذر العثور على الحلقة',
        message:
          'قد تكون الحلقة غير موجودة أو أن الرابط المستخدم غير صحيح.',
        retryable: false,
      };
    }

    if (
      error.status === 403 ||
      errorCode === 'PostsViewForbidden'
    ) {
      return {
        title: 'منشورات الحلقة غير متاحة',
        message:
          'لا يملك حسابك الحالي صلاحية عرض منشورات هذه الحلقة.',
        retryable: false,
      };
    }

    return {
      title: 'تعذر تحميل منشورات الحلقة',
      message: 'حدث خطأ غير متوقع. حاول مرة أخرى.',
      retryable: true,
    };
  }

  getActionMessage(
    error: HttpErrorResponse,
    action: CirclePostAction,
  ): string {
    if (error.status === 0) {
      return 'تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مرة أخرى.';
    }

    if (error.status === 401) {
      return 'انتهت جلسة تسجيل الدخول. سجّل الدخول مرة أخرى.';
    }

    const errorCode = this.extractErrorCode(error.error);

    if (errorCode && this.commonMessages[errorCode]) {
      return this.commonMessages[errorCode];
    }

    const messages = this.actionMessages[action];

    if (errorCode && messages[errorCode]) {
      return messages[errorCode];
    }

    switch (action) {
      case 'create':
        return 'تعذر إنشاء المنشور. حاول مرة أخرى.';
      case 'update':
        return 'تعذر تحديث المنشور. حاول مرة أخرى.';
      case 'delete':
        return 'تعذر حذف المنشور. حاول مرة أخرى.';
      case 'pin':
        return 'تعذر تحديث حالة تثبيت المنشور. حاول مرة أخرى.';
    }
  }

  shouldResync(
    error: HttpErrorResponse,
    action?: CirclePostAction,
  ): boolean {
    const errorCode = this.extractErrorCode(error.error);

    if (
      action === 'update' &&
      errorCode === 'PostContentUnchanged'
    ) {
      return false;
    }

    return (
      error.status === 403 ||
      error.status === 404 ||
      error.status === 409
    );
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
