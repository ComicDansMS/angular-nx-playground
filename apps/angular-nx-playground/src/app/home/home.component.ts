import { Component, inject } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { ThemeService } from '@crm-project/ui/core/theme-service';
import { LibButtonDirective } from '@crm-project/ui/button';
import { LibInputDirective } from '@crm-project/ui/input';

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

      <input
        libInput
        [size]="'small'"
        type="text"
        placeholder="small input.."
      />
      <input libInput [size]="'large'" type="text" placeholder="larger one.." />

      <button libButton [width]="'full'">Big Button</button>
      <button libButton [variant]="'secondary'">Secondary</button>
    </div>
  `,
  imports: [ThemeToggleComponent, LibButtonDirective, LibInputDirective],
})
export default class HomeComponent {
  themeService = inject(ThemeService);
}
