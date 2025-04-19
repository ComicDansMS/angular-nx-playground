import { Directive, inject, input, OnDestroy, OnInit } from '@angular/core';
import { ButtonStyle } from './button.style';

type ButtonVariant = 'primary' | 'secondary';
type ButtonWidth = 'tight' | 'normal' | 'full';

@Directive({
  selector: 'button[libButton]',
  host: {
    class: 'lib-button',
    '[class.lib-button--type-secondary]': 'variant() === "secondary"',
    '[class.lib-button--width-tight]': 'width() === "tight"',
    '[class.lib-button--width-full]': 'width() === "full"',
  },
  providers: [ButtonStyle],
})
export class LibButtonDirective implements OnInit, OnDestroy {
  private componentStyle = inject(ButtonStyle);

  variant = input<ButtonVariant>();
  width = input<ButtonWidth>();

  ngOnInit() {
    this.componentStyle.loadStyles();
  }

  ngOnDestroy() {
    this.componentStyle.removeStyles();
  }
}
