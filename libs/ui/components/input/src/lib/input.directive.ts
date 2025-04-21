import { Directive, input, OnDestroy, OnInit } from '@angular/core';
import { style } from './input.style';
import { BaseStyledDirective } from '@crm-project/ui/base-styled-directive';
import * as shortUuid from 'short-uuid';

type Size = 'small' | 'full';

@Directive({
  selector: 'input[libInput]',
  host: {
    '[id]': 'id',
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
  id = 'input-' + shortUuid.generate().substring(0, 5);
  componentStyles = style;

  ngOnInit() {
    this.loadStyles();
  }

  ngOnDestroy() {
    this.removeStyles();
  }
}
