import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';

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

  selectedLesson = signal<ILesson | null>(null);

  loading = signal(true);

  videoStarted = signal(false);

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;

    this.loadCoursePlayer();
  }

  loadCoursePlayer() {
    this.courseService.getCoursePlayer(this.courseId).subscribe({
      next: (res) => {
        this.coursePlayer.set(res);

        const firstLesson = res.modules?.flatMap((module) => module.lessons)[0];

        this.selectLesson(firstLesson);

        this.loading.set(false);
      },

      error: (err) => {
        console.error('Course Player Error', err);

        this.loading.set(false);
      },
    });
  }

  selectLesson(lesson: ILesson | undefined) {
    if (!lesson) {
      return;
    }

    this.selectedLesson.set(lesson);

    this.videoStarted.set(false);
  }

  startVideo() {
    this.videoStarted.set(true);
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
