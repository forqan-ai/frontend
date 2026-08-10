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
import { PointPackagesComponent } from '../points/pages/point-packages/point-packages.component';
import { CourseDetailsComponent } from '../Course/Pages/course-details/course-details.component';
import { TeacherDetailsComponent } from '../teacher/pages/teacher-details/teacher-details.component';

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
    path: 'pointPackages',
    component: PointPackagesComponent,
    title: 'الطالب نقاط'
  }
  ,
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
    path: 'courses/:id',
    component: CourseDetailsComponent,
    title: 'تفاصيل الدورة',
  },
  {
    path: 'courses',
    component: CoursesBrowseComponent,
    title: 'تصفح الدورات المقدمة من منصة الفرقان',
  },
  {
    path: 'teachers/:id/details',
    component: TeacherDetailsComponent,
    title: 'تفاصيل عن المعلم',
  },
  {
    path: 'teachers',
    component: TeachersBrowseComponent,
    title: 'تصفح المعلمون المسجلون علي من منصة الفرقان',
  },
  {
    path: 'learning-circles/mine',
    component: MyLearningCirclesComponent,
    data: { circleContext: 'learning' },
    title: 'حلقاتي',
  },
  {
    path: 'learning-circles/:circleId',
    component: LearningCircleDetailsComponent,
    data: { circleContext: 'learning' },
    title: 'تفاصيل حلقة التعلم',
  },
  {
    path: 'learning-circles',
    component: ExploreLearningCirclesComponent,
    data: { circleContext: 'learning' },
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
    path: 'my-courses/course-feedback',
    component: StudentFeedbackComponent,
    title: 'تقييم الدورة'
  },
  {
  path: 'placement-test',
  loadChildren: () =>
    import('../placement-test/placement-test.routes').then(
      (m) => m.PLACEMENT_ROUTES,
    ),
  title: 'اختبار تحديد المستوى',
},

];
