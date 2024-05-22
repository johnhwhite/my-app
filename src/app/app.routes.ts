import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./records/edit/edit.component').then((m) => m.EditComponent),
  },
];
