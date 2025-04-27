import { computed, inject, Injectable, InjectionToken, signal } from '@angular/core';
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
  themeCss: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private readonly lightTheme = inject(LIGHT_THEME);
  private readonly darkTheme = inject(DARK_THEME);
  private readonly styleElement: HTMLStyleElement = this.document.createElement('style');
  private readonly STORAGE_KEY = 'lib-theme';

  private state = signal<ThemeServiceState>({
    themeType: this.loadTheme(),
    themeCss: null,
  });

  public themeType = computed(() => this.state().themeType);
  public themeCss = computed(() => this.state().themeCss);

  protected theme$ = new Subject<Theme>();
  public toggleTheme$ = new Subject<void>();

  constructor() {
    this.document.head.append(this.styleElement);

    this.toggleTheme$
      .pipe(
        tap(() => {
          if (this.themeType() === ThemeType.Light) {
            this.state.update((state) => ({ ...state, themeType: ThemeType.Light }));
            this.theme$.next(this.darkTheme);
          } else {
            this.state.update((state) => ({ ...state, themeType: ThemeType.Dark }));
            this.theme$.next(this.lightTheme);
          }
        })
      )
      .subscribe();

    this.theme$
      .pipe(
        tap((theme) => this.styleElement.setAttribute('data-lib-theme', theme.type)),
        tap((theme) => localStorage.setItem(this.STORAGE_KEY, theme.type)),
        map((theme) => this.generateCssFromTokens(theme.tokens)),
        tap((css) => (this.styleElement.textContent = css)),
        tap((css) => this.state.update((state) => ({ ...state, themeCss: css })))
      )
      .subscribe();

    this.theme$.next(this.state().themeType === ThemeType.Light ? this.lightTheme : this.darkTheme);
  }

  generateCssFromTokens(tokens: Tokens): string {
    const cssVariables = Object.entries(tokens)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');

    return `:root {${cssVariables}}`;
  }

  loadTheme(): ThemeType {
    const storedTheme = localStorage.getItem(this.STORAGE_KEY);

    if (storedTheme === ThemeType.Dark) {
      return ThemeType.Dark;
    } else {
      return ThemeType.Light;
    }
  }
}
