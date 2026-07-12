import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseCardComponent } from '../../Components/course-card/course-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ICourseDetailsDto } from '../../Models/course-details-dto.interface';
import { CourseService } from '../../Services/course.service';
import { ICourseCardDto } from '../../Models/course-card-dto.interface';
import { ICourseModuleDto } from '../../Models/course-module-dto.interface';





@Component({
  selector: 'app-course-details',
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css',
})

export class CourseDetailsComponent {
  myCourses: ICourseCardDto[] = [
    {
      id: 1,
      title: 'دورة تفسير سورة البقرة - شرح وتدبر',
      instructor: 'د. أحمد عبد الرحمن',
      category: 'التفسير',
      rating: 4.9,
      reviewsCount: 324,
      price: '٣٥٠',
      imageUrl: 'crs1.jfif',
      isFavorite: true
    },
    {
      id: 2,
      title: 'تعلم أحكام التجويد من الصفر حتى الإتقان',
      instructor: 'الشيخ محمد خالد',
      category: 'التجويد',
      rating: 5.0,
      reviewsCount: 487,
      price: '٢٨٠',
      imageUrl: 'crs4.png',
      isFavorite: false
    },
    {
      id: 3,
      title: 'السيرة النبوية الكاملة - دروس وعبر',
      instructor: 'د. محمود يوسف',
      category: 'السيرة النبوية',
      rating: 4.8,
      reviewsCount: 276,
      price: '٤٢٠',
      imageUrl: 'crs3.png',
      isFavorite: false
    },
    {
      id: 4,
      title: 'فقه العبادات للمبتدئين',
      instructor: 'الشيخ عبد الله السالم',
      category: 'الفقه',
      rating: 4.7,
      reviewsCount: 198,
      price: '٠',
      imageUrl: 'crs2.png',
      isFavorite: true
    }
  ];




  isYouTube = false;
  safeVideoUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute,
    private router: Router) { }


  courseService = inject(CourseService);
  course = signal<ICourseDetailsDto | null>(null);
  curriculum = signal<ICourseModuleDto[]>([]);

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    console.log('Course ID from route:', courseId); // Check what this prints
    this.loadCourseDetails(courseId!);
    this.loadCourseCurriculum(courseId!);
  }

  loadCourseDetails(courseId: string) {
    this.courseService.getCourseDetails(courseId).subscribe({
      next: (res: ICourseDetailsDto) => {
        this.course.set(res);
        this.initVideoPlayer(res.promoVideoURL);
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }


  loadCourseCurriculum(courseId: string) {
    this.courseService.getCourseCurriculum(courseId).subscribe(
      {
        next: (res: ICourseModuleDto[]) => {
          res[0].isOpen = true; //open the first module lessons
          this.curriculum.set(res);
        },
        error: (err: any) => {
          console.log(err);
        }
      }
    )
  }

  calculateTotalTime(timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const parts: string[] = [];
    if (hours > 0) {
      parts.push(`${hours} ساعة`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} د`);
    }
    return parts.join(' , ');
  }


  calculateLessonTime(timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    if (hours > 0) {
      return `${hours} س:${minutes}: د${seconds} ث`;
    }
    if (minutes > 0) {
      return `${minutes} د:${seconds} ث`;
    }
    else {
      return `${seconds} ث`
    }
  }




  initVideoPlayer(url: string) {
    const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(ytRegExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];
      this.isYouTube = true;
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
      );
    } else {
      this.isYouTube = false;
      this.safeVideoUrl = url;
    }
  }

  toggleModule(module: ICourseModuleDto) {
    module.isOpen = !module.isOpen;
  }
  handleFavorite(event: any) {
  }

  goToCourseDetails(event: any) {
  }
}
