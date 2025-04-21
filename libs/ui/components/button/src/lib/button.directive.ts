import { Directive, input, OnDestroy, OnInit } from '@angular/core';
import { style } from './button.style';
import { ComponentStyleBase } from '@crm-project/ui/core/component-style-base';

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
})
export class LibButtonDirective
  extends ComponentStyleBase
  implements OnInit, OnDestroy
{
  name = 'button';
  componentStyles = style;

  variant = input<ButtonVariant>();
  width = input<ButtonWidth>();

  ngOnInit() {
    this.loadStyles();
  }

  ngOnDestroy() {
    this.removeStyles();
  }
}
