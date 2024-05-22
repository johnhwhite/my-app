import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./records/list/list.component').then((m) => m.ListComponent),
  },
];
