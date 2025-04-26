import { Directive, OnDestroy, OnInit } from '@angular/core';
import { AbstractStyledDirective } from '@crm-project/ui/core/abstract-styled-directive';

const style = /* css */ `
  .lib-card {
    box-shadow: var(--theme-color-shadow) 0 2px 8px 0;
    padding: 2rem;
    border-radius: 1rem;
  }
`;

@Directive({
  selector: 'div[libCard]',
  host: {
    '[attr.data-lib-component]': 'componentName',
    class: 'lib-card',
  },
})
export class LibCardDirective
  extends AbstractStyledDirective
  implements OnInit, OnDestroy
{
  componentName = 'card';
  componentStyles = style;

  ngOnInit() {
    this.loadStyles(this.componentStyles, this.componentName);
  }

  ngOnDestroy() {
    this.removeStyles(this.componentName);
  }
}
