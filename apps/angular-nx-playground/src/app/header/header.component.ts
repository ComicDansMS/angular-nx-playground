import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '@crm-project/ui/core/theme-service';
import { ThemeToggleComponent } from './ui/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  imports: [ThemeToggleComponent],
  template: `
    <div class="flex justify-end items-center gap-4">
      <app-theme-toggle
        [themeType]="themeService.themeType()"
        (toggleTheme)="themeService.toggleTheme$.next()"
      />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  themeService = inject(ThemeService);
}
