import { Directive, OnDestroy, OnInit } from '@angular/core';
import { style } from './card.style';
import { BaseStyledDirective } from '@crm-project/ui/base-styled-directive';

@Directive({
  selector: 'div[libCard]',
  host: {
    '[attr.data-lib-component]': 'id',
    class: 'lib-card',
  },
})
export class LibCardDirective
  extends BaseStyledDirective
  implements OnInit, OnDestroy
{
  name = 'card';
  id = this.makeId();
  componentStyles = style;

  ngOnInit() {
    this.loadStyles();
  }

  ngOnDestroy() {
    this.removeStyles();
  }
}
