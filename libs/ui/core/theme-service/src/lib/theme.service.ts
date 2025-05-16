import { computed, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Theme } from '@ngnx-playground/ui/interfaces';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private readonly STORAGE_KEY = 'lib-theme';

  private _theme = signal<Theme>(this.getPreferredTheme());
  public theme = computed(() => this._theme());

  toggleTheme$ = new Subject<void>();

  constructor() {
    this.toggleTheme$
      .pipe(
        tap(() => {
          if (this.theme() === Theme.Light) {
            this.setTheme(Theme.Dark);
            localStorage.setItem(this.STORAGE_KEY, Theme.Dark);
          } else {
            this.setTheme(Theme.Light);
            localStorage.setItem(this.STORAGE_KEY, Theme.Light);
          }
        })
      )
      .subscribe();

    this.setTheme(this.theme());
  }

  private getPreferredTheme(): Theme {
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

  private setTheme(theme: Theme): void {
    this._theme.set(theme);

    if (theme === Theme.Light) {
      this.document.body.classList.remove(`theme-${Theme.Dark}`);
      this.document.body.classList.add(`theme-${Theme.Light}`);
    } else {
      this.document.body.classList.remove(`theme-${Theme.Light}`);
      this.document.body.classList.add(`theme-${Theme.Dark}`);
    }
  }
}
