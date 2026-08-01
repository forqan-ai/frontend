
import { Component, inject, injectAsync, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { CourseRecommendation } from '../../models/CourseRecommendation';
import { CourseDifficulty } from '../../models/CourseDifficulty';
import { RatingService } from '../../services/rating.service';
import { RatingRequestDto } from '../../models/RatingRequestDto';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';


@Component({
  selector: 'app-student-feedback',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './student-feedback.component.html',
  styleUrl: './student-feedback.component.css'
})
export class StudentFeedbackComponent {

  CourseRecommendation = CourseRecommendation;
  CourseDifficulty = CourseDifficulty;
  readonly isLoading = signal(false);
  readonly errorMsg = signal('');

  ratingService = inject(RatingService);
  userService = inject(AuthService);
  toastService = inject(ToastService);


  hoveredInstructorStar = signal(0);

  setHoveredInstructorStar(star: number): void {
    this.hoveredInstructorStar.set(star);
  }

  clearHoveredInstructorStar(): void {
    this.hoveredInstructorStar.set(0);
  }


  hoveredCourseStar = signal(0);

  sethoveredCourseStar(star: number): void {
    this.hoveredCourseStar.set(star);
  }

  clearhoveredCourseStar(): void {
    this.hoveredCourseStar.set(0);
  }

  feedbackForm = new FormGroup({

    courseRating: new FormControl<number>(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),

    teacherRating: new FormControl<number>(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),



    review: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(500)
      ]
    }),

    recommend: new FormControl<CourseRecommendation | null>(null, {
      validators: [Validators.required]
    }),

    difficulty: new FormControl<CourseDifficulty | null>(null, {
      validators: [Validators.required]
    }),

    additionalRecommendations: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)]
    })
  });


  setCourseRating(rating: number): void {
    this.feedbackForm.patchValue({ courseRating: rating });
    this.feedbackForm.controls.courseRating.markAsTouched();
  }

  setInstructorRating(rating: number): void {
    this.feedbackForm.patchValue({ teacherRating: rating });
    this.feedbackForm.controls.teacherRating.markAsTouched();
  }

  getValidationMessage(control: any): string {
    if (!control.touched || !control.errors)
      return '';
    if (control.errors['required'])
      return 'هذا الحقل مطلوب';
    if (control.errors['min'])
      return 'الرجاء اختيار تقييم';
    if (control.errors['minlength'])
      return `يجب كتابة ${control.errors['minlength'].requiredLength} حرفاً على الأقل`;
    if (control.errors['maxlength'])
      return `الحد الأقصى ${control.errors['maxlength'].requiredLength} حرف`;
    return 'قيمة غير صحيحة';
  }

  onSubmit(): void {

    this.feedbackForm.markAllAsTouched();

    if (this.feedbackForm.invalid)
      return;

    this.errorMsg.set('');
    this.isLoading.set(true);

    const ratingRequest: RatingRequestDto = {
      courseId: '25BB28EF-EF98-4F92-90CC-08DEDEC1C01D',
      teacherId: '40F4CB0C-0E06-4BBE-8DB6-FE711F16EBCC',
      userId: this.userService.getUserId()!,
      courseRating: this.feedbackForm.value.courseRating!,
      teacherRating: this.feedbackForm.value.teacherRating!,
      difficulty: this.feedbackForm.value.difficulty!,
      recommendation: this.feedbackForm.value.recommend!,
      additionalRecommendations: this.feedbackForm.value.additionalRecommendations!,
      feedback: this.feedbackForm.value.review!
    }
    // TODO:
    // Replace with your API call

    console.log(this.feedbackForm.getRawValue());

    this.ratingService.SubmitRating(ratingRequest).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.show('شكراً لك، تم إرسال تقييمك بنجاح.');
        this.feedbackForm.reset({
          courseRating: 0,
          teacherRating: 0,
          review: '',
          recommend: undefined,
          difficulty: undefined,
          additionalRecommendations: ''
        })
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.show('حدث خطاء, حاول مرة اخري', 'error');
        console.log(err);
      }
    })

  }
}

