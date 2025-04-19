import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '@crm-project/ui/core/theme-service';

@Component({
  selector: 'lib-theme-provider',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeProviderComponent {
  themeService = inject(ThemeService);
}
