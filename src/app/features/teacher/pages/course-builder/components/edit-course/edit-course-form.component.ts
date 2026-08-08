import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category.model';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-edit-course-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="card shadow-sm p-4 mb-4 border-0" style="background:#f8f9fa;">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0"> تعديل بيانات الكورس</h5>
        <button class="btn btn-sm btn-outline-secondary" (click)="close.emit()">✕ إغلاق</button>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">العنوان *</label>
            <input class="form-control" formControlName="title" />
          </div>
          <div class="col-md-6">
            <label class="form-label">العنوان الفرعي</label>
            <input class="form-control" formControlName="subtitle" />
          </div>
          <div class="col-12">
            <label class="form-label">الوصف *</label>
            <textarea class="form-control" rows="3" formControlName="description"></textarea>
          </div>
          <div class="col-md-4">
            <label class="form-label">الفئة</label>
            <select class="form-select" formControlName="categoryId">
              @for (cat of categories(); track cat.categoryID) {
                <option [value]="cat.categoryID">{{ cat.name }}</option>
              }
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">المستوى</label>
            <select class="form-select" formControlName="level">
              <option [value]="0">مبتدئ</option>
              <option [value]="1">متوسط</option>
              <option [value]="2">متقدم</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">السعر</label>
            <input type="number" class="form-control" formControlName="price" />
          </div>
          <div class="col-12">
            <label class="form-label">صورة الكورس (Thumbnail)</label>
            <input type="file" class="form-control" accept="image/*" (change)="onThumbnailSelected($event)" />
            @if (currentThumbnail) {
              <div class="mt-2">
                <small class="text-muted">الصورة الحالية:</small>
                <img [src]="currentThumbnail" height="80" class="d-block mt-1 rounded" />
              </div>
            }
            @if (previewUrl()) {
              <div class="mt-2">
                <small class="text-success">الصورة الجديدة:</small>
                <img [src]="previewUrl()" height="80" class="d-block mt-1 rounded" />
              </div>
            }
          </div>

          @if (errorMsg()) {
            <div class="col-12">
              <div class="alert alert-danger py-2"> {{ errorMsg() }}</div>
            </div>
          }
          @if (successMsg()) {
            <div class="col-12">
              <div class="alert alert-success py-2">{{ successMsg() }}</div>
            </div>
          }

          <div class="col-12">
            <button class="btn btn-primary" type="submit" [disabled]="loading()">
              @if (loading()) { جاري الحفظ... } @else { حفظ التغييرات }
            </button>
          </div>
        </div>
      </form>
    </div>
  `
})
export class EditCourseFormComponent implements OnInit {
  @Input() courseId!: string;
  @Input() currentThumbnail: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  loading = signal(false);
  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);
  previewUrl = signal<string | null>(null);

  private thumbnailFile: File | null = null;
  private baseUrl = `${environment.apiUrl}/api/courses`;

  form = this.fb.group({
    title: ['', Validators.required],
    subtitle: [''],
    description: [''],
    categoryId: [''],
    level: [0],
    language: [0],
    price: [0],
  });

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (res: any) => this.categories.set(res),
    });

    this.http.get<any>(`${this.baseUrl}/${this.courseId}`).subscribe({
      next: (course) => {
        this.form.patchValue({
          title: course.title,
          subtitle: course.subtitle,
          description: course.description,
          categoryId: course.categoryID,
          level: course.level,
          language: course.language ?? 0,
          price: course.price,
        });
      },
    });
  }

  onThumbnailSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.thumbnailFile = input.files[0];
    this.previewUrl.set(URL.createObjectURL(this.thumbnailFile));
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMsg.set(null);
    this.successMsg.set(null);

    const formData = new FormData();
    formData.append('Title', this.form.value.title!);
    formData.append('Subtitle', this.form.value.subtitle ?? '');
    formData.append('Description', this.form.value.description ?? '');
    formData.append('CategoryID', this.form.value.categoryId ?? '');
    formData.append('Level', this.form.value.level!.toString());
    formData.append('Language', this.form.value.language!.toString());
    formData.append('Price', this.form.value.price!.toString());

    if (this.thumbnailFile) {
      formData.append('Thumbnail', this.thumbnailFile);
    }

    this.http.put(`${this.baseUrl}/${this.courseId}`, formData).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMsg.set('تم حفظ التغييرات بنجاح!');
        this.saved.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err?.error || 'حدث خطأ أثناء الحفظ');
      },
    });
  }
}
