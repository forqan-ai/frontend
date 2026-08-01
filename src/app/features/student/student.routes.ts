import { Routes } from '@angular/router';
import { StudentprofileComponent } from './Pages/studentprofile/studentprofile.component';
import { StudentSettingsComponent } from './Pages/student-settings/student-settings.component';
import { StudentCertificatesComponent } from './Pages/student-certificates/student-certificates.component';
import { CoursesBrowseComponent } from '../courses-browse/pages/courses-browse/courses-browse.component';
import { TeachersBrowseComponent } from '../teacher/pages/teachers-browse/teachers-browse.component';
import { ExploreLearningCirclesComponent } from '../learning-circles/pages/explore-learning-circles/explore-learning-circles.component';
import { LearningCircleDetailsComponent } from '../learning-circles/pages/learning-circle-details/learning-circle-details.component';
import { MyLearningCirclesComponent } from '../learning-circles/pages/my-learning-circles/my-learning-circles.component';
import { StudentCoursesComponent } from './Pages/student-courses/student-courses.component';
import { TeachingRequestComponent } from './Pages/teaching-request/teaching-request.component';
import { StudentFeedbackComponent } from "../Rating/pages/student-feedback/student-feedback.component";

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: StudentprofileComponent,
    title: 'الصفحة الرئيسية',
  },
  {
    path: 'settings',
    component: StudentSettingsComponent,
    title: 'الإعدادات',
  },
  {
    path: 'my-certificates',
    component: StudentCertificatesComponent,
    title: 'شهاداتي',
  },
  {
    path: 'courses',
    component: CoursesBrowseComponent,
    title: 'تصفح الدورات المقدمة من منصة الفرقان',
  },
  {
    path: 'teachers',
    component: TeachersBrowseComponent,
    title: 'تصفح المعلمون المسجلون علي من منصة الفرقان',
  },
  {
    path: 'learning-circles/mine',
    component: MyLearningCirclesComponent,
    title: 'حلقاتي',
  },
  {
    path: 'learning-circles/:circleId',
    component: LearningCircleDetailsComponent,
    title: 'تفاصيل حلقة التعلم',
  },
  {
    path: 'learning-circles',
    component: ExploreLearningCirclesComponent,
    title: 'استكشف حلقات التعلم',
  },
  {
    path: 'my-courses',
    component: StudentCoursesComponent,
    title: 'دوراتي',
  },
  {
    path: 'teaching-request',
    component: TeachingRequestComponent,
    title: 'طلب الانضمام كمعلم',
  },
  {
    path: 'course-player/:id',
    loadComponent: () =>
      import('../../features/Course/Pages/course-player/course-player.component').then(
        (m) => m.CoursePlayerComponent,
      ),
  },
  {
    path: 'certificate/:courseId',
    loadComponent: () =>
      import('../../features/Course/Pages/certificate/certificate.component').then(
        (m) => m.CertificateComponent,
      ),
    title: 'شهادة إتمام الدورة',
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./Pages/wishlist/wishlist.component').then((m) => m.WishlistComponent),
    title: 'مفضلتي',
  },
  {
        path : 'my-courses/course-feedback',
        component:StudentFeedbackComponent,
        title : 'تقييم الدورة'
    }
];
