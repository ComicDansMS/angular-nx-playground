import { Directive, OnDestroy, OnInit } from '@angular/core';
import { style } from './card.style';
import { BaseStyledDirective } from '@crm-project/ui/base-styled-directive';
import * as shortUuid from 'short-uuid';

@Directive({
  selector: 'div[libCard]',
  host: {
    '[id]': 'id',
    class: 'lib-card',
  },
})
export class LibCardDirective
  extends BaseStyledDirective
  implements OnInit, OnDestroy
{
  name = 'card';
  id = 'button-' + shortUuid.generate().substring(0, 5);
  componentStyles = style;

  ngOnInit() {
    this.loadStyles();
  }

  ngOnDestroy() {
    this.removeStyles();
  }
}
