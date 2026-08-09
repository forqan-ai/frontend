import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import {
  FieldTree,
  FormField,
  form,
  maxLength,
  minLength,
  required,
  submit,
} from '@angular/forms/signals';
import { CircleJoinPolicy, CreateLearningCircleRequest } from '../../models/learning-circle.models';

type CircleTextField = 'name' | 'subject' | 'description';

const EMPTY_FORM_VALUE: CreateLearningCircleRequest = {
  name: '',
  subject: '',
  description: '',
  joinPolicy: CircleJoinPolicy.RequiresApproval,
};

@Component({
  selector: 'app-learning-circle-form',
  imports: [FormField],
  templateUrl: './learning-circle-form.component.html',
  styleUrl: './learning-circle-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningCircleFormComponent {
  readonly CircleJoinPolicy = CircleJoinPolicy;
  readonly initialValue =
    input<CreateLearningCircleRequest | null>(null);

  readonly submitting = input(false);
  readonly submitLabel = input('حفظ الحلقة');

  readonly formSubmitted =
    output<CreateLearningCircleRequest>();

  readonly cancelled = output<void>();

  private readonly formModel =
    signal<CreateLearningCircleRequest>({
      ...EMPTY_FORM_VALUE,
    });

  readonly circleForm = form(this.formModel, (circle) => {
    required(circle.name, {
      message: 'اسم الحلقة مطلوب.',
    });
    minLength(circle.name, 3, {
      message: 'اسم الحلقة يجب ألا يقل عن 3 أحرف.',
    });
    maxLength(circle.name, 150, {
      message: 'اسم الحلقة يجب ألا يزيد عن 150 حرفًا.',
    });

    required(circle.subject, {
      message: 'موضوع الحلقة مطلوب.',
    });
    minLength(circle.subject, 2, {
      message: 'موضوع الحلقة يجب ألا يقل عن حرفين.',
    });
    maxLength(circle.subject, 200, {
      message: 'موضوع الحلقة يجب ألا يزيد عن 200 حرف.',
    });

    required(circle.description, {
      message: 'وصف الحلقة مطلوب.',
    });
    minLength(circle.description, 10, {
      message: 'وصف الحلقة يجب ألا يقل عن 10 أحرف.',
    });
    maxLength(circle.description, 2000, {
      message: 'وصف الحلقة يجب ألا يزيد عن 2000 حرف.',
    });
  });

  constructor() {
    effect(() => {
      const initialValue = this.initialValue();

      untracked(() => {
        this.circleForm().reset(
          initialValue
            ? { ...initialValue }
            : { ...EMPTY_FORM_VALUE },
        );
      });
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.submitting()) {
      return;
    }

    this.normalizeTextValues();
    void submit(this.circleForm, {
      action: async () => {
        this.formSubmitted.emit({
          ...this.formModel(),
        });

        return undefined;
      },
    });
  }

  trimField(field: CircleTextField): void {
    this.formModel.update((value) => ({
      ...value,
      [field]: value[field].trim(),
    }));
  }

  setJoinPolicy(joinPolicy: CircleJoinPolicy): void {
    this.formModel.update((value) => ({ ...value, joinPolicy }));
  }

  showError(field: FieldTree<string>): boolean {
    return field().touched() && field().invalid();
  }

  validationMessage(field: FieldTree<string>): string {
    return field().errors()[0]?.message ??
      'تحقق من قيمة هذا الحقل.';
  }

  private normalizeTextValues(): void {
    this.formModel.update((value) => ({
      ...value,
      name: value.name.trim(),
      subject: value.subject.trim(),
      description: value.description.trim(),
    }));
  }
}
