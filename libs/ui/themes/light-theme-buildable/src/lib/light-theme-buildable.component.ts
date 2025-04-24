import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-light-theme-buildable',
  imports: [CommonModule],
  template: `<p>LightThemeBuildable works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightThemeBuildableComponent {}
