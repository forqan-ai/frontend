import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ModuleService } from '../../../../../services/module.service';
import { ModuleModel } from '../../../../../models/module.model';

@Component({
  selector: 'app-edit-module-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-module-dialog.component.html',
})
export class EditModuleDialogComponent {
  private moduleService = inject(ModuleService);

  @Input({ required: true })
  module!: ModuleModel;

  @Input({ required: true })
  courseId!: string;

  @Output()
  saved = new EventEmitter<void>();

  title = '';

  orderIndex = 1;

  ngOnInit() {
    console.log('Course Id =', this.courseId);

    console.log('Module =', this.module);
    this.title = this.module.title;
    this.orderIndex = this.module.orderIndex;
  }

  save() {
    const body = {
      title: this.title,
      orderIndex: this.orderIndex,
    };

    this.moduleService.update(this.courseId, this.module.moduleID, body).subscribe({
      next: () => {
        alert('Module Updated Successfully');
        this.saved.emit();
      },

      error: (err) => {
        console.error(err);
        alert('Failed To Update Module');
      },
    });
  }
}
