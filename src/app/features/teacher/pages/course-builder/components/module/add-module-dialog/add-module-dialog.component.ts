import { Component, EventEmitter, Output, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModuleService } from '../../../../../services/module.service';

@Component({
  selector: 'app-add-module-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-module-dialog.component.html',
})
export class AddModuleDialogComponent {
  @Input({ required: true })
  courseId!: string;

  @Output()
  saved = new EventEmitter<void>();

  private moduleService = inject(ModuleService);

  title = '';

  orderIndex = 1;

  save() {
    const body = {
      title: this.title,

      orderIndex: this.orderIndex,
    };

    this.moduleService.create(this.courseId, body).subscribe({
      next: () => {
        this.saved.emit();

        this.title = '';

        this.orderIndex = 1;
      },
    });
  }
}
