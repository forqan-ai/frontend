import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { Specialty } from '../../models/specialty.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-specialties-card',
  standalone: true,
  imports: [FormsModule, NgSelectModule],
  templateUrl: './specialties-card.component.html',
  styleUrl: './specialties-card.component.css',
})
export class SpecialtiesCardComponent {

  private toast = inject(ToastService);


  specialties = input<Specialty[]>([]);

  selectedIds = input<string[]>([]);
  teacherSpecialties = input<string[]>([]);
  save = output<string[]>();

  selected = signal<string[]>([]);

  constructor() {
    effect(() => {
    this.selected.set([...this.selectedIds()]);
  });
  }

  saveChanges() {
   this.toast.show('تم تحديث التخصصات بنجاح');
    this.save.emit(this.selected());
  }
}
