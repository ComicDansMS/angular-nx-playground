import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '@ngnx-playground/ui/core/theme-service';
import { ThemeToggleComponent } from './ui/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  imports: [ThemeToggleComponent],
  template: `
    <div class="flex justify-end items-center gap-4">
      <app-theme-toggle
        [theme]="themeService.theme()"
        (toggleTheme)="themeService.toggleTheme$.next()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  themeService = inject(ThemeService);
}
