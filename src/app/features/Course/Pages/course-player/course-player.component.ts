import { Component, ElementRef, OnInit, signal, viewChild } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../Services/course.service';
import { ICoursePlayer, ILesson } from '../../Models/course-player.interface';
import { SafeUrlPipe } from '../../../../shared/pipes/safe-url-pipe';
import { ChatComponent } from '../../../ai/pages/chat/chat.component';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [DecimalPipe, SafeUrlPipe, ChatComponent],
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css'],
})
export class CoursePlayerComponent implements OnInit {
  courseId!: string;

  coursePlayer = signal<ICoursePlayer | null>(null);

  allLessons = signal<ILesson[]>([]);

  selectedLesson = signal<ILesson | null>(null);

  loading = signal(true);

  videoStarted = signal(false);

  // Reference timestamp waiting for video or audio to load
  pendingSeekTime: number | null = null;

  // References to the media elements
  videoPlayer = viewChild<ElementRef<HTMLVideoElement>>('videoPlayer');
  audioPlayer = viewChild<ElementRef<HTMLAudioElement>>('audioPlayer');
  playerCard = viewChild<ElementRef<HTMLDivElement>>('playerCard');

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;

    this.loadCoursePlayer();
  }

  loadCoursePlayer() {
    this.courseService.getCoursePlayer(this.courseId).subscribe({
      next: (res: ICoursePlayer) => {
        this.coursePlayer.set(res);

        const lessons = res.modules.flatMap((module) => module.lessons);

        this.allLessons.set(lessons);

        this.selectLesson(lessons[0]);

        this.loading.set(false);
      },

      error: (err) => {
        console.error('Course Player Error', err);

        this.loading.set(false);
      },
    });
  }

  selectLesson(lesson?: ILesson) {
    if (!lesson) {
      return;
    }

    this.selectedLesson.set(lesson);

    this.videoStarted.set(false);

    // Clear any previous reference
    this.pendingSeekTime = null;
  }

  startVideo() {
    this.videoStarted.set(true);
  }

  /*
   * Called when the user clicks a reference from the AI chat.
   */
  seekVideo(seconds: number): void {
    console.log('Reference clicked:', seconds);

    this.scrollToPlayer();

    // Save the requested timestamp
    this.pendingSeekTime = seconds;

    const lessonType = this.selectedLesson()?.contentType;

    if (lessonType === 'Video' && !this.videoStarted()) {
      this.videoStarted.set(true);
      return;
    }

    this.seekToPendingTime();
  }

  /*
   * Called when the video or audio metadata is loaded.
   */
  onVideoLoaded(): void {
    this.seekToPendingTime();
  }

  /*
   * Actually move the media to the requested timestamp.
   */
  private seekToPendingTime(): void {
    if (this.pendingSeekTime === null) {
      return;
    }

    const lessonType = this.selectedLesson()?.contentType;
    const media =
      lessonType === 'Audio'
        ? this.audioPlayer()?.nativeElement
        : this.videoPlayer()?.nativeElement;

    if (!media) {
      return;
    }

    const seconds = this.pendingSeekTime;

    console.log('Seeking media to:', seconds);

    media.currentTime = seconds;

    media.play().catch(() => {
      // Browser may block autoplay.
    });

    this.pendingSeekTime = null;
  }

  private scrollToPlayer(): void {
    const card = this.playerCard()?.nativeElement;

    if (!card) {
      return;
    }

    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  getCurrentLessonIndex(): number {
    return this.allLessons().findIndex(
      (lesson) => lesson.lessonID === this.selectedLesson()?.lessonID,
    );
  }

  hasPreviousLesson(): boolean {
    return this.getCurrentLessonIndex() > 0;
  }

  hasNextLesson(): boolean {
    return this.getCurrentLessonIndex() < this.allLessons().length - 1;
  }

  goToPreviousLesson() {
    const index = this.getCurrentLessonIndex();

    const previousLesson = this.allLessons()[index - 1];

    if (previousLesson) {
      this.selectLesson(previousLesson);
    }
  }

  goToNextLesson() {
    const current = this.selectedLesson();

    if (!current) {
      return;
    }

    const index = this.getCurrentLessonIndex();

    const nextLesson = this.allLessons()[index + 1];

    if (!current.isCompleted) {
      this.courseService.markLessonCompleted(current.lessonID).subscribe({
        next: () => {
          current.isCompleted = true;

          const total = this.allLessons().length;

          const completed = this.allLessons().filter((l) => l.isCompleted).length;

          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

          const course = this.coursePlayer();

          if (course) {
            this.coursePlayer.set({
              ...course,
              progressPercentage: progress,
            });
          }

          if (nextLesson) {
            this.selectLesson(nextLesson);
          } else {
            this.router.navigate(['/dashboard', 'student', 'certificate', this.courseId]);
          }
        },

        error: (err) => {
          console.error('Mark lesson completed error:', err);
        },
      });
    } else {
      if (nextLesson) {
        this.selectLesson(nextLesson);
      } else {
        this.router.navigate(['/dashboard', 'student', 'certificate', this.courseId]);
      }
    }
  }

  getVideoUrl(url?: string): string | null {
    if (!url) {
      return null;
    }

    try {
      const parsed = new URL(url);

      let videoId = '';

      if (parsed.hostname.includes('youtu.be')) {
        videoId = parsed.pathname.replace('/', '');
      } else {
        videoId = parsed.searchParams.get('v') ?? '';
      }

      if (!videoId) {
        return null;
      }

      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    } catch {
      return null;
    }
  }

  getYoutubeThumbnail(url?: string): string {
    if (!url) {
      return this.coursePlayer()?.thumbnailURL ?? '';
    }

    try {
      const parsed = new URL(url);

      let videoId = '';

      if (parsed.hostname.includes('youtu.be')) {
        videoId = parsed.pathname.replace('/', '');
      } else {
        videoId = parsed.searchParams.get('v') ?? '';
      }

      if (!videoId) {
        return this.coursePlayer()?.thumbnailURL ?? '';
      }

      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    } catch {
      return this.coursePlayer()?.thumbnailURL ?? '';
    }
  }

  getLessonIcon(type: string): string {
    switch (type) {
      case 'Video':
        return 'bi-play-circle-fill';

      case 'Reading':
        return 'bi-file-earmark-text-fill';

      case 'Audio':
        return 'bi-music-note-beamed';

      default:
        return 'bi-file-earmark';
    }
  }

  getLessonType(type: string): string {
    switch (type) {
      case 'Video':
        return 'فيديو';

      case 'Reading':
        return 'مقال';

      case 'Audio':
        return 'صوت';

      default:
        return '';
    }
  }

  onModuleToggle(event: Event, moduleId: string): void {
    const current = event.target as HTMLDetailsElement;

    if (!current.open) {
      return;
    }

    const modules = document.querySelectorAll('.module-card');

    modules.forEach((module) => {
      if (module !== current) {
        (module as HTMLDetailsElement).open = false;
      }
    });
  }
}
