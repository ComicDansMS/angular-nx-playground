import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-card',
  imports: [CommonModule],
  template: `
    <div class="lib-card">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    .lib-card {
      padding: var(--theme-space-lg);
      background: var(--theme-color-background-surface);
      border-radius: var(--theme-border-radius-md);
      border: var(--theme-border-light);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {}
