import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CoursesBrowseService } from '../../../courses-browse/services/courses-browse.service';
import { ICourseCardDto } from '../../../Course/Models/course-card-dto.interface';
import { CourseCardComponent } from "../../../Course/Components/course-card/course-card.component";

interface FeaturedCoursePreview {
  title: string;
  description: string;
  teacher: string;
  level: string;
  lessons: string;
  duration: string;
  rating: number;
  imagePath: string;
  imageAlt: string;
}

interface FeaturedTeacher {
  name: string;
  specialization: string;
  experience: string;
  bio: string;
  rating: number;
  imagePath: string;
  imageAlt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CourseCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  readonly recommendedCourses = signal<ICourseCardDto[]>([]);
  readonly displayRecommendedCourses = signal<ICourseCardDto[]>([]);
  readonly recommendedCoursesLoading = signal(true);
  readonly recommendedCoursesLoadFailed = signal(false);

  private readonly coursesBrowseService = inject(CoursesBrowseService);

  readonly fallbackCourses: ReadonlyArray<FeaturedCoursePreview> = [
    {
      title: 'أحكام التجويد للمبتدئين',
      description: 'تعرف على أهم قواعد التجويد وتعلم قراءة القرآن بصورة صحيحة خطوة بخطوة.',
      teacher: 'د. أحمد عبد الرحمن',
      level: 'مبتدئ',
      lessons: '12 درسًا',
      duration: '6 ساعات',
      rating: 4.9,
      imagePath: 'images/card1.jfif',
      imageAlt: 'غلاف توضيحي لدورة أحكام التجويد للمبتدئين',
    },
    {
      title: 'حفظ جزء عم وتثبيته',
      description: 'برنامج عملي يساعدك على حفظ سور جزء عم ومراجعتها من خلال خطة مبسطة.',
      teacher: 'أ. مريم خالد',
      level: 'جميع المستويات',
      lessons: '15 درسًا',
      duration: '8 ساعات',
      rating: 4.8,
      imagePath: 'images/elqoran.jpg',
      imageAlt: 'غلاف توضيحي لدورة حفظ جزء عم وتثبيته',
    },
    {
      title: 'مدخل إلى السيرة النبوية',
      description: 'رحلة تعليمية مبسطة للتعرف على أبرز أحداث السيرة والدروس المستفادة منها.',
      teacher: 'د. يوسف محمود',
      level: 'مبتدئ',
      lessons: '10 دروس',
      duration: '5 ساعات',
      rating: 4.7,
      imagePath: 'images/elhadith.webp',
      imageAlt: 'غلاف توضيحي لدورة مدخل إلى السيرة النبوية',
    },
  ];

  readonly featuredTeachers: ReadonlyArray<FeaturedTeacher> = [
    {
      name: 'د. أحمد عبد الرحمن',
      specialization: 'تلاوة القرآن وأحكام التجويد',
      experience: 'أكثر من 8 سنوات خبرة',
      bio: 'متخصص في تعليم أحكام التجويد وتصحيح التلاوة للمبتدئين والمتقدمين.',
      rating: 4.9,
      imagePath: 'images/avatar-1.png',
      imageAlt: 'صورة رمزية للمعلم أحمد عبد الرحمن',
    },
    {
      name: 'أ. مريم خالد',
      specialization: 'تحفيظ القرآن والمراجعة',
      experience: 'أكثر من 6 سنوات خبرة',
      bio: 'تساعد الطلاب على الحفظ والتثبيت من خلال خطط مرنة تناسب الأعمار والمستويات المختلفة.',
      rating: 4.8,
      imagePath: 'images/avatar.webp',
      imageAlt: 'صورة رمزية للمعلمة مريم خالد',
    },
    {
      name: 'د. يوسف محمود',
      specialization: 'الفقه والسيرة النبوية',
      experience: 'أكثر من 10 سنوات خبرة',
      bio: 'يقدم العلوم الشرعية بأسلوب مبسط يربط بين المعرفة والتطبيق في الحياة اليومية.',
      rating: 4.8,
      imagePath: 'images/avatar-2.png',
      imageAlt: 'صورة رمزية للمعلم يوسف محمود',
    },
  ];

  ngOnInit(): void {
    this.coursesBrowseService
      .getCourses({ pageNumber: 1, pageSize: 4 })
      .pipe(
        finalize(() => {
          this.recommendedCoursesLoading.set(false);
        }),
      )
      .subscribe({
        next: (result) => {
          const courses = Array.isArray(result?.items) ? result.items : [];

          this.recommendedCourses.set(courses);
          this.displayRecommendedCourses.set(courses.slice(0, 4));
          this.recommendedCoursesLoadFailed.set(false);
        },
        error: (error) => {
          console.error('Error fetching featured courses', error);
          this.recommendedCourses.set([]);
          this.displayRecommendedCourses.set([]);
          this.recommendedCoursesLoadFailed.set(true);
        },
      });
  }
}