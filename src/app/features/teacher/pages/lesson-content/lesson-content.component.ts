import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from '../../services/lesson.service';
import { LessonModel } from '../../models/lesson.model';

@Component({
  selector: 'app-lesson-content',
  standalone: true,
  imports: [],
  templateUrl: './lesson-content.component.html',
  styleUrls: ['./lesson-content.component.css'],
})
export class LessonContentComponent {
  private route = inject(ActivatedRoute);
  private lessonService = inject(LessonService);
  private sanitizer = inject(DomSanitizer);

  moduleId = '';
  lessonId = '';

  lesson = signal<LessonModel | null>(null);

  videoFile = signal<File | null>(null);
  pdfFile = signal<File | null>(null);
  audioFile = signal<File | null>(null);

  isUploading = signal<boolean>(false);

  ngOnInit() {
    this.moduleId = this.route.snapshot.paramMap.get('moduleId')!;
    this.lessonId = this.route.snapshot.paramMap.get('lessonId')!;

    this.loadLesson();
  }

  getSafeUrl(url: string | undefined): SafeResourceUrl | string {
    if (!url) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  loadLesson() {
    this.lessonService.getLesson(this.moduleId, this.lessonId).subscribe({
      next: (lesson) => {
        this.lesson.set(lesson);
        console.log(this.lesson());
      },
      error: (err) => console.log(err),
    });
  }

  // ================= VIDEO =================

  selectVideo(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.videoFile.set(input.files[0]);
    }
  }

  uploadVideo() {
    if (!this.videoFile()) return;

    this.isUploading.set(true);
    this.lessonService
      .uploadVideo(this.moduleId, this.lessonId, this.videoFile()!)
      .subscribe({
        next: () => {
          this.videoFile.set(null);
          this.isUploading.set(false);
          this.loadLesson();
        },
        error: (err) => {
          console.log(err);
          this.isUploading.set(false);
        },
      });
  }

  // ================= PDF =================

  selectPdf(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.pdfFile.set(input.files[0]);
    }
  }

  uploadPdf() {
    if (!this.pdfFile()) return;

    this.isUploading.set(true);
    this.lessonService
      .uploadPdf(this.moduleId, this.lessonId, this.pdfFile()!)
      .subscribe({
        next: () => {
          this.pdfFile.set(null);
          this.isUploading.set(false);
          this.loadLesson();
        },
        error: (err) => {
          console.log(err);
          this.isUploading.set(false);
        },
      });
  }

  // ================= AUDIO =================

  selectAudio(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.audioFile.set(input.files[0]);
    }
  }

  uploadAudio() {
    if (!this.audioFile()) return;

    this.isUploading.set(true);
    this.lessonService
      .uploadAudio(this.moduleId, this.lessonId, this.audioFile()!)
      .subscribe({
        next: () => {
          this.audioFile.set(null);
          this.isUploading.set(false);
          this.loadLesson();
        },
        error: (err) => {
          console.log(err);
          this.isUploading.set(false);
        },
      });
  }
}