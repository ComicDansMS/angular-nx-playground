import { Directive, input, OnDestroy, OnInit } from '@angular/core';
import { style } from './input.style';
import { BaseStyledDirective } from '@crm-project/ui/base-styled-directive';

type Size = 'small' | 'full';

@Directive({
  selector: 'input[libInput]',
  host: {
    '[attr.data-lib-component]': 'id',
    class: 'lib-input',
    '[class.lib-input--small]': 'size() === "small"',
    '[class.lib-input--full]': 'size() === "full"',
  },
})
export class LibInputDirective
  extends BaseStyledDirective
  implements OnInit, OnDestroy
{
  size = input<Size>();

  name = 'input';
  id = this.makeId();
  componentStyles = style;

  ngOnInit() {
    this.loadStyles();
  }

  ngOnDestroy() {
    this.removeStyles();
  }
}
