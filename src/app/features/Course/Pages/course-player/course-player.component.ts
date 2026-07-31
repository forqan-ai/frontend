import { Component, OnInit, signal } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../Services/course.service';
import { ICoursePlayer, ILesson } from '../../Models/course-player.interface';
import { SafeUrlPipe } from '../../../../shared/pipes/safe-url-pipe';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [DecimalPipe, SafeUrlPipe],
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
  }

  startVideo() {
    this.videoStarted.set(true);
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
        const completed = this.allLessons().filter(
          (l) => l.isCompleted
        ).length;

        const progress =
          total > 0 ? Math.round((completed / total) * 100) : 0;

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
          this.router.navigate([
            '/dashboard',
            'student',
            'certificate',
            this.courseId,
          ]);
        }
      },

      error: (err) => {
        console.error('Mark lesson completed error', err);
      },
    });
  } else {
    if (nextLesson) {
      this.selectLesson(nextLesson);
    } else {
      this.router.navigate([
        '/dashboard',
        'student',
        'certificate',
        this.courseId,
      ]);
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
}
