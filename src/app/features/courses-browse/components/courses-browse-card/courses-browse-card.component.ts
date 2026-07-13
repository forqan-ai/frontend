import { Component, Input, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseLevel, ICourseListItem } from '../../models/course-list-item.interface';

@Component({
  selector: 'app-courses-browse-card',
  imports: [RouterLink],
  templateUrl: './courses-browse-card.component.html',
  styleUrl: './courses-browse-card.component.css',
})
export class CoursesBrowseCardComponent {
@Input({ required: true })
  course!: ICourseListItem;

  private readonly levelLabels: Record<CourseLevel, string> = {
    Beginner: 'مبتدئ',
    Intermediate: 'متوسط',
    Advanced: 'متقدم',
  };

  get levelLabel(): string {
    return this.levelLabels[
      this.course.level
    ];
  }

  get formattedDuration(): string {
    const totalSeconds =
      this.course.durationSeconds;

    if (totalSeconds <= 0) {
      return 'المدة غير محددة';
    }

    const hours = Math.floor(
      totalSeconds / 3600,
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60,
    );

    if (hours > 0 && minutes > 0) {
      return `${hours} س ${minutes} د`;
    }

    if (hours > 0) {
      return `${hours} ساعة`;
    }

    return `${minutes} دقيقة`;
  }

  onImageError(event: Event): void {
    const image =
      event.target as HTMLImageElement;

    image.onerror = null;
    image.src = 'images/card1.jfif';
  }
}
