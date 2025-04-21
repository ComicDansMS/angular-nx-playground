import { Directive, OnDestroy, OnInit } from '@angular/core';
import { style } from './banana.style';
import { ComponentStyleBase } from '@crm-project/ui/core/component-style-base';

@Directive({
  selector: 'div[libBanana]',
  host: {
    class: 'lib-banana',
  },
})
export class LibBananaDirective
  extends ComponentStyleBase
  implements OnInit, OnDestroy
{
  name = 'banana';
  componentStyles = style;

  ngOnInit() {
    this.loadStyles();
  }

  ngOnDestroy() {
    this.removeStyles();
  }
}
