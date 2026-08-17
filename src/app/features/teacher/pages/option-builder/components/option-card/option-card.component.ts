import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';

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

  private readonly optionService = inject(OptionService);

  showEdit = signal(false);

  showDeleteConfirm = signal(false);

  isDeleting = signal(false);

  toggleEdit(): void {
    this.showEdit.update((value) => !value);
  }

  openDeleteConfirm(): void {
    if (this.isDeleting()) {
      return;
    }

    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    if (this.isDeleting()) {
      return;
    }

    this.showDeleteConfirm.set(false);
  }

  deleteOption(): void {
    if (this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);

    this.optionService.delete(this.option.optionID).subscribe({
      next: () => {
        this.isDeleting.set(false);

        this.showDeleteConfirm.set(false);

        this.refresh.emit();
      },

      error: (err) => {
        this.isDeleting.set(false);

        console.error('Failed to delete option:', err);
      },
    });
  }
}