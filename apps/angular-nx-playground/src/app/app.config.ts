import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { DARK_THEME, LIGHT_THEME } from '@crm-project/ui/core/theme-service';
import { darkTheme } from '../themes/dark.theme';
import { lightTheme } from '../themes/light.theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    { provide: LIGHT_THEME, useValue: lightTheme },
    { provide: DARK_THEME, useValue: darkTheme },
  ],
};
