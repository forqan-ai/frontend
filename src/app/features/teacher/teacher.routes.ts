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
    component: CreateCourseComponent,
  },
  {
    path: 'circles/mine',
    component: MyLearningCirclesComponent,
    title: 'حلقاتي',
  },
  {
    path: 'circles/create',
    component: CreateLearningCircleComponent,
    title: 'إنشاء حلقة تعلم',
  },
  {
    path: 'circles/:circleId/edit',
    component: EditLearningCircleComponent,
    title: 'تعديل حلقة التعلم',
  },
  {
    path: 'circles/:circleId',
    component: LearningCircleDetailsComponent,
    title: 'تفاصيل حلقة التعلم',
  },
  {
    path: 'circles',
    component: ExploreLearningCirclesComponent,
    title: 'استكشف حلقات التعلم',
  },
  {
    path: 'course-builder/:courseId',
    loadComponent: () =>
      import('./pages/course-builder/course-builder.component').then(
        (c) => c.CourseBuilderComponent,
      ),
  },

  {
    path: 'my-courses',
    loadComponent: () =>
      import('./pages/my-courses/my-courses.component').then((c) => c.MyCoursesComponent),
  },

  {
    path: 'quiz-builder/:quizId',
    loadComponent: () =>
      import('./pages/question-builder/question-builder.component').then(
        (c) => c.QuestionBuilderComponent,
      ),
  },

  {
    path: 'question-builder/:quizId/question/:questionId/options',
    loadComponent: () =>
      import('./pages/option-builder/option-builder.component').then(
        (c) => c.OptionBuilderComponent,
      ),
  },

  {
    path: 'lesson-content/:moduleId/:lessonId',
    loadComponent: () =>
      import('./pages/lesson-content/lesson-content.component').then(
        (c) => c.LessonContentComponent,
      ),
  },
  // {
  //   path: 'my-courses',
  //   component: MyCoursesComponent
  // },

  // {
  //   path: 'create-course',
  //   component: CreateCourseComponent
  // }
];
