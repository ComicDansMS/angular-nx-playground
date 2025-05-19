import {
  Directive,
  HostBinding,
  HostListener,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { AbstractStyledDirective } from '@ngnx-playground/ui/core/abstract-styled-directive';

const style = /* css */ `
  .lib-button {
    background: var(--theme-color-primary-700);
    color: var(--theme-color-text-on-primary);
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    width: 100%;
    cursor: pointer;
    text-transform: uppercase;
  }

  .lib-button--type-secondary {
    background: var(--theme-color-neutral-600);
    color: var(--theme-color-text-on-primary)
  }

  .lib-button:hover {
    filter: brightness(1.1)
  }

  .lib-button--width-adapt {
    width: max-content;
  }

  @keyframes flash {
    0%   { filter: brightness(1.35); }
    100% { filter: brightness(1.1); }
  }
  .lib-button--click {
    animation: flash 200ms ease-out;
  }
`;

type ButtonVariant = 'primary' | 'secondary';
type ButtonWidth = 'adapt';

@Directive({
  selector: 'button[libButton]',
  host: {
    '[attr.data-lib-component]': 'componentName',
    class: 'lib-button',
    '[class.lib-button--type-secondary]': 'variant() === "secondary"',
    '[class.lib-button--width-adapt]': 'width() === "adapt"',
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
    setTimeout(() => this.playClickAnimation.set(false), 200);
  }

  ngOnInit() {
    this.loadStyles(this.componentStyles, this.componentName);
  }

  ngOnDestroy() {
    this.removeStyles(this.componentName);
  }
}
