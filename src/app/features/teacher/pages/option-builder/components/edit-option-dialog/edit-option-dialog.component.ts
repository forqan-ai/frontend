import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { OptionModel } from '../../../../models/option.model';
import { OptionService } from '../../../../services/option.service';

@Component({
  selector: 'app-edit-option-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-option-dialog.component.html',
})
export class EditOptionDialogComponent {
  private optionService = inject(OptionService);

  @Input({ required: true })
  option!: OptionModel;

  @Output()
  saved = new EventEmitter<void>();

  optionText = '';

  isCorrect = false;

  ngOnInit() {
    this.optionText = this.option.optionText;

    this.isCorrect = this.option.isCorrect;
  }

  save() {
    const body = {
      optionText: this.optionText,

      isCorrect: this.isCorrect,
    };

    this.optionService.update(this.option.optionID, body).subscribe({
      next: () => {
        this.saved.emit();
      },
    });
  }
}
