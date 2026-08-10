import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlacementService } from '../../services/placement.service';
import {
  PlacementQuestion,
  PlacementAnswerDto,
} from '../../models/placement.models';

@Component({
  selector: 'app-placement-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placement-quiz.component.html',
  styleUrls: ['./placement-quiz.component.css'],
})
export class PlacementQuizComponent implements OnInit {
  questions: PlacementQuestion[] = [];
  currentIndex = 0;
  answers: Map<string, string> = new Map();
  loading = true;
  submitting = false;
  error = '';

  constructor(private placementService: PlacementService, private router: Router,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.placementService.getQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'حدث خطأ في تحميل الأسئلة';
        this.loading = false;
      },
    });
  }

  get currentQuestion(): PlacementQuestion {
    return this.questions[this.currentIndex];
  }

  get progress(): number {
    return Math.round(((this.currentIndex + 1) / this.questions.length) * 100);
  }

  get isAnswered(): boolean {
    return this.answers.has(this.currentQuestion?.questionID);
  }

  get selectedOption(): string | undefined {
    return this.answers.get(this.currentQuestion?.questionID);
  }

  selectOption(optionId: string): void {
    this.answers.set(this.currentQuestion.questionID, optionId);
  }

  next(): void {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  submit(): void {
    this.submitting = true;
    const answersDto: PlacementAnswerDto[] = Array.from(this.answers.entries()).map(
      ([questionID, selectedOptionID]) => ({ questionID, selectedOptionID })
    );

    this.placementService.submitTest({ answers: answersDto }).subscribe({
      next: (result) => {
        localStorage.setItem('placementResult', JSON.stringify(result));
        this.router.navigate(['/dashboard/student/placement-test/result']);
      },
      error: () => {
        this.error = 'حدث خطأ أثناء إرسال الاختبار';
        this.submitting = false;
      },
    });
  }
}
