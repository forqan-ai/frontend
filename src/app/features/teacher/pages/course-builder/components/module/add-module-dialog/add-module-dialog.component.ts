import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ModuleService } from '../../../../../services/module.service';

@Component({
  selector: 'app-add-module-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-module-dialog.component.html',
  styleUrl: './add-module-dialog.component.css'
})
export class AddModuleDialogComponent {

  @Input({ required: true })
  courseId!: string;

  @Output()
  saved = new EventEmitter<void>();

  @Output()
  close = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly moduleService = inject(ModuleService);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly successMsg = signal<string | null>(null);
  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    title: [
      '',
      [
        Validators.required,
        Validators.maxLength(200)
      ]
    ],

    orderIndex: [
      1,
      [
        Validators.required
      ]
    ]
  });

  get titleControl() {
    return this.form.controls.title;
  }

  get orderIndexControl() {
    return this.form.controls.orderIndex;
  }

  isInvalid(controlName: 'title' | 'orderIndex'): boolean {
    const control = this.form.controls[controlName];

    return control.invalid &&
      (control.touched || this.submitted());
  }

  isValid(controlName: 'title' | 'orderIndex'): boolean {
    const control = this.form.controls[controlName];

    return control.valid &&
      control.touched &&
      control.value !== '';
  }

  getTitleError(): string | null {
    const control = this.titleControl;

    if (!this.isInvalid('title')) {
      return null;
    }

    if (control.hasError('required')) {
      return 'اسم الوحدة مطلوب.';
    }

    if (control.hasError('maxlength')) {
      return 'اسم الوحدة يجب ألا يتجاوز 200 حرف.';
    }

    return 'البيانات المدخلة غير صحيحة.';
  }

  getOrderError(): string | null {
    const control = this.orderIndexControl;

    if (!this.isInvalid('orderIndex')) {
      return null;
    }

    if (control.hasError('required')) {
      return 'ترتيب الوحدة مطلوب.';
    }

    return 'ترتيب الوحدة غير صحيح.';
  }

  submit(): void {
    this.submitted.set(true);
    this.errorMsg.set(null);
    this.successMsg.set(null);

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    const body = {
      title: this.titleControl.value.trim(),
      orderIndex: this.orderIndexControl.value
    };

    this.moduleService.create(this.courseId, body).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMsg.set('تمت إضافة الوحدة بنجاح.');

        this.form.reset({
          title: '',
          orderIndex: 1
        });

        this.submitted.set(false);

        setTimeout(() => {
          this.saved.emit();
        }, 500);
      },

      error: (error) => {
        this.loading.set(false);

        this.errorMsg.set(
          this.extractErrorMessage(error)
        );
      }
    });
  }

  onCancel(): void {
    if (this.loading()) {
      return;
    }

    this.close.emit();
  }

  clearError(): void {
    this.errorMsg.set(null);
  }

  clearSuccess(): void {
    this.successMsg.set(null);
  }

  private extractErrorMessage(error: any): string {
    if (typeof error?.error === 'string') {
      return error.error;
    }

    if (error?.error?.errorMessage) {
      return error.error.errorMessage;
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.error?.title) {
      return error.error.title;
    }

    if (error?.message) {
      return error.message;
    }

    return 'حدث خطأ أثناء إضافة الوحدة. حاول مرة أخرى.';
  }
}