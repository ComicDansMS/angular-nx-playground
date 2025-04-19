import { Component, inject } from '@angular/core';
import { ThemeService } from '@crm-project/ui/core/theme-service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      (click)="themeService.toggleTheme$.next()"
      aria-label="Toggle theme"
      class="py-2 px-4 bg-blue-300 hover:bg-blue-400 rounded cursor-pointer"
    >
      @if (themeService.themeType() === 'light') {
      <span>☀️</span>
      } @else {
      <span>🌙</span>
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  protected themeService = inject(ThemeService);
}
