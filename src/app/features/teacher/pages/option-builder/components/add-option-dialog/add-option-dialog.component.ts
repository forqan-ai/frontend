import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { OptionService } from '../../../../services/option.service';

@Component({
  selector: 'app-add-option-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-option-dialog.component.html',
  styleUrls: ['./add-option-dialog.component.css'],
})
export class AddOptionDialogComponent {
  private readonly optionService = inject(OptionService);

  @Input({ required: true })
  questionId!: string;

  @Output()
  saved = new EventEmitter<void>();

  optionText = '';

  isCorrect = false;

  submitted = false;

  save(): void {
    this.submitted = true;

    this.optionText = this.optionText.trim();

    if (!this.optionText) {
      return;
    }

    const body = {
      optionText: this.optionText,
      isCorrect: this.isCorrect,
    };

    this.optionService.create(this.questionId, body).subscribe({
      next: () => {
        this.saved.emit();

        this.optionText = '';
        this.isCorrect = false;
        this.submitted = false;
      },
      error: (err) => {
        console.error('Failed to create option:', err);
      },
    });
  }
}