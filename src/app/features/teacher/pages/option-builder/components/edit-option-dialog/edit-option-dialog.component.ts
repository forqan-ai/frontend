import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { OptionModel } from '../../../../models/option.model';
import { OptionService } from '../../../../services/option.service';

@Component({
  selector: 'app-edit-option-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-option-dialog.component.html',
  styleUrls: ['./edit-option-dialog.component.css'],
})
export class EditOptionDialogComponent {
  private readonly optionService = inject(OptionService);

  @Input({ required: true })
  option!: OptionModel;

  @Output()
  saved = new EventEmitter<void>();

  optionText = '';
  isCorrect = false;

  submitted = false;
  isSaving = false;

  ngOnInit(): void {
    this.optionText = this.option.optionText;
    this.isCorrect = this.option.isCorrect;
  }

  save(): void {
    this.submitted = true;

    this.optionText = this.optionText.trim();

    if (!this.optionText) {
      return;
    }

    this.isSaving = true;

    const body = {
      optionText: this.optionText,
      isCorrect: this.isCorrect,
    };

    this.optionService.update(this.option.optionID, body).subscribe({
      next: () => {
        this.isSaving = false;
        this.submitted = false;
        this.saved.emit();
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to update option:', err);
      },
    });
  }
}