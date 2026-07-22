import { Routes } from '@angular/router';

export const CIRCLE_CHAT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Pages/circle-chat-page/circle-chat-page.component').then(
        (m) => m.CircleChatPageComponent
      ),
  },
];
