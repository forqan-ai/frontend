import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  DomSanitizer,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { LessonService } from '../../services/lesson.service';
import { LessonModel } from '../../models/lesson.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-lesson-content',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './lesson-content.component.html',
  styleUrls: ['./lesson-content.component.css'],
})
export class LessonContentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private lessonService = inject(LessonService);
  private sanitizer = inject(DomSanitizer);

  moduleId = '';
  lessonId = '';

  lesson = signal<LessonModel | null>(null);

  videoFile = signal<File | null>(null);
  pdfFile = signal<File | null>(null);
  audioFile = signal<File | null>(null);

  isLoading = signal(false);

  isUploadingVideo = signal(false);
  isUploadingPdf = signal(false);
  isUploadingAudio = signal(false);

  videoError = signal('');
  pdfError = signal('');
  audioError = signal('');
  lessonError = signal('');

  ngOnInit(): void {
    this.moduleId =
      this.route.snapshot.paramMap.get('moduleId') ?? '';

    this.lessonId =
      this.route.snapshot.paramMap.get('lessonId') ?? '';

    if (!this.moduleId || !this.lessonId) {
      this.lessonError.set(
        'تعذر تحديد بيانات الدرس.'
      );
      return;
    }

    this.loadLesson();
  }

  getSafeUrl(
    url: string | undefined
  ): SafeResourceUrl | string {
    if (!url) {
      return '';
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  loadLesson(): void {
    this.isLoading.set(true);
    this.lessonError.set('');

    this.lessonService
      .getLesson(this.moduleId, this.lessonId)
      .subscribe({
        next: (lesson) => {
          this.lesson.set(lesson);
          this.isLoading.set(false);
        },

        error: () => {
          this.lessonError.set(
            'حدث خطأ أثناء تحميل بيانات الدرس.'
          );
          this.isLoading.set(false);
        },
      });
  }

  selectVideo(event: Event): void {
    this.videoError.set('');

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('video/')) {
      this.videoError.set(
        'من فضلك اختر ملف فيديو صالح.'
      );
      input.value = '';
      return;
    }

    this.videoFile.set(file);
  }

  uploadVideo(): void {
    const file = this.videoFile();

    if (!file) {
      this.videoError.set(
        'من فضلك اختر ملف فيديو أولاً.'
      );
      return;
    }

    this.videoError.set('');
    this.isUploadingVideo.set(true);

    this.lessonService
      .uploadVideo(
        this.moduleId,
        this.lessonId,
        file
      )
      .subscribe({
        next: () => {
          this.videoFile.set(null);
          this.isUploadingVideo.set(false);
          this.loadLesson();
        },

        error: () => {
          this.videoError.set(
            'حدث خطأ أثناء رفع الفيديو. حاول مرة أخرى.'
          );
          this.isUploadingVideo.set(false);
        },
      });
  }

  selectPdf(event: Event): void {
    this.pdfError.set('');

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      this.pdfError.set(
        'من فضلك اختر ملف PDF صالح.'
      );
      input.value = '';
      return;
    }

    this.pdfFile.set(file);
  }

  uploadPdf(): void {
    const file = this.pdfFile();

    if (!file) {
      this.pdfError.set(
        'من فضلك اختر ملف PDF أولاً.'
      );
      return;
    }

    this.pdfError.set('');
    this.isUploadingPdf.set(true);

    this.lessonService
      .uploadPdf(
        this.moduleId,
        this.lessonId,
        file
      )
      .subscribe({
        next: () => {
          this.pdfFile.set(null);
          this.isUploadingPdf.set(false);
          this.loadLesson();
        },

        error: () => {
          this.pdfError.set(
            'حدث خطأ أثناء رفع ملف PDF. حاول مرة أخرى.'
          );
          this.isUploadingPdf.set(false);
        },
      });
  }

  selectAudio(event: Event): void {
    this.audioError.set('');

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('audio/')) {
      this.audioError.set(
        'من فضلك اختر ملف صوتي صالح.'
      );
      input.value = '';
      return;
    }

    this.audioFile.set(file);
  }

  uploadAudio(): void {
    const file = this.audioFile();

    if (!file) {
      this.audioError.set(
        'من فضلك اختر ملف صوتي أولاً.'
      );
      return;
    }

    this.audioError.set('');
    this.isUploadingAudio.set(true);

    this.lessonService
      .uploadAudio(
        this.moduleId,
        this.lessonId,
        file
      )
      .subscribe({
        next: () => {
          this.audioFile.set(null);
          this.isUploadingAudio.set(false);
          this.loadLesson();
        },

        error: () => {
          this.audioError.set(
            'حدث خطأ أثناء رفع الملف الصوتي. حاول مرة أخرى.'
          );
          this.isUploadingAudio.set(false);
        },
      });
  }
}