import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { CourseCardComponent } from '../../Components/course-card/course-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ICourseDetailsDto } from '../../Models/course-details-dto.interface';
import { CourseService } from '../../Services/course.service';
import { ICourseCardDto } from '../../Models/course-card-dto.interface';
import { ICourseModuleDto } from '../../Models/course-module-dto.interface';
import { ICourseOwnership } from '../../Models/course-ownership.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WishlistService } from '../../../student/Services/wishlist.service';
import { ButtonComponent } from "../../../../shared/components/button/button.component";


@Component({
  selector: 'app-course-details',
  imports: [
    CommonModule,
    CourseCardComponent,
    RouterLink,
    ButtonComponent
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css',
})

export class CourseDetailsComponent {

  isYouTube = false;
  safeVideoUrl: SafeResourceUrl | null = null;


  readonly isLoggedIn = signal(false);
  private readonly authService = inject(AuthService);

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private wishlistService: WishlistService
  ) { }

  @ViewChild('recommendedSlider') recommendedSliderRef!: ElementRef<HTMLDivElement>;

  courseService = inject(CourseService);
  course = signal<ICourseDetailsDto | null>(null);
  curriculum = signal<ICourseModuleDto[]>([]);
  owned = signal<boolean>(false);
  courseWishListStatus = signal<boolean>(false);
  addingToWishlist = signal<boolean>(false);
  courseDetailsLoaded = signal<boolean>(false);
  private readonly destroyRef = inject(DestroyRef);

  courseId: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // const courseId = params.get('id');
      this.courseId = params.get('id');
      if (!this.courseId) return;
      this.loadCourseDetails(this.courseId);
      this.isLoggedIn.set(this.authService.IsAuthenticated());
      this.loadCourseCurriculum(this.courseId);
    });

    if (this.isLoggedIn()) {
      this.loadRecommendedCourses();
      this.loadOwnership(this.courseId!);
      this.getCourseWishlistStatus(this.courseId!);
    }
  }

  readonly recommendedCourses = signal<ICourseCardDto[]>([]);

  private loadRecommendedCourses(): void {
    this.courseService.getRecommendedCourses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.recommendedCourses.set(res),
        error: () => { }
      });
  }

  scrollRecommended(dir: 'prev' | 'next'): void {
    const el = this.recommendedSliderRef?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: dir === 'next' ? -320 : 320, behavior: 'smooth' });
  }

  loadCourseDetails(courseId: string) {
    this.courseService.getCourseDetails(courseId)
      .subscribe({
        next: (res: ICourseDetailsDto) => {
          this.course.set(res);
          this.title.setTitle(`عن دورة - ${this.course()?.title}`);
          this.initVideoPlayer(res.promoVideoURL);
          this.courseDetailsLoaded.set(true);
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
    const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
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
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
    if (this.authService.isLoggedIn()) {
      const courseId = this.route.snapshot.paramMap.get('id');
      if (!courseId) return;
      if (this.owned()) {
        this.router.navigate(['student', 'course-player', courseId]);
      } else {
        this.router.navigate(['student', 'courses', courseId, 'checkout']);
      }
    }
    else {
      this.router.navigateByUrl('/login');
    }
  }


  getCourseWishlistStatus(courseId: string) {
    this.wishlistService.getStatus(courseId).subscribe({
      next: (res) => {
        this.courseWishListStatus.set(res);
      },
      error: (err) => {
        // console.log(err);
        console.log("can not get course wishlist status info")
        console.log(err);

      }
    })
  }



  addToWishlist() {
    if (this.authService.isLoggedIn()) {
      this.addingToWishlist.set(true);
      this.wishlistService.toggleWishlist(this.course()?.courseID!).subscribe({
        next: (res) => {
          this.courseWishListStatus.set(res.isInWishlist);
        },
        error: (err) => {
          console.log(err)
        },
        complete: () => {
          this.addingToWishlist.set(false);
        }
      })
    }
    else {
      this.router.navigateByUrl('/login');
    }
  }


  navigateToTeacher() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl(`/student/teachers/${this.course()?.teacherID}/details`)
    }
    else {
      this.router.navigateByUrl(`teachers/${this.course()?.teacherID}/details`)
    }
  }

}