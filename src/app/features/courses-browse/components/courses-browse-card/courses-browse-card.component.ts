import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseLevel, ICourseListItem } from '../../models/course-list-item.interface';
import { WishlistService } from '../../../student/Services/wishlist.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-courses-browse-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './courses-browse-card.component.html',
  styleUrl: './courses-browse-card.component.css',
})
export class CoursesBrowseCardComponent implements OnInit {
  @Input({ required: true }) course!: ICourseListItem;

  wishlistService = inject(WishlistService);
  authService = inject(AuthService);

  isInWishlist = signal(false);
  isToggling = signal(false);

  private readonly levelLabels: Record<CourseLevel, string> = {
    Beginner: 'مبتدئ',
    Intermediate: 'متوسط',
    Advanced: 'متقدم',
  };

  get levelLabel(): string {
    return this.levelLabels[this.course.level];
  }

  get formattedDuration(): string {
    const totalSeconds = this.course.durationSeconds;
    if (totalSeconds <= 0) return 'المدة غير محددة';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0 && minutes > 0) return `${hours} س ${minutes} د`;
    if (hours > 0) return `${hours} ساعة`;
    return `${minutes} دقيقة`;
  }

  ngOnInit() {
    if (this.authService.IsAuthenticated()) {
      this.wishlistService.getStatus(this.course.courseID).subscribe({
        next: (status: boolean) => this.isInWishlist.set(status)
      });
    }
  }

  toggleWishlist(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.authService.IsAuthenticated() || this.isToggling()) return;

    this.isToggling.set(true);
    this.wishlistService.toggleWishlist(this.course.courseID).subscribe({
      next: (res: any) => {
        this.isInWishlist.set(res.isInWishlist);
        this.isToggling.set(false);
      },
      error: () => this.isToggling.set(false)
    });
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.onerror = null;
    image.src = 'images/card1.jfif';
  }

  router = inject(Router);
  route = inject(ActivatedRoute);

  navigateToCourse() {
    if (this.authService.IsAuthenticated()) {
      this.router.navigate(['../courses', this.course.courseID], {
        relativeTo: this.route
      });
    }
    else {
      this.router.navigateByUrl(`/courses/${this.course.courseID}`);
    }

  }
}
