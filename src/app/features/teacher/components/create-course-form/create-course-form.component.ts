import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-create-course-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-course-form.component.html',
  styleUrls: ['./create-course-form.component.css'],
})
export class CreateCourseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);

  @Output()
  save = new EventEmitter<FormData>();

  thumbnail: File | null = null;
  submitted = signal(false);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],

    subtitle: ['', [Validators.maxLength(150)]],

    description: ['', [Validators.required, Validators.minLength(10)]],

    categoryId: ['', Validators.required],

    level: [0, Validators.required],

    language: [0, Validators.required],

    price: [0, [Validators.required, Validators.min(0)]],

    thumbnail: this.fb.control<File | null>(null),
  });

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        this.categories.set(res);
      },
    });
  }

  onThumbnailSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      this.thumbnail = null;
      this.form.controls.thumbnail.setValue(null);
      this.form.controls.thumbnail.markAsTouched();
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.thumbnail = null;
      this.form.controls.thumbnail.setValue(null);
      this.form.controls.thumbnail.setErrors({
        invalidType: true,
      });
      this.form.controls.thumbnail.markAsTouched();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.thumbnail = null;
      this.form.controls.thumbnail.setValue(null);
      this.form.controls.thumbnail.setErrors({
        maxSize: true,
      });
      this.form.controls.thumbnail.markAsTouched();
      return;
    }

    this.thumbnail = file;

    this.form.controls.thumbnail.setValue(file);
    this.form.controls.thumbnail.setErrors(null);
    this.form.controls.thumbnail.markAsTouched();
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);

    return !!control?.invalid && (
      control.touched || this.submitted()
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);

    if (!control?.errors) {
      return '';
    }

    if (control.errors['required']) {
      switch (controlName) {
        case 'title':
          return 'عنوان الدورة مطلوب';

        case 'description':
          return 'وصف الدورة مطلوب';

        case 'categoryId':
          return 'يرجى اختيار التصنيف';

        case 'price':
          return 'السعر مطلوب';

        default:
          return 'هذا الحقل مطلوب';
      }
    }

    if (control.errors['minlength']) {
      return `يجب أن يحتوي الحقل على ${control.errors['minlength'].requiredLength} أحرف على الأقل`;
    }

    if (control.errors['maxlength']) {
      return `يجب ألا يتجاوز الحقل ${control.errors['maxlength'].requiredLength} حرف`;
    }

    if (control.errors['min']) {
      return 'السعر لا يمكن أن يكون أقل من صفر';
    }

    if (control.errors['invalidType']) {
      return 'يرجى اختيار صورة صحيحة';
    }

    if (control.errors['maxSize']) {
      return 'حجم الصورة يجب ألا يتجاوز 5 MB';
    }

    return 'قيمة غير صحيحة';
  }

  submit() {
    this.submitted.set(true);

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const formData = new FormData();

    formData.append('Title', this.form.value.title!);

    formData.append(
      'Subtitle',
      this.form.value.subtitle ?? ''
    );

    formData.append(
      'Description',
      this.form.value.description ?? ''
    );

    formData.append(
      'CategoryID',
      this.form.value.categoryId!
    );

    formData.append(
      'Level',
      this.form.value.level!.toString()
    );

    formData.append(
      'LevelAr',
      this.form.value.level!.toString()
    );

    formData.append(
      'Language',
      this.form.value.language!.toString()
    );

    formData.append(
      'LanguageAr',
      this.form.value.language!.toString()
    );

    formData.append(
      'Price',
      this.form.value.price!.toString()
    );

    if (this.thumbnail) {
      formData.append(
        'Thumbnail',
        this.thumbnail
      );
    }

    this.save.emit(formData);
  }
}