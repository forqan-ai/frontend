import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { OptionService } from '../../../../services/option.service';

@Component({
  selector: 'app-add-option-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-option-dialog.component.html',
})
export class AddOptionDialogComponent {
  private optionService = inject(OptionService);

  @Input({ required: true })
  questionId!: string;

  @Output()
  saved = new EventEmitter<void>();

  optionText = '';

  isCorrect = false;

  save() {
    const body = {
      optionText: this.optionText,

      isCorrect: this.isCorrect,
    };

    this.optionService.create(this.questionId, body).subscribe({
      next: () => {
        this.saved.emit();

        this.optionText = '';

        this.isCorrect = false;
      },
    });
  }
}
