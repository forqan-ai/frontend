import { Routes } from '@angular/router';
import { ExploreLearningCirclesComponent } from './pages/explore-learning-circles/explore-learning-circles.component';
import { MyLearningCirclesComponent } from './pages/my-learning-circles/my-learning-circles.component';

export const LEARNING_CIRCLES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'explore',
  },
  {
    path: 'explore',
    component: ExploreLearningCirclesComponent,
    title: 'استكشف حلقات التعلم',
  },
  {
    path: 'mine',
    component: MyLearningCirclesComponent,
    title: 'حلقاتي',
  },
];
