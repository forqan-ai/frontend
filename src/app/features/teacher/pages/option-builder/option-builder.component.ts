import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OptionService } from '../../services/option.service';
import { OptionModel } from '../../models/option.model';

import { AddOptionDialogComponent } from './components/add-option-dialog/add-option-dialog.component';
import { OptionCardComponent } from './components/option-card/option-card.component';

@Component({
  selector: 'app-option-builder',
  standalone: true,
  imports: [
    AddOptionDialogComponent,
    OptionCardComponent,
  ],
  templateUrl: './option-builder.component.html',
  styleUrls: ['./option-builder.component.css'],
})
export class OptionBuilderComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly optionService = inject(OptionService);

  quizId = '';
  questionId = '';

  showAddOption = signal(false);
  options = signal<OptionModel[]>([]);

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('quizId') ?? '';
    this.questionId =
      this.route.snapshot.paramMap.get('questionId') ?? '';

    this.loadOptions();
  }

  loadOptions(): void {
    if (!this.questionId) {
      return;
    }

    this.optionService.getOptions(this.questionId).subscribe({
      next: (res) => {
        this.options.set(res);
      },
      error: (err) => {
        console.error('Failed to load options:', err);
      },
    });
  }

  toggleAddOption(): void {
    this.showAddOption.update((value) => !value);
  }
}