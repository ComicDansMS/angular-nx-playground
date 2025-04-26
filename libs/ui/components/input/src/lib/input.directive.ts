import {
  Directive,
  HostListener,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { AbstractStyledDirective } from '@crm-project/ui/core/abstract-styled-directive';

const style = /* css */ `
  .lib-input {
    border: solid 1px var(--theme-color-text-primary);
    width: 200px;
    border-radius: 0.25rem;
    padding: 0.35rem 0.75rem;
  }

  .lib-input:focus {
    outline: 0;
    box-shadow: 0 0 0 1px #929292;
  }

  .lib-input::placeholder {
    opacity: 0.4;
  }

  .lib-input--small {
    width: 150px;
  }
    
  .lib-input--full {
    width: 100%;
  }
`;

type Size = 'small' | 'full';

@Directive({
  selector: 'input[libInput]',
  host: {
    '[attr.data-lib-component]': 'componentName',
    class: 'lib-input',
    '[class.lib-input--small]': 'size() === "small"',
    '[class.lib-input--full]': 'size() === "full"',
    '[class.lib-input--has-value]': 'hasValue()',
  },
})
export class LibInputDirective
  extends AbstractStyledDirective
  implements OnInit, OnDestroy
{
  size = input<Size>();
  componentName = 'input';
  componentStyles = style;
  hasValue = signal(false);

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.hasValue.set(!!value);
  }

  ngOnInit() {
    this.loadStyles(this.componentStyles, this.componentName);
  }

  ngOnDestroy() {
    this.removeStyles(this.componentName);
  }
}
