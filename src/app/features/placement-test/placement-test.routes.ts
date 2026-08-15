import { Routes } from '@angular/router';
import { PlacementIntroComponent } from './pages/placement-intro/placement-intro.component';
import { PlacementQuizComponent } from './pages/placement-quiz/placement-quiz.component';
import { PlacementResultComponent } from './pages/placement-result/placement-result.component';

export const PLACEMENT_ROUTES: Routes = [
  {
    path: '',
    // component: PlacementIntroComponent,
    loadComponent: () =>
      import('../placement-test/pages/placement-intro/placement-intro.component')
        .then(m => m.PlacementIntroComponent),
    title: 'اختبار تحديد المستوى | الفرقان',
  },
  {
    path: 'quiz',
    // component: PlacementQuizComponent,
    loadComponent: () =>
      import('../placement-test/pages/placement-quiz/placement-quiz.component')
        .then(m => m.PlacementQuizComponent),
    title: 'الاختبار | الفرقان',
  },
  {
    path: 'result',
    // component: PlacementResultComponent,
    loadComponent: () =>
      import('../placement-test/pages/placement-result/placement-result.component')
        .then(m => m.PlacementResultComponent),
    title: 'نتائج اختبار تحديد المستوى | الفرقان',
  },
];
