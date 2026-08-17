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
import { ModuleModel } from '../../../../../models/module.model';

@Component({
  selector: 'app-edit-module-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-module-dialog.component.html',
  styleUrls: ['./edit-module-dialog.component.css']
})
export class EditModuleDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly moduleService = inject(ModuleService);

  @Input({ required: true })
  module!: ModuleModel;

  @Input({ required: true })
  courseId!: string;

  @Output()
  saved = new EventEmitter<void>();

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly successMsg = signal<string | null>(null);

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
        Validators.required,
        Validators.min(1)
      ]
    ]
  });

  ngOnInit(): void {
    this.form.patchValue({
      title: this.module.title,
      orderIndex: this.module.orderIndex
    });
  }

  get titleControl() {
    return this.form.controls.title;
  }

  get orderIndexControl() {
    return this.form.controls.orderIndex;
  }

  isInvalid(controlName: 'title' | 'orderIndex'): boolean {
    const control = this.form.controls[controlName];

    return control.invalid && (control.dirty || control.touched);
  }

  isValid(controlName: 'title' | 'orderIndex'): boolean {
    const control = this.form.controls[controlName];

    return control.valid && (control.dirty || control.touched);
  }

  submit(): void {
    this.errorMsg.set(null);
    this.successMsg.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const body = {
      title: this.titleControl.value.trim(),
      orderIndex: this.orderIndexControl.value
    };

    this.moduleService
      .update(
        this.courseId,
        this.module.moduleID,
        body
      )
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.successMsg.set('تم تحديث بيانات الوحدة بنجاح.');

          setTimeout(() => {
            this.saved.emit();
          }, 700);
        },

        error: (error) => {
          this.loading.set(false);

          this.errorMsg.set(
            error?.error?.errorMessage ||
            error?.error?.message ||
            error?.error ||
            'حدث خطأ أثناء تحديث الوحدة.'
          );
        }
      });
  }

  clearError(): void {
    this.errorMsg.set(null);
  }

  clearSuccess(): void {
    this.successMsg.set(null);
  }
}