import { Component, inject } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LibInputDirective } from '@crm-project/ui/components/input';
import { LibButtonDirective } from '@crm-project/ui/components/button';
import { ThemeService } from '@crm-project/ui/core/theme-service';

@Component({
  selector: 'app-home',
  template: `
    <div
      class="flex gap-4 flex-col items-center w-96 mx-auto border border-slate-300 rounded-lg shadow p-4"
    >
      <app-theme-toggle
        [themeType]="themeService.themeType()"
        (toggleTheme)="themeService.toggleTheme$.next()"
      />

      <p>It's very {{ themeService.themeType() }}</p>

      <input type="text" libInput placeholder="input.." />

      <button libButton [width]="'full'">Big Button</button>
      <button libButton [variant]="'secondary'">Secondary</button>
    </div>
  `,
  imports: [ThemeToggleComponent, LibInputDirective, LibButtonDirective],
})
export default class HomeComponent {
  themeService = inject(ThemeService);
}
