import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  save = new EventEmitter<any>();

  thumbnail!: File;
  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        this.categories.set(res);
      },
    });
  }
  form = this.fb.group({
    title: ['', Validators.required],

    subtitle: [''],

    description: ['', Validators.required],

    categoryId: ['', Validators.required],

    level: [0, Validators.required],

    language: [0, Validators.required],

    price: [0],

    thumbnail: [null],
  });

  onThumbnailSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.thumbnail = input.files[0];
  }

  submit() {
    if (this.form.invalid) return;

    const formData = new FormData();

    formData.append('Title', this.form.value.title!);

    formData.append('Subtitle', this.form.value.subtitle ?? '');

    formData.append('Description', this.form.value.description ?? '');

    formData.append('CategoryID', this.form.value.categoryId!);

    formData.append('Level', this.form.value.level!.toString());

    // هنضيفها مؤقتًا بنفس القيمة
    formData.append('LevelAr', this.form.value.level!.toString());

    formData.append('Language', this.form.value.language!.toString());

    // هنضيفها مؤقتًا بنفس القيمة
    formData.append('LanguageAr', this.form.value.language!.toString());

    formData.append('Price', this.form.value.price!.toString());

    if (this.thumbnail) {
      formData.append('Thumbnail', this.thumbnail);
    }

    this.save.emit(formData);
  }
}
