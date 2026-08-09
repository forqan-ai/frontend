import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, numberAttribute, output, Output, signal } from '@angular/core';
import { CourseLevelArabic, ICourseCardDto } from '../../Models/course-card-dto.interface';
import { WishlistService } from '../../../student/Services/wishlist.service';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterLink } from "@angular/router";



@Component({
  selector: 'app-course-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css',
})
export class CourseCardComponent {
  @Input()
  course!: ICourseCardDto;

  @Input()
  liked: boolean | null = null;

  @Output()
  wishlistChanged = new EventEmitter<string>();

  wishlistService = inject(WishlistService);
  authService = inject(AuthService);

  isInWishlist = signal(false);
  isToggling = signal(false);
  isNew = signal<boolean>(false);

  ngOnInit() {
    if (this.getMonthsAgo(this.course.createdAt) > 3) {
      this.isNew.set(false);
    }
    else {
      this.isNew.set(true);
    }
    this.course.level = CourseLevelArabic[this.course.level] ?? this.course.level;


    //if we did not pass the input 'liked', it will search for the state itself
    if (this.liked === null) {
      if (this.authService.IsAuthenticated()) {
        this.wishlistService.getStatus(this.course.courseID).subscribe({
          next: (status: boolean) => this.isInWishlist.set(status)
        });
      }
    }
    else {
      this.isInWishlist.set(true);
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
        if (res.isInWishlist === false) {
          this.wishlistChanged.emit(this.course.courseID);
        }
      },
      error: () => this.isToggling.set(false)
    });
  }


  getMonthsAgo(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    let months =
      (now.getFullYear() - date.getFullYear()) * 12 +
      (now.getMonth() - date.getMonth());
    return months;
  }

  calculateLessonTime(timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} س : ${minutes} د`;
    }
    return `${minutes} د`;
  }
}