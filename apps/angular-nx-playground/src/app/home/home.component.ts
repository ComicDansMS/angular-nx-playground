import { Component, inject } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { ThemeService } from '@crm-project/ui/core/theme-service';
import { LibButtonDirective } from '@crm-project/ui/button';
import { LibInputDirective } from '@crm-project/ui/input';
import { LibCardDirective } from '@crm-project/ui/card';

@Component({
  selector: 'app-home',
  template: `
    <div libCard class="flex gap-4 flex-col items-center w-96 mx-auto">
      <app-theme-toggle
        [themeType]="themeService.themeType()"
        (toggleTheme)="themeService.toggleTheme$.next()"
      />

      <p>It's very {{ themeService.themeType() }}</p>

      <input libInput [size]="'small'" type="text" placeholder="input.." />
      <input libInput [size]="'full'" type="text" placeholder="larger one.." />

      <button libButton [width]="'full'">Full width Button</button>
      <button libButton [variant]="'secondary'">Secondary</button>
    </div>
  `,
  imports: [
    ThemeToggleComponent,
    LibButtonDirective,
    LibInputDirective,
    LibCardDirective,
  ],
})
export default class HomeComponent {
  themeService = inject(ThemeService);
}
