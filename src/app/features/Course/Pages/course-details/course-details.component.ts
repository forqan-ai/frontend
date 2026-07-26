import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseCardComponent } from '../../Components/course-card/course-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ICourseDetailsDto } from '../../Models/course-details-dto.interface';
import { CourseService } from '../../Services/course.service';
import { ICourseCardDto } from '../../Models/course-card-dto.interface';
import { ICourseModuleDto } from '../../Models/course-module-dto.interface';
import { ICourseOwnership } from '../../Models/course-ownership.interface';


@Component({
  selector: 'app-course-details',
  imports: [
    CommonModule,
    CourseCardComponent,
    RouterLink
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css',
})

export class CourseDetailsComponent {

  myCourses: ICourseCardDto[] = [
    // سيب الأمثلة بتاعتك هنا كما هي
  ];


  isYouTube = false;
  safeVideoUrl: SafeResourceUrl | null = null;


  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  courseService = inject(CourseService);

  course = signal<ICourseDetailsDto | null>(null);

  curriculum = signal<ICourseModuleDto[]>([]);

  owned = signal<boolean>(false);



  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      const courseId = params.get('id');

      console.log('Course ID from route:', courseId);


      if (!courseId) return;


      this.loadCourseDetails(courseId);

      this.loadCourseCurriculum(courseId);

      this.loadOwnership(courseId);

    });

  }





  loadCourseDetails(courseId: string) {

    this.courseService.getCourseDetails(courseId)
      .subscribe({

        next: (res: ICourseDetailsDto) => {

          this.course.set(res);

          this.initVideoPlayer(res.promoVideoURL);

        },


        error: (err: any) => {

          console.log(err);

        }

      });

  }





  loadCourseCurriculum(courseId: string) {

    this.courseService.getCourseCurriculum(courseId)
      .subscribe({

        next: (res: ICourseModuleDto[]) => {


          if (res.length > 0) {

            res[0].isOpen = true;

          }


          this.curriculum.set(res);


        },


        error: (err: any) => {

          console.log(err);

        }

      });

  }





  loadOwnership(courseId: string) {

    this.courseService.checkOwnership(courseId)
      .subscribe({

        next: (res: ICourseOwnership) => {

          this.owned.set(res.owned);

        },


        error: (err: any) => {

          console.log(err);

          this.owned.set(false);

        }

      });

  }





  calculateTotalTime(timeInSeconds: number): string {


    const hours = Math.floor(timeInSeconds / 3600);

    const minutes = Math.floor(
      (timeInSeconds % 3600) / 60
    );


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

    const minutes = Math.floor(
      (timeInSeconds % 3600) / 60
    );

    const seconds = timeInSeconds % 60;



    if (hours > 0) {

      return `${hours} س:${minutes} د:${seconds} ث`;

    }



    if (minutes > 0) {

      return `${minutes} د:${seconds} ث`;

    }



    return `${seconds} ث`;

  }







  initVideoPlayer(url?: string) {


    if (!url) {

      this.isYouTube = false;

      this.safeVideoUrl = null;

      return;

    }



    const ytRegExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;



    const match = url.match(ytRegExp);



    if (match && match[2]?.length === 11) {


      const videoId = match[2];


      this.isYouTube = true;


      this.safeVideoUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(

          `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`

        );


    }

    else {


      this.isYouTube = false;


      this.safeVideoUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(url);

    }

  }





  toggleModule(module: ICourseModuleDto) {

    module.isOpen = !module.isOpen;

  }





  handleFavorite(event: any) {

  }




  goToCourseDetails(event: any) {

  }

handlePurchaseClick() {

  const courseId = this.route.snapshot.paramMap.get('id');

  if (!courseId) return;

  if (this.owned()) {

    this.router.navigate([
      '/dashboard',
      'student',
      'course-player',
      courseId
    ]);

  } else {

    this.router.navigate([
      '/course-checkout',
      courseId
    ]);

  }

}

}