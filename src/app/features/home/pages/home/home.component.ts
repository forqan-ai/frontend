import { Carousel } from 'bootstrap';
import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../Course/Services/course.service';
import { ICourseListItem } from '../../../courses-browse/models/course-list-item.interface';
import { CoursesBrowseCardComponent } from '../../../courses-browse/components/courses-browse-card/courses-browse-card.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CoursesBrowseCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit {
  courses = [
    { imagePath: 'images/card3.jfif', title: 'الدورة الأولى', level: 'مبتدئ', rating: '★★★★★' },
    { imagePath: 'images/card3.jfif', title: 'الدورة الثانية', level: 'متوسط', rating: '★★★★' },
    { imagePath: 'images/card3.jfif', title: 'الدورة الثالثة', level: 'متقدم', rating: '★★★★★' },
    { imagePath: 'images/card3.jfif', title: 'الدورة الرابعة', level: 'مبتدئ', rating: '★★★★' },
    { imagePath: 'images/card3.jfif', title: 'الدورة الخامسة', level: 'متوسط', rating: '★★★★★' },
    { imagePath: 'images/card3.jfif', title: 'الدورة السادسة', level: 'متقدم', rating: '★★★★' }
  ];

  recommendedCourses: ICourseListItem[] = [];
  courseService = inject(CourseService);

  ngOnInit(): void {
    this.courseService.getRecommendedCourses().subscribe({
      next: (courses) => {
        this.recommendedCourses = courses;
      },
      error: (err) => {
        console.error('Error fetching recommended courses', err);
      }
    });
  }

  ngAfterViewInit(): void {
    const carouselElement = document.querySelector('#heroCarousel');

    if (carouselElement) {
      const carousel = new Carousel(carouselElement, {
        interval: 2500,
        pause: false,
        wrap: true
      });

      setTimeout(() => {
        carousel.cycle();
      }, 0);
    }
  }
}