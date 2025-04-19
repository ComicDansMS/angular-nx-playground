import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ThemeToggleComponent],
  template: `
    <div class="flex gap-4 flex-col items-center">
      <app-theme-toggle />

      <h2 class="text-3xl">Hello world</h2>
    </div>
  `,
})
export default class HomeComponent {}
