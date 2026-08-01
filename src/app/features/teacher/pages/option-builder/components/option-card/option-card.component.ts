import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';

import { OptionModel } from '../../../../models/option.model';
import { OptionService } from '../../../../services/option.service';

import { EditOptionDialogComponent } from '../edit-option-dialog/edit-option-dialog.component';

@Component({
  selector: 'app-option-card',
  standalone: true,
  imports: [EditOptionDialogComponent],
  templateUrl: './option-card.component.html',
  styleUrls: ['./option-card.component.css'],
})
export class OptionCardComponent {
  @Input({ required: true })
  option!: OptionModel;

  @Output()
  refresh = new EventEmitter<void>();

  private optionService = inject(OptionService);

  showEdit = signal(false);

  toggleEdit() {
    this.showEdit.update((v) => !v);
  }

  deleteOption() {
    if (!confirm('Delete this option?')) return;

    this.optionService.delete(this.option.optionID).subscribe({
      next: () => {
        this.refresh.emit();
      },
    });
  }
}
