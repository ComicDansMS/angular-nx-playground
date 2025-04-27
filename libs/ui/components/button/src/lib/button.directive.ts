import {
  Directive,
  HostBinding,
  HostListener,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { AbstractStyledDirective } from '@crm-project/ui/core/abstract-styled-directive';

const style = /* css */ `
  .lib-button {
    background: var(--theme-color-button-primary);
    border-radius: 0.25rem;
    color: #fff;
    padding: 0.5rem 1.5rem;
    min-width: 8rem;
    cursor: pointer;
    text-transform: uppercase;
  }

  .lib-button:hover {
    filter: brightness(1.1)
  }

  .lib-button--type-secondary {
    background: var(--theme-color-button-secondary);
  }

  .lib-button--type-secondary:hover {
    filter: brightness(1.1)
  }

  .lib-button--width-tight {
    min-width: 0;
    padding: 0.5rem 1rem;
  }
    
  .lib-button--width-full {
    width: 100%;
  }

  @keyframes flash {
    0%   { filter: brightness(1.35); }
    100% { filter: brightness(1.1); }
  }
  .lib-button--click {
    animation: flash 300ms ease-out;
  }
`;

type ButtonVariant = 'primary' | 'secondary';
type ButtonWidth = 'tight' | 'normal' | 'full';

@Directive({
  selector: 'button[libButton]',
  host: {
    '[attr.data-lib-component]': 'componentName',
    class: 'lib-button',
    '[class.lib-button--type-secondary]': 'variant() === "secondary"',
    '[class.lib-button--width-tight]': 'width() === "tight"',
    '[class.lib-button--width-full]': 'width() === "full"',
  },
})
export class LibButtonDirective
  extends AbstractStyledDirective
  implements OnInit, OnDestroy
{
  variant = input<ButtonVariant>();
  width = input<ButtonWidth>();
  componentName = 'button';
  componentStyles = style;
  private playClickAnimation = signal(false);

  @HostBinding('class.lib-button--click')
  get isClick() {
    return this.playClickAnimation();
  }

  @HostListener('click')
  setClickAnimation() {
    this.playClickAnimation.set(true);
    setTimeout(() => this.playClickAnimation.set(false), 300);
  }

  ngOnInit() {
    this.loadStyles(this.componentStyles, this.componentName);
  }

  ngOnDestroy() {
    this.removeStyles(this.componentName);
  }
}
