import { Directive, input, OnDestroy, OnInit } from '@angular/core';
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
    background: var(--theme-color-button-primary-hover);
  }

  .lib-button--type-secondary {
    background: var(--theme-color-button-secondary);
  }

  .lib-button--type-secondary:hover {
    background: var(--theme-color-button-secondary-hover);
  }

  .lib-button--width-tight {
    min-width: 0;
    padding: 0.5rem 1rem;
  }
    
  .lib-button--width-full {
    width: 100%;
  }
`;

type ButtonVariant = 'primary' | 'secondary';
type ButtonWidth = 'tight' | 'normal' | 'full';

@Directive({
  selector: 'button[libButton]',
  host: {
    '[attr.data-lib-component]': 'id',
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

  name = 'button';
  componentStyles = style;

  ngOnInit() {
    this.loadStyles();
  }

  ngOnDestroy() {
    this.removeStyles();
  }
}
