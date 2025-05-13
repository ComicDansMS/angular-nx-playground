import { computed, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Theme } from '@crm-project/ui/interfaces';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private readonly STORAGE_KEY = 'lib-theme';

  private _theme = signal<Theme>(this.loadInitialTheme());
  public theme = computed(() => this._theme());

  toggleTheme$ = new Subject<void>();

  constructor() {
    this.toggleTheme$
      .pipe(
        tap(() =>
          this.theme() === Theme.Light
            ? this.setTheme(Theme.Dark)
            : this.setTheme(Theme.Light)
        )
      )
      .subscribe();

    this.setTheme(this.theme());
  }

  private loadInitialTheme(): Theme {
    const storedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme | null;

    if (storedTheme === Theme.Light || storedTheme === Theme.Dark) {
      return storedTheme as Theme;
    }

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return Theme.Dark;
    }

    return Theme.Light;
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);

    if (theme === Theme.Light) {
      this.document.body.classList.remove(`theme-${Theme.Dark}`);
      this.document.body.classList.add(`theme-${Theme.Light}`);
    } else {
      this.document.body.classList.remove(`theme-${Theme.Light}`);
      this.document.body.classList.add(`theme-${Theme.Dark}`);
    }
  }
}
