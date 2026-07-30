import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  FieldTree,
  FormField,
  form,
  maxLength,
  readonly as readonlyField,
  submit,
  validate,
} from '@angular/forms/signals';
import { CreateCirclePostRequest } from '../../models/circle-post.models';

interface CirclePostFormModel {
  content: string;
}

@Component({
  selector: 'app-circle-post-form',
  imports: [FormField],
  templateUrl: './circle-post-form.component.html',
  styleUrl: './circle-post-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePostFormComponent implements OnDestroy {
  private readonly maxImageSize = 5 * 1024 * 1024;
  private readonly allowedImageTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
  ]);

  readonly initialContent = input('');
  readonly resetVersion = input(0);
  readonly submitting = input(false);
  readonly disabled = input(false);
  readonly submitLabel = input('نشر');
  readonly submittingLabel = input('جارٍ النشر...');
  readonly placeholder = input(
    'شارك أعضاء الحلقة فكرة أو معلومة مفيدة...',
  );
  readonly fieldId = input('circle-post-content');
  readonly showCancel = input(false);
  readonly preventUnchanged = input(false);
  readonly allowImage = input(false);

  readonly formSubmitted = output<string>();
  readonly createFormSubmitted =
    output<CreateCirclePostRequest>();
  readonly cancelled = output<void>();

  readonly selectedImage = signal<File | null>(null);
  readonly imagePreviewUrl = signal<string | null>(null);
  readonly imageError = signal<string | null>(null);
  readonly imageInput =
    viewChild<ElementRef<HTMLInputElement>>('imageInput');

  private readonly formModel =
    signal<CirclePostFormModel>({ content: '' });

  readonly postForm = form(this.formModel, (model) => {
    readonlyField(model.content, {
      when: () => this.submitting() || this.disabled(),
    });

    validate(model.content, ({ value }) => {
      const content = value().trim();

      if (!content) {
        return {
          kind: 'content-required',
          message: 'محتوى المنشور مطلوب.',
        };
      }

      if (
        this.preventUnchanged() &&
        content === this.initialContent().trim()
      ) {
        return {
          kind: 'content-unchanged',
          message: 'عدّل المحتوى قبل الحفظ.',
        };
      }

      return undefined;
    });

    maxLength(model.content, 5000, {
      message: 'محتوى المنشور يجب ألا يزيد عن 5000 حرف.',
    });
  });

  constructor() {
    effect(() => {
      const initialContent = this.initialContent();
      this.resetVersion();

      untracked(() => {
        this.postForm().reset({ content: initialContent });
        this.clearSelectedImage();
      });
    });
  }

  ngOnDestroy(): void {
    this.revokePreviewUrl();
  }

  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const image = inputElement.files?.[0] ?? null;

    this.clearSelectedImage();

    if (!image) {
      return;
    }

    if (!this.allowedImageTypes.has(image.type)) {
      this.imageError.set(
        'يُسمح فقط بصور JPEG وPNG وWebP.',
      );
      return;
    }

    if (image.size > this.maxImageSize) {
      this.imageError.set(
        'يجب ألا يزيد حجم الصورة عن 5 ميجابايت.',
      );
      return;
    }

    this.selectedImage.set(image);
    this.imagePreviewUrl.set(URL.createObjectURL(image));
  }

  removeImage(): void {
    this.clearSelectedImage();
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.submitting() || this.disabled()) {
      return;
    }

    this.formModel.update((value) => ({
      ...value,
      content: value.content.trim(),
    }));

    void submit(this.postForm, {
      action: async () => {
        const content = this.formModel().content;

        if (this.allowImage()) {
          this.createFormSubmitted.emit({
            content,
            image: this.selectedImage(),
          });
        } else {
          this.formSubmitted.emit(content);
        }

        return undefined;
      },
    });
  }

  showError(field: FieldTree<string>): boolean {
    return field().touched() && field().invalid();
  }

  validationMessage(field: FieldTree<string>): string {
    return field().errors()[0]?.message ??
      'تحقق من محتوى المنشور.';
  }

  private clearSelectedImage(): void {
    this.revokePreviewUrl();
    this.selectedImage.set(null);
    this.imageError.set(null);

    const inputElement = this.imageInput()?.nativeElement;

    if (inputElement) {
      inputElement.value = '';
    }
  }

  private revokePreviewUrl(): void {
    const previewUrl = this.imagePreviewUrl();

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      this.imagePreviewUrl.set(null);
    }
  }
}
