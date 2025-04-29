import { Directive, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractStyledDirective } from '@crm-project/ui/core/abstract-styled-directive';

const style = /* css */ `
  .lib-input {
    border: solid 1px #4c4d53;
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

  .lib-input.ng-invalid:not(.ng-untouched) {
    border-color: #8a4c4d;
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
  },
})
export class LibInputDirective
  extends AbstractStyledDirective
  implements OnInit, OnDestroy
{
  size = input<Size>();
  componentName = 'input';
  componentStyles = style;

  ngOnInit() {
    this.loadStyles(this.componentStyles, this.componentName);
  }

  ngOnDestroy() {
    this.removeStyles(this.componentName);
  }
}
