import { effect, inject, Injectable, InjectionToken, signal } from '@angular/core';
import { lightTheme } from '@crm-project/ui/core/themes/light-theme';
import { darkTheme } from '@crm-project/ui/core/themes/dark-theme';
import { DOCUMENT } from '@angular/common';
import { Theme } from '@crm-project/ui/core/interfaces';

export const LIGHT_THEME = new InjectionToken<Theme>('UI library light theme', {
  factory: () => lightTheme,
});

export const DARK_THEME = new InjectionToken<Theme>('UI library dark theme', {
  factory: () => darkTheme,
});

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private lightTheme = inject(LIGHT_THEME);
  private darkTheme = inject(DARK_THEME);

  private TOKEN_STYLE_ELEMENT_ID = 'crm-theme-tokens';
  private currentTheme = signal<Theme>(this.lightTheme);
  public isDarkMode = signal<boolean>(false);

  private createStyleElement(theme: Theme, id: string) {
    const element = this.document.createElement('style');
    element.id = id;
    element.textContent = this.generateCssVariables(theme);
    return element;
  }

  private generateCssVariables(theme: Theme): string {
    const cssVariables = Object.entries(theme)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');

    return `:root {${cssVariables} }`;
  }

  public toggleTheme(): void {
    const newIsDarkMode = !this.isDarkMode();
    this.isDarkMode.set(newIsDarkMode);
    this.currentTheme.set(newIsDarkMode ? this.darkTheme : this.lightTheme);
  }

  constructor() {
    const styleElement = this.createStyleElement(this.currentTheme(), this.TOKEN_STYLE_ELEMENT_ID);
    this.document.head.appendChild(styleElement);

    effect(() => {
      const domStyleElement = document.getElementById(this.TOKEN_STYLE_ELEMENT_ID);

      if (domStyleElement) {
        domStyleElement.textContent = this.generateCssVariables(this.currentTheme());
      }
    });
  }
}
