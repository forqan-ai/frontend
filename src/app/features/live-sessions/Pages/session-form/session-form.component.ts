import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionsService } from '../../Services/sessions.service';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './session-form.component.html',
  styleUrl: './session-form.component.css',
})
export class SessionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sessionsService = inject(SessionsService);

  circleId = '';
  sessionId: string | null = null;

  isEdit = signal(false);
  submitting = signal(false);
  errorMsg = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    date: ['', Validators.required],
    time: ['', Validators.required],
    durationMinutes: [60, [Validators.required, Validators.min(5)]],
    isFree: [true],
    pointsPrice: [0],
    meetingLink: [''],
    platform: [''],
  });

  ngOnInit(): void {
    this.circleId = this.route.snapshot.paramMap.get('circleId') ?? '';
    this.sessionId = this.route.snapshot.paramMap.get('sessionId');

    this.form.controls.isFree.valueChanges.subscribe((isFree) => {
      const price = this.form.controls.pointsPrice;
      if (isFree) {
        price.setValue(0);
        price.clearValidators();
      } else {
        price.setValidators([Validators.required, Validators.min(1)]);
      }
      price.updateValueAndValidity();
    });

    if (this.sessionId) {
      this.isEdit.set(true);

      this.sessionsService.getSession(this.sessionId).subscribe({
        next: (s) => {
          const dt = new Date(s.sessionDate);
          this.circleId = s.circleId;
          this.form.patchValue({
            title: s.title,
            description: s.description ?? '',
            date: dt.toISOString().slice(0, 10),
            time: dt.toTimeString().slice(0, 5),
            durationMinutes: s.durationMinutes,
            isFree: s.pointsPrice === 0,
            pointsPrice: s.pointsPrice,
            meetingLink: s.meetingLink ?? '',
            platform: s.platform ?? '',
          });
        },
        error: (err) => console.error(err),
      });
    }
  }

  get scheduledAtInvalid(): boolean {
    const { date, time } = this.form.getRawValue();
    if (!date || !time) return false;
    return new Date(`${date}T${time}`).getTime() < Date.now();
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.scheduledAtInvalid || this.submitting()) return;

    const v = this.form.getRawValue();

    this.submitting.set(true);
    this.errorMsg.set(null);

    const base = {
      title: v.title,
      description: v.description || null,
      sessionDate: new Date(`${v.date}T${v.time}`).toISOString(),
      durationMinutes: v.durationMinutes,
      pointsPrice: v.isFree ? 0 : v.pointsPrice,
      meetingLink: v.meetingLink || null,
      platform: v.platform || null,
    };

   const request$ = (this.isEdit()
  ? this.sessionsService.updateSession(this.sessionId!, base)
  : this.sessionsService.createSession({ ...base, circleId: this.circleId })) as any;

    request$.subscribe({
      next: () => this.router.navigate(['/circles', this.circleId, 'sessions']),
      error: (err:any) => {
        console.error(err);
        this.submitting.set(false);
        const msg = typeof err.error === 'string' && err.error
          ? err.error
          : 'حدث خطأ أثناء الحفظ، حاول مرة أخرى.';
        this.errorMsg.set(msg);
      },
    });
  }

  hasError(controlName: string, error: string): boolean {
    const c = this.form.get(controlName);
    return !!c && c.touched && c.hasError(error);
  }
}
