import { Component, input, output } from '@angular/core';
import { ThemeType } from '@crm-project/ui/interfaces';
import { LibButtonDirective } from '@crm-project/ui/components/button';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button libButton [width]="'adapt'" (click)="toggleTheme.emit()">
      @if (themeType() === themeTypeEnum.Light) {
      <span>☀️</span>
      } @else {
      <span>🌙</span>
      }
    </button>
  `,
  imports: [LibButtonDirective],
})
export class ThemeToggleComponent {
  themeType = input.required<ThemeType>();
  toggleTheme = output();
  readonly themeTypeEnum = ThemeType;
}
