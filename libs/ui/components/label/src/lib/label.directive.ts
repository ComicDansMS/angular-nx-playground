import { Directive, OnDestroy, OnInit } from '@angular/core';
import { AbstractStyledDirective } from '@crm-project/ui/core/abstract-styled-directive';

const style = /* css */ `
  .lib-label {
    font-size: 14px;
    opacity: 0.5;
  }
`;

@Directive({
  selector: 'label[libLabel]',
  host: {
    '[attr.data-lib-component]': 'componentName',
    class: 'lib-label',
  },
})
export class LibLabelDirective
  extends AbstractStyledDirective
  implements OnInit, OnDestroy
{
  componentName = 'label';
  componentStyles = style;

  ngOnInit() {
    this.loadStyles(this.componentStyles, this.componentName);
  }

  ngOnDestroy() {
    this.removeStyles(this.componentName);
  }
}
