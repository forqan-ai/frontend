import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ConsultationDetails, SetMeetingLinkRequest } from '../../models/consultation.models';

@Component({
  selector: 'app-meeting-link-form',
  imports: [ReactiveFormsModule],
  templateUrl: './meeting-link-form.component.html',
  styleUrl: './meeting-link-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingLinkFormComponent {
  private readonly fb = inject(FormBuilder);
  readonly consultation = input.required<ConsultationDetails>();
  readonly submitting = input(false);
  readonly submitted = output<SetMeetingLinkRequest>();
  readonly form = this.fb.nonNullable.group({
    platform: ['', [Validators.required, Validators.maxLength(50), this.nonWhitespace]],
    meetingLink: ['', [Validators.required, Validators.maxLength(500), this.httpUrl]],
  });

  constructor() {
    effect(() => {
      const consultation = this.consultation();
      this.form.setValue({ platform: consultation.platform ?? '', meetingLink: consultation.meetingLink ?? '' });
      this.form.markAsPristine();
      this.form.markAsUntouched();
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.submitted.emit({
      platform: value.platform.trim(),
      meetingLink: value.meetingLink.trim(),
      rowVersion: this.consultation().rowVersion,
    });
  }

  private nonWhitespace(control: AbstractControl): ValidationErrors | null {
    return String(control.value).trim() ? null : { whitespace: true };
  }

  private httpUrl(control: AbstractControl): ValidationErrors | null {
    try {
      const url = new URL(String(control.value));
      return url.protocol === 'http:' || url.protocol === 'https:' ? null : { url: true };
    } catch {
      return { url: true };
    }
  }
}
