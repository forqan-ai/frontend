import { Component, computed, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ICategoryProgress } from '../../Models/category-progress.interface';
import { IRecentActivity } from '../../Models/recent-activity.interface';
import { IStudentCourse } from '../../Models/student-course.interface';
import { IStudentProfile } from '../../Models/student-profile.interface';

import { StudentService } from '../../Services/student.service';
import { environment } from '../../../../../environments/environment.development';
import { PointsService } from '../../../points/services/points.service';
import { RouterLink } from '@angular/router';
import { PointsBalanceComponent } from '../../../teacher/components/points-balance/points-balance.component';
import { CourseService } from '../../../Course/Services/course.service';
import { ICourseListItem } from '../../../courses-browse/models/course-list-item.interface';
import { CoursesBrowseCardComponent } from '../../../courses-browse/components/courses-browse-card/courses-browse-card.component';
import { Reward } from '../../../Reward/models/Reward';
import { RewardService } from '../../../Reward/Services/reward.service';
import { RewardPopupComponent } from '../../../Reward/Components/reward-popup/reward-popup.component';
import { AuthService } from '../../../../core/services/auth.service';
import { RewardProgress } from '../../../Reward/models/RewardProgress';
import { ButtonComponent } from "../../../../shared/components/button/button.component";

const streakImages = {
  sad: 'images/avatars/sad.png',
  thumbsUp: 'images/avatars/perfect.png',
  clapping: 'images/avatars/clap.png',
  okay: 'images/avatars/good.png',
  strong: 'images/avatars/achieve.png',
  grandMaster: 'images/avatars/certificate.png',
};
@Component({
  selector: 'app-studentprofile',
  standalone: true,

  imports: [CommonModule, DatePipe, RouterLink, CoursesBrowseCardComponent, RewardPopupComponent, ButtonComponent],

  templateUrl: './studentprofile.component.html',
  styleUrl: './studentprofile.component.css',
})
export class StudentprofileComponent implements OnInit {
  @ViewChild('coursesSlider') coursesSlider!: ElementRef;

  private studentService = inject(StudentService);

  apiUrl = `${environment.apiUrl}`;

  loading = signal(true);
  certificatesCount = signal(0);
  student = signal<IStudentProfile | null>(null);
  courses = signal<IStudentCourse[]>([]);
  categories = signal<ICategoryProgress[]>([]);
  activities = signal<IRecentActivity[]>([]);
  readonly currentPoints = signal(0);
  private poService = inject(PointsService);
  private courseService = inject(CourseService);

  recommendedCourses = signal<ICourseListItem[]>([]);
  rewardProgress = signal<RewardProgress | null>(null);

  reward = signal<Reward | null>(null);
  rewardService = inject(RewardService);
  claimLoading = false;
  authService = inject(AuthService);

