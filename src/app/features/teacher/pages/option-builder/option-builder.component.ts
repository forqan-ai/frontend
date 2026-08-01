import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OptionService } from '../../services/option.service';
import { OptionModel } from '../../models/option.model';

import { AddOptionDialogComponent } from './components/add-option-dialog/add-option-dialog.component';
import { OptionCardComponent } from './components/option-card/option-card.component';

@Component({
  selector: 'app-option-builder',
  standalone: true,
  imports: [AddOptionDialogComponent, OptionCardComponent],
  templateUrl: './option-builder.component.html',
  styleUrls: ['./option-builder.component.css'],
})
export class OptionBuilderComponent {
  private route = inject(ActivatedRoute);

  private optionService = inject(OptionService);

  quizId = '';

  questionId = '';

  showAddOption = signal(false);

  options = signal<OptionModel[]>([]);

  ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('quizId')!;

    this.questionId = this.route.snapshot.paramMap.get('questionId')!;

    this.loadOptions();
  }

  loadOptions() {
    this.optionService.getOptions(this.questionId).subscribe({
      next: (res) => {
        this.options.set(res);
      },
    });
  }

  toggleAddOption() {
    this.showAddOption.update((v) => !v);
  }
}
