import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreateCourseComponent } from './pages/create-course/create-course.component';
import { CreateLearningCircleComponent } from '../learning-circles/pages/create-learning-circle/create-learning-circle.component';
import { EditLearningCircleComponent } from '../learning-circles/pages/edit-learning-circle/edit-learning-circle.component';
import { ExploreLearningCirclesComponent } from '../learning-circles/pages/explore-learning-circles/explore-learning-circles.component';
import { LearningCircleDetailsComponent } from '../learning-circles/pages/learning-circle-details/learning-circle-details.component';
import { MyLearningCirclesComponent } from '../learning-circles/pages/my-learning-circles/my-learning-circles.component';

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },

  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'create-course',
    component: CreateCourseComponent
  },
  {
    path: 'circles/mine',
    component: MyLearningCirclesComponent,
    title: 'حلقاتي'
  },
  {
    path: 'circles/create',
    component: CreateLearningCircleComponent,
    title: 'إنشاء حلقة تعلم'
  },
  {
    path: 'circles/:circleId/edit',
    component: EditLearningCircleComponent,
    title: 'تعديل حلقة التعلم'
  },
  {
    path: 'circles/:circleId',
    component: LearningCircleDetailsComponent,
    title: 'تفاصيل حلقة التعلم'
  },
  {
    path: 'circles',
    component: ExploreLearningCirclesComponent,
    title: 'استكشف حلقات التعلم'
  }

  // {
  //   path: 'my-courses',
  //   component: MyCoursesComponent
  // },

  // {
  //   path: 'create-course',
  //   component: CreateCourseComponent
  // }
];