  ngOnInit(): void {
    this.loadData();
    this.poService.getUserBalance().subscribe({
      next: (res) => {
        console.log(res);

        this.currentPoints.set(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.rewardService.getAvailableReward().subscribe({
      next: (reward) => {
        if (reward) {
          this.reward.set(reward);
        } else {
          console.log('No Rewards');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.rewardService.getRewardProgress().subscribe({
      next: (response) => {
        this.rewardProgress.set(response);
      },
      error: (err) => {
        console.error(err);
      },
    });
    this.studentService.getCertificatesCount().subscribe({
      next: (count) => {
        this.certificatesCount.set(count);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  claimReward() {
    if (!this.reward()) return;

    this.claimLoading = true;

    this.rewardService.claimReward(this.reward()?.rewardId ?? '').subscribe({
      next: (response) => {
        const userId = this.authService.getUserId();
        this.claimLoading = false;
        this.poService.AddPointsToUser(response.pointsAdded, userId).subscribe({
          next: (TotalPoints) => {
            this.currentPoints.set(TotalPoints);
          },
          error: (err) => {
            console.log(err);
          },
        });

        this.reward.set(null);
      },

      error: () => {
        this.claimLoading = false;
      },
    });
  }

  loadData(): void {
    this.loading.set(true);

    this.studentService.getStudentProfile().subscribe({
      next: (res) => {
        console.log(res);
        this.student.set(res);
      },
      error: (err) => console.error(err),
    });

    this.studentService.getCourses().subscribe({
      next: (res) => this.courses.set(res),
      error: (err) => console.error(err),
    });

    this.studentService.getCategories().subscribe({
      next: (res) => this.categories.set(res),
      error: (err) => console.error(err),
    });

    this.studentService.getActivities().subscribe({
      next: (res) => {
        console.log('Activities =>', res);
        this.activities.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });

    this.courseService.getRecommendedCourses().subscribe({
      next: (res) => this.recommendedCourses.set(res),
      error: (err) => console.error(err),
    });
  }

  completedCourses = computed(() => this.courses().filter((x) => x.isCompleted).length);

  inProgressCourses = computed(() => this.courses().filter((x) => !x.isCompleted).length);

  currentCourse = computed(() => this.courses().find((x) => !x.isCompleted) ?? null);

  totalCourses = computed(() => this.courses().length);

  totalCategories = computed(() => this.categories().length);

  knowledgePoints = computed(() => this.student()?.knowledgePoints ?? 0);

  knowledgeProgress = computed(() => this.student()?.knowledgeProgress ?? 0);

  streak = computed(() => this.student()?.streakCount ?? 0);

  averageProgress = computed(() => {
    if (!this.courses().length) return 0;

    const total = this.courses().reduce((sum, c) => sum + c.progressPercent, 0);

    return Math.round(total / this.courses().length);
  });

  latestActivities = computed(() => this.activities().slice(0, 5));

  progressPercentage = computed(() => {
    const progress = this.rewardProgress();

    if (!progress || progress.nextRewardStreak === 0) return 100;

    return Math.min((progress.currentStreak / progress.nextRewardStreak) * 100, 100);
  });

  remainingDays = computed(() => {
    const progress = this.rewardProgress();

    if (!progress) return 0;

    return Math.max(progress.nextRewardStreak - progress.currentStreak, 0);
  });

  getStudentImage(imageUrl?: string | null): string {
    if (!imageUrl || imageUrl.toLowerCase() === 'null') return 'images/avatar.webp';

    return imageUrl.startsWith('http') ? imageUrl : this.apiUrl + imageUrl;
  }

  getCourseImage(imageUrl?: string | null): string {
    if (!imageUrl || imageUrl.toLowerCase() === 'null') return 'images/book.png';

    return imageUrl.startsWith('http') ? imageUrl : this.apiUrl + imageUrl;
  }

  progressColor(progress: number): string {
    if (progress >= 80) return '#6e8f6b';
    if (progress >= 50) return '#341b16';
    if (progress >= 25) return '#c1663c';

    return '#7a635d';
  }

  progressStatus(progress: number): string {
    if (progress >= 100) return 'مكتمل';
    if (progress >= 75) return 'ممتاز';
    if (progress >= 50) return 'جيد';
    if (progress >= 25) return 'مستمر';

    return 'بدأ للتو';
  }

  getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) return 'صباح الخير';
    if (hour < 17) return 'مساء الخير';

    return 'أهلاً بك';
  }

  getStreakAvatar(streakCount: number): string {
    if (streakCount <= 0) {
      return streakImages.sad;
    } else if (streakCount <= 2) {
      return streakImages.thumbsUp;
    } else if (streakCount <= 5) {
      return streakImages.clapping;
    } else if (streakCount <= 10) {
      return streakImages.okay;
    } else if (streakCount <= 19) {
      return streakImages.strong;
    } else {
      return streakImages.grandMaster;
    }
  }
  scrollSlider(direction: 'next' | 'prev') {
    const slider = this.coursesSlider?.nativeElement;
    if (!slider) return;
    slider.scrollBy({ left: direction === 'next' ? -316 : 316, behavior: 'smooth' });
  }
}
