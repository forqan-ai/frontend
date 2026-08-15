import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreateCourseComponent } from './pages/create-course/create-course.component';
import { CreateLearningCircleComponent } from '../learning-circles/pages/create-learning-circle/create-learning-circle.component';
import { EditLearningCircleComponent } from '../learning-circles/pages/edit-learning-circle/edit-learning-circle.component';
import { LearningCircleDetailsComponent } from '../learning-circles/pages/learning-circle-details/learning-circle-details.component';
import { MyLearningCirclesComponent } from '../learning-circles/pages/my-learning-circles/my-learning-circles.component';
import { teacherGuard } from '../../core/guards/teacher-guard';

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    canActivateChild: [teacherGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../teacher/pages/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
        // component: DashboardComponent,
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('../teacher/pages/profile/profile.component')
            .then(m => m.ProfileComponent),
        // component: ProfileComponent,
      },

      {
        path: 'create-course',
        loadComponent: () =>
          import('../teacher/pages/create-course/create-course.component')
            .then(m => m.CreateCourseComponent),
        // component: CreateCourseComponent,
      },

      {
        path: 'circles/mine',
        loadComponent: () =>
          import('../learning-circles/pages/my-learning-circles/my-learning-circles.component')
            .then(m => m.MyLearningCirclesComponent),
        // component: MyLearningCirclesComponent,
        data: { circleContext: 'management' },
        title: 'حلقاتي',
      },

      {
        path: 'circles/create',
        loadComponent: () =>
          import('../learning-circles/pages/create-learning-circle/create-learning-circle.component')
            .then(m => m.CreateLearningCircleComponent),
        // component: CreateLearningCircleComponent,
        title: 'إنشاء حلقة تعلم',
      },

      {
        path: 'circles/:circleId/edit',
        loadComponent: () =>
          import('../learning-circles/pages/edit-learning-circle/edit-learning-circle.component')
            .then(m => m.EditLearningCircleComponent),
        // component: EditLearningCircleComponent,
        title: 'تعديل حلقة التعلم',
      },

      {
        path: 'circles/:circleId',
        loadComponent: () =>
          import('../learning-circles/pages/learning-circle-details/learning-circle-details.component')
            .then(m => m.LearningCircleDetailsComponent),
        // component: LearningCircleDetailsComponent,
        data: { circleContext: 'management' },
        title: 'تفاصيل حلقة التعلم',
      },

      {
        path: 'circles',
        loadComponent: () =>
          import('../learning-circles/pages/my-learning-circles/my-learning-circles.component')
            .then(m => m.MyLearningCirclesComponent),
        // component: MyLearningCirclesComponent,
        data: { circleContext: 'management' },
        title: 'إدارة حلقات العلم',
      },

      {
        path: 'course-builder/:courseId',
        loadComponent: () =>
          import('./pages/course-builder/course-builder.component')
            .then(c => c.CourseBuilderComponent),
      },

      {
        path: 'my-courses',
        loadComponent: () =>
          import('./pages/my-courses/my-courses.component')
            .then(c => c.MyCoursesComponent),
      },

      {
        path: 'quiz-builder/:quizId',
        loadComponent: () =>
          import('./pages/question-builder/question-builder.component')
            .then(c => c.QuestionBuilderComponent),
      },

      {
        path: 'question-builder/:quizId/question/:questionId/options',
        loadComponent: () =>
          import('./pages/option-builder/option-builder.component')
            .then(c => c.OptionBuilderComponent),
      },

      {
        path: 'lesson-content/:moduleId/:lessonId',
        loadComponent: () =>
          import('./pages/lesson-content/lesson-content.component').then(
            (c) => c.LessonContentComponent,
          ),
      },
      {
        path: 'wallet',
        loadChildren: () =>
          import('../wallet/wallet.routes').then((m) => m.WALLET_ROUTES),
      },
      // {
      //   path: 'my-courses',
      //   component: MyCoursesComponent
      // },

    ]
  },

];
