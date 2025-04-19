import {
  computed,
  inject,
  Injectable,
  InjectionToken,
  signal,
} from '@angular/core';
import { lightTheme } from '@crm-project/ui/themes/light-theme';
import { darkTheme } from '@crm-project/ui/themes/dark-theme';
import { DOCUMENT } from '@angular/common';
import { Theme, ThemeType, Tokens } from '@crm-project/ui/interfaces';
import { map, Subject, tap } from 'rxjs';

export const LIGHT_THEME = new InjectionToken<Theme>('UI library light theme', {
  factory: () => lightTheme,
});

export const DARK_THEME = new InjectionToken<Theme>('UI library dark theme', {
  factory: () => darkTheme,
});

interface ThemeServiceState {
  themeType: ThemeType;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private readonly lightTheme = inject(LIGHT_THEME);
  private readonly darkTheme = inject(DARK_THEME);

  private readonly TOKEN_STYLE_ELEMENT_ID = 'crm-theme-tokens';
  private readonly styleElement: HTMLStyleElement = this.createStyleElement(
    this.TOKEN_STYLE_ELEMENT_ID
  );

  // state
  private state = signal<ThemeServiceState>({
    themeType: 'light',
  });

  // selectors
  public themeType = computed(() => this.state().themeType);

  // sources
  private theme$ = new Subject<Theme>();
  public toggleTheme$ = new Subject<void>();

  constructor() {
    this.document.head.append(this.styleElement);

    // reducers
    this.toggleTheme$
      .pipe(
        tap(() => {
          if (this.themeType() === 'light') {
            this.state.update((state) => ({ ...state, themeType: 'dark' }));
            this.theme$.next(this.darkTheme);
          } else {
            this.state.update((state) => ({ ...state, themeType: 'light' }));
            this.theme$.next(this.lightTheme);
          }
        })
      )
      .subscribe();

    this.theme$
      .pipe(
        map((theme) => this.generateCssVariables(theme.tokens)),
        tap((css) => (this.styleElement.textContent = css))
      )
      .subscribe();

    this.theme$.next(
      this.state().themeType === 'light' ? this.lightTheme : this.darkTheme
    );
  }

  // helpers
  private createStyleElement(id: string): HTMLStyleElement {
    const element = this.document.createElement('style');
    element.id = id;
    return element;
  }

  private generateCssVariables(tokens: Tokens): string {
    const cssVariables = Object.entries(tokens)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');

    return `:root {${cssVariables} }`;
  }
}
