import { Directive, input, OnDestroy, OnInit } from '@angular/core';
import { style } from './button.style';
import { BaseStyledDirective } from '@crm-project/ui/base-styled-directive';

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
  extends BaseStyledDirective
  implements OnInit, OnDestroy
{
  variant = input<ButtonVariant>();
  width = input<ButtonWidth>();

  name = 'button';
  componentStyles = style;

  minifyCss(css: string): string {
    return css.replace(/\s+/g, ' ').trim();
  }

  ngOnInit() {
    this.loadStyles();
  }

  ngOnDestroy() {
    this.removeStyles();
  }
}
