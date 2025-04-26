import { Directive, OnDestroy, OnInit } from '@angular/core';
import { AbstractStyledDirective } from '@crm-project/ui/core/abstract-styled-directive';

const style = /* css */ `
  .lib-label {

  }
`;

@Directive({
  selector: 'label[libLabel]',
  host: {
    '[attr.data-lib-component]': 'name',
    class: 'lib-label',
  },
})
export class LibLabelDirective
  extends AbstractStyledDirective
  implements OnInit, OnDestroy
{
  name = 'label';
  componentStyles = style;

  ngOnInit() {
    this.loadStyles();
  }

  ngOnDestroy() {
    this.removeStyles();
  }
}
