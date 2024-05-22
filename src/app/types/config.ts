import { InjectionToken } from '@angular/core';

export const APP_CONFIG = new InjectionToken('app.config', {
  providedIn: 'root',
  factory: () => ({
    title: 'My App',
  }),
});
