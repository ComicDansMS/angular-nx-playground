import { Injectable } from '@angular/core';
import { ComponentStyleBase } from '@crm-project/ui/core/component-style-base';

const styles = /* css */ ` 
  .lib-button {
    background: var(--theme-color-button-primary);
    border-radius: 0.25rem;
    color: white;
    padding: 0.5rem 1.5rem;
    min-width: 8rem;
    cursor: pointer;
    text-transform: uppercase;
  }

  .lib-button:hover {
    background: var(--theme-color-button-primary-hover)
  }

  .lib-button--type-secondary {
    background: var(--theme-color-button-secondary)
  }

  .lib-button--type-secondary:hover {
    background: var(--theme-color-button-secondary-hover)
  }

  .lib-button--width-tight {
    min-width: 0;
    padding: 0.5rem 1rem;
  }

  .lib-button--width-full {
    width: 100%;
  }
`;

@Injectable()
export class ButtonStyle extends ComponentStyleBase {
  componentStyles = styles;
}
