import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICourseCardDto } from '../../Models/course-card-dto.interface';

@Component({
  selector: 'app-course-card',
  imports: [CommonModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css',
})

export class CourseCardComponent {
  @Input() course!: ICourseCardDto;
  @Output() toggleFavorite = new EventEmitter<number>();
  @Output() viewCourse = new EventEmitter<number>();

  onFavoriteClick(event: Event) {
    event.stopPropagation();
    this.toggleFavorite.emit(this.course.id);
  }

  onCardClick() {
    this.viewCourse.emit(this.course.id);
  }
}
