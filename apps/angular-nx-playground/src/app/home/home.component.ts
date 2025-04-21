import { Component, inject } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { ThemeService } from '@crm-project/ui/core/theme-service';
import { LibButtonDirective } from '@crm-project/ui/button';
import { LibCardDirective } from '@crm-project/ui/card';
import InputsComponent from '../inputs/inputs.component';

@Component({
  selector: 'app-home',
  template: `
    <div libCard class="flex gap-4 flex-col items-center w-96 mx-auto">
      <app-theme-toggle
        [themeType]="themeService.themeType()"
        (toggleTheme)="themeService.toggleTheme$.next()"
      />

      <p>It's very {{ themeService.themeType() }}</p>

      <button libButton [width]="'full'">Full width Button</button>
      <button libButton [variant]="'secondary'">Secondary</button>

      <app-inputs />
    </div>
  `,
  imports: [
    ThemeToggleComponent,
    LibButtonDirective,
    LibCardDirective,
    InputsComponent,
  ],
})
export default class HomeComponent {
  themeService = inject(ThemeService);
}
