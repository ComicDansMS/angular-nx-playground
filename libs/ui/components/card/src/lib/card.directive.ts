import { Directive, OnDestroy, OnInit } from '@angular/core';
import { AbstractStyledDirective } from '@crm-project/ui/core/abstract-styled-directive';

const style = /* css */ `
  .lib-card {
    box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
    padding: 2rem;
    border-radius: 1rem;
  }
`;

@Directive({
  selector: 'div[libCard]',
  host: {
    '[attr.data-lib-component]': 'id',
    class: 'lib-card',
  },
})
export class LibCardDirective
  extends AbstractStyledDirective
  implements OnInit, OnDestroy
{
  name = 'card';
  componentStyles = style;

  ngOnInit() {
    this.loadStyles();
  }

  ngOnDestroy() {
    this.removeStyles();
  }
}
