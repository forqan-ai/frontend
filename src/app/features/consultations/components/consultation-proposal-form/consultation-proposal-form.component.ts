import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ConsultationDetails, ConsultationProposalRequest } from '../../models/consultation.models';

@Component({
  selector: 'app-consultation-proposal-form',
  imports: [ReactiveFormsModule],
  templateUrl: './consultation-proposal-form.component.html',
  styleUrl: './consultation-proposal-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultationProposalFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly consultation = input.required<ConsultationDetails>();
  readonly submitting = input(false);
  readonly submitted = output<ConsultationProposalRequest>();
  readonly slotsError = signal('');

  readonly form = this.fb.nonNullable.group({
    teacherResponseText: ['', [Validators.required, Validators.maxLength(2000), this.nonWhitespace]],
    pointsPrice: [1, [Validators.required, Validators.min(1), Validators.max(1_000_000)]],
    durationMinutes: [30, [Validators.required, Validators.min(1), Validators.max(1440)]],
    startTimes: this.fb.array<FormControl<string>>([]),
  });

  constructor() {
    effect(() => this.populate(this.consultation()));
  }

  get startTimes() {
    return this.form.controls.startTimes;
  }

  addSlot(value = ''): void {
    if (this.startTimes.length >= 100) return;
    this.startTimes.push(this.fb.nonNullable.control(value, Validators.required));
    this.slotsError.set('');
  }

  removeSlot(index: number): void {
    if (this.startTimes.length === 1) {
      this.startTimes.at(0).setValue('');
      this.startTimes.at(0).markAsTouched();
      return;
    }
    this.startTimes.removeAt(index);
    this.slotsError.set('');
  }

  submit(): void {
    this.form.markAllAsTouched();
    const startTimes = this.startTimes.controls.map((control) => this.toUtc(control.value));
    const threshold = Math.max(Date.now(), new Date(this.consultation().serverNowUtc).getTime());

    if (startTimes.some((value) => value === null)) {
      this.slotsError.set('أدخل تاريخًا ووقتًا صحيحين لكل موعد.');
      return;
    }

    const validStartTimes = startTimes as string[];
    const timestamps = validStartTimes.map((value) => new Date(value).getTime());
    if (timestamps.some((value) => value <= threshold)) {
      this.slotsError.set('يجب أن تكون جميع المواعيد في المستقبل.');
      return;
    }
    if (new Set(timestamps).size !== timestamps.length) {
      this.slotsError.set('لا يمكن تكرار الموعد نفسه.');
      return;
    }
    if (this.form.invalid || validStartTimes.length === 0) {
      if (validStartTimes.length === 0) this.slotsError.set('أضف موعدًا واحدًا على الأقل.');
      return;
    }

    const value = this.form.getRawValue();
    this.slotsError.set('');
    this.submitted.emit({
      teacherResponseText: value.teacherResponseText.trim(),
      pointsPrice: value.pointsPrice,
      durationMinutes: value.durationMinutes,
      startTimes: validStartTimes,
      rowVersion: this.consultation().rowVersion,
    });
  }

  minimumLocalDateTime(): string {
    return this.toLocalInput(new Date(Date.now() + 60_000).toISOString());
  }

  private populate(consultation: ConsultationDetails): void {
    this.form.controls.teacherResponseText.setValue(consultation.teacherResponseText ?? '');
    this.form.controls.pointsPrice.setValue(consultation.pointsPrice ?? 1);
    this.form.controls.durationMinutes.setValue(consultation.durationMinutes ?? 30);
    this.startTimes.clear();
    for (const slot of consultation.slots) this.addSlot(this.toLocalInput(slot.startTime));
    if (this.startTimes.length === 0) this.addSlot();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.slotsError.set('');
  }

  private toLocalInput(value: string): string {
    const date = new Date(value);
    const pad = (number: number) => String(number).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private toUtc(value: string): string | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  private nonWhitespace(control: AbstractControl): ValidationErrors | null {
    return String(control.value).trim().length ? null : { whitespace: true };
  }
}
