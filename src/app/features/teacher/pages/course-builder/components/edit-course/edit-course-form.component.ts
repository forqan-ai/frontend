import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
  signal
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category.model';

import { environment } from '../../../../../../../environments/environment';


@Component({
  selector: 'app-edit-course-form',

  standalone: true,

  imports: [
    ReactiveFormsModule
  ],

  templateUrl: './edit-course-form.component.html',

  styleUrl: './edit-course-form.component.css'
})
export class EditCourseFormComponent
  implements OnInit, OnDestroy {

  @Input()
  courseId!: string;

  @Input()
  currentThumbnail: string | null = null;

  @Output()
  close = new EventEmitter<void>();

  @Output()
  saved = new EventEmitter<void>();


  private readonly fb = inject(FormBuilder);

  private readonly http = inject(HttpClient);

  private readonly categoryService =
    inject(CategoryService);


  private readonly baseUrl =
    `${environment.apiUrl}/api/courses`;


  categories =
    signal<Category[]>([]);


  loading =
    signal(false);


  errorMsg =
    signal<string | null>(null);


  successMsg =
    signal<string | null>(null);


  previewUrl =
    signal<string | null>(null);


  private thumbnailFile:
    File | null = null;


  private objectUrl:
    string | null = null;


  form =
    this.fb.nonNullable.group({

      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ],

      subtitle: [
        '',
        [
          Validators.maxLength(300)
        ]
      ],

      description: [
        ''
      ],

      categoryId: [
        '',
        [
          Validators.required
        ]
      ],

      level: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(2)
        ]
      ],

      language: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(1)
        ]
      ],

      price: [
        0,
        [
          Validators.min(0)
        ]
      ]

    });


  ngOnInit(): void {

    this.loadCategories();

    this.loadCourse();

  }


  private loadCategories(): void {

    this.categoryService
      .getCategories()
      .subscribe({

        next: (response: Category[]) => {

          this.categories.set(response);

        },

        error: () => {

          this.errorMsg.set(
            'تعذر تحميل فئات الكورس.'
          );

        }

      });

  }


  private loadCourse(): void {

    if (!this.courseId) {

      this.errorMsg.set(
        'معرّف الكورس غير موجود.'
      );

      return;

    }


    this.loading.set(true);


    this.http
      .get<any>(
        `${this.baseUrl}/${this.courseId}`
      )
      .subscribe({

        next: (course) => {

          this.form.patchValue({

            title:
              course.title ?? '',

            subtitle:
              course.subtitle ?? '',

            description:
              course.description ?? '',

            categoryId:
              course.categoryID ??
              course.categoryId ??
              '',

            level:
              this.normalizeNumber(
                course.level,
                0
              ),

            language:
              this.normalizeNumber(
                course.language,
                0
              ),

            price:
              this.normalizeNumber(
                course.price,
                0
              )

          });


          if (course.thumbnailURL) {

            this.currentThumbnail =
              course.thumbnailURL;

          }


          this.loading.set(false);

        },

        error: () => {

          this.loading.set(false);

          this.errorMsg.set(
            'تعذر تحميل بيانات الكورس.'
          );

        }

      });

  }


  private normalizeNumber(
    value: unknown,
    fallback: number
  ): number {

    const parsed =
      Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : fallback;

  }


  getControl(
    controlName: string
  ): AbstractControl | null {

    return this.form.get(
      controlName
    );

  }


  isInvalid(
    controlName: string
  ): boolean {

    const control =
      this.getControl(controlName);

    return !!(
      control &&
      control.invalid &&
      (
        control.touched ||
        control.dirty
      )
    );

  }


  isValid(
    controlName: string
  ): boolean {

    const control =
      this.getControl(controlName);

    if (!control) {
      return false;
    }


    const value =
      control.value;


    return !!(
      control.valid &&
      (
        control.touched ||
        control.dirty
      ) &&
      value !== '' &&
      value !== null
    );

  }


  onThumbnailSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    if (!input.files?.length) {
      return;
    }


    const file =
      input.files[0];


    this.errorMsg.set(null);


    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];


    if (!allowedTypes.includes(file.type)) {

      this.errorMsg.set(
        'صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WEBP.'
      );

      input.value = '';

      return;

    }


    const maxSize =
      5 * 1024 * 1024;


    if (file.size > maxSize) {

      this.errorMsg.set(
        'حجم الصورة يجب ألا يتجاوز 5 ميجابايت.'
      );

      input.value = '';

      return;

    }


    this.thumbnailFile =
      file;


    if (this.objectUrl) {

      URL.revokeObjectURL(
        this.objectUrl
      );

    }


    this.objectUrl =
      URL.createObjectURL(file);


    this.previewUrl.set(
      this.objectUrl
    );

  }


  submit(): void {

    this.errorMsg.set(null);

    this.successMsg.set(null);


    if (this.form.invalid) {

      this.markFormAsTouched();

      this.errorMsg.set(
        'من فضلك راجع البيانات المطلوبة قبل حفظ التغييرات.'
      );

      return;

    }


    this.loading.set(true);


    const value =
      this.form.getRawValue();


    const formData =
      new FormData();


    formData.append(
      'Title',
      value.title.trim()
    );


    formData.append(
      'Subtitle',
      value.subtitle.trim()
    );


    formData.append(
      'Description',
      value.description.trim()
    );


    formData.append(
      'CategoryID',
      value.categoryId
    );


    formData.append(
      'Level',
      String(value.level)
    );


    formData.append(
      'Language',
      String(value.language)
    );


    formData.append(
      'Price',
      String(value.price)
    );


    if (this.thumbnailFile) {

      formData.append(
        'Thumbnail',
        this.thumbnailFile,
        this.thumbnailFile.name
      );

    }


    this.http
      .put(
        `${this.baseUrl}/${this.courseId}`,
        formData
      )
      .subscribe({

        next: () => {

          this.loading.set(false);

          this.successMsg.set(
            'تم حفظ التغييرات بنجاح.'
          );

          this.saved.emit();

        },

        error: (error) => {

          this.loading.set(false);

          this.errorMsg.set(
            this.extractErrorMessage(error)
          );

        }

      });

  }


  private markFormAsTouched(): void {

    Object.values(
      this.form.controls
    ).forEach(control => {

      control.markAsTouched();

      control.markAsDirty();

    });

  }


  private extractErrorMessage(
    error: any
  ): string {

    if (
      typeof error?.error === 'string' &&
      error.error.trim()
    ) {

      return error.error;

    }


    if (
      typeof error?.error?.message === 'string'
    ) {

      return error.error.message;

    }


    if (
      typeof error?.error?.title === 'string'
    ) {

      return error.error.title;

    }


    if (error?.error?.errors) {

      const validationErrors =
        error.error.errors;


      const messages =
        Object.values(
          validationErrors
        )
        .flat()
        .filter(
          (message): message is string =>
            typeof message === 'string'
        );


      if (messages.length > 0) {

        return messages.join(' ');

      }

    }


    return 'حدث خطأ أثناء حفظ بيانات الكورس. حاول مرة أخرى.';

  }


  clearError(): void {

    this.errorMsg.set(null);

  }


  clearSuccess(): void {

    this.successMsg.set(null);

  }


  ngOnDestroy(): void {

    if (this.objectUrl) {

      URL.revokeObjectURL(
        this.objectUrl
      );

    }

  }

}