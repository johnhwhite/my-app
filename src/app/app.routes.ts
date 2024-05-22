import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./hub/hub.component').then((m) => m.HubComponent),
  },
  {
    path: 'records',
    loadComponent: () =>
      import('./records/list/list.component').then((m) => m.ListComponent),
  },
];
