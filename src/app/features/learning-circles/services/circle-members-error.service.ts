import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddCircleMemberStatus } from '../models/circle-member.models';

export type CircleMemberAction =
  | 'candidates'
  | 'add'
  | 'remove'
  | 'role';

export interface CircleMembersLoadError {
  title: string;
  message: string;
  retryable: boolean;
}

@Injectable({ providedIn: 'root' })
export class CircleMembersErrorService {
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
      'الحلقة مؤرشفة، لذلك لا يمكن إجراء تغييرات على أعضائها.',
    MembersManagementForbidden:
      'لا تملك صلاحية إدارة أعضاء هذه الحلقة.',
  };

  private readonly actionMessages: Readonly<
    Record<CircleMemberAction, Readonly<Record<string, string>>>
  > = {
    candidates: {},
    add: {
      InvalidEmailsCount:
        'يجب إدخال بريد إلكتروني واحد على الأقل، وبحد أقصى 50 بريدًا.',
      MembersNotAdded:
        'تعذر إضافة المتعلمين إلى الحلقة. حاول مرة أخرى.',
      MembersAdditionConflict:
        'تعذر إتمام الإضافة لأن بعض المتعلمين قد أصبحوا أعضاء بالفعل.',
    },
    remove: {
      CannotRemoveYourself:
        'لا يمكنك إزالة نفسك من الحلقة. استخدم خيار مغادرة الحلقة.',
      OwnerCannotBeRemoved:
        'لا يمكن إزالة مالك الحلقة.',
      ModeratorRemovalForbidden:
        'المشرف يستطيع إزالة الأعضاء العاديين فقط.',
      CircleMemberNotFound:
        'العضو المطلوب لم يعد موجودًا في الحلقة.',
      MemberNotRemoved:
        'تعذر إزالة العضو من الحلقة. حاول مرة أخرى.',
    },
    role: {
      MemberRoleChangeForbidden:
        'لا تملك صلاحية تغيير أدوار أعضاء هذه الحلقة.',
      InvalidCircleRole:
        'الدور المختار غير صالح. اختر عضوًا أو مشرفًا.',
      CircleMemberNotFound:
        'العضو المطلوب لم يعد موجودًا في الحلقة.',
      OwnerRoleCannotBeChanged:
        'لا يمكن تغيير دور مالك الحلقة.',
      MemberRoleUnchanged:
        'العضو لديه هذا الدور بالفعل.',
      MemberRoleNotUpdated:
        'تعذر تحديث دور العضو. حاول مرة أخرى.',
    },
  };

  getLoadError(error: HttpErrorResponse): CircleMembersLoadError {
    if (error.status === 0) {
      return {
        title: 'تعذر تحميل أعضاء الحلقة',
        message:
          'تحقق من الاتصال بالإنترنت ثم حاول تحميل قائمة الأعضاء مرة أخرى.',
        retryable: true,
      };
    }

    if (error.status === 401) {
      return {
        title: 'انتهت جلسة تسجيل الدخول',
        message:
          'سجّل الدخول مرة أخرى للوصول إلى أعضاء حلقة التعلم.',
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
      errorCode === 'MembersViewForbidden'
    ) {
      return {
        title: 'أعضاء الحلقة غير متاحين',
        message:
          'لا يملك حسابك الحالي صلاحية عرض أعضاء هذه الحلقة.',
        retryable: false,
      };
    }

    return {
      title: 'تعذر تحميل أعضاء الحلقة',
      message: 'حدث خطأ غير متوقع. حاول مرة أخرى.',
      retryable: true,
    };
  }

  getActionMessage(
    error: HttpErrorResponse,
    action: CircleMemberAction,
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

    const actionMessages = this.actionMessages[action];

    if (errorCode && actionMessages[errorCode]) {
      return actionMessages[errorCode];
    }

    switch (action) {
      case 'candidates':
        return 'تعذر البحث عن المتعلمين. حاول مرة أخرى.';
      case 'add':
        return 'تعذر إضافة المتعلمين إلى الحلقة. حاول مرة أخرى.';
      case 'remove':
        return 'تعذر إزالة العضو من الحلقة. حاول مرة أخرى.';
      case 'role':
        return 'تعذر تحديث دور العضو. حاول مرة أخرى.';
    }
  }

  additionStatusLabel(status: AddCircleMemberStatus): string {
    switch (status) {
      case AddCircleMemberStatus.Added:
        return 'تمت الإضافة';
      case AddCircleMemberStatus.AlreadyMember:
        return 'عضو بالفعل';
      case AddCircleMemberStatus.NotFound:
        return 'لا يوجد حساب بهذا البريد';
      case AddCircleMemberStatus.NotStudent:
        return 'الحساب ليس مؤهلًا للتعلم';
      case AddCircleMemberStatus.NotLearner:
        return 'الحساب ليس مؤهلًا للتعلم';
      case AddCircleMemberStatus.Inactive:
        return 'حساب المتعلم غير نشط';
      case AddCircleMemberStatus.InvalidEmail:
        return 'البريد الإلكتروني غير صالح';
      case AddCircleMemberStatus.DuplicateInRequest:
        return 'البريد مكرر في الطلب';
    }
  }

  shouldResync(error: HttpErrorResponse): boolean {
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
