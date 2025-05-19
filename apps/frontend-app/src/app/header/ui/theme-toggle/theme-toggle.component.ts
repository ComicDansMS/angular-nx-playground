import { Component, input, output } from '@angular/core';
import { LibButtonDirective } from '@ngnx-playground/ui/components/button';
import { Theme } from '@ngnx-playground/ui/interfaces';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button libButton [width]="'adapt'" (click)="toggleTheme.emit()">
      @if (theme() === 'light') {
        <span>☀️</span>
      } @else {
        <span>🌙</span>
      }
    </button>
  `,
  imports: [LibButtonDirective]
})
export class ThemeToggleComponent {
  theme = input.required<Theme>();
  toggleTheme = output();
}
