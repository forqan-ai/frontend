import { Routes } from '@angular/router';
import { PlacementIntroComponent } from './pages/placement-intro/placement-intro.component';
import { PlacementQuizComponent } from './pages/placement-quiz/placement-quiz.component';
import { PlacementResultComponent } from './pages/placement-result/placement-result.component';

export const PLACEMENT_ROUTES: Routes = [
  {
    path: '',
    component: PlacementIntroComponent,
    title: 'اختبار تحديد المستوى | الفرقان',
  },
  {
    path: 'quiz',
    component: PlacementQuizComponent,
    title: 'الاختبار | الفرقان',
  },
  {
    path: 'result',
    component: PlacementResultComponent,
    title: 'نتائج اختبار تحديد المستوى | الفرقان',
  },
];
