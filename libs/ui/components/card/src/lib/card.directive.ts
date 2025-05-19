import { Directive, OnDestroy, OnInit } from '@angular/core';
import { AbstractStyledDirective } from '@ngnx-playground/ui/core/abstract-styled-directive';

const style = /* css */ `
  .lib-card {
    background: var(--theme-color-background-surface);
    box-shadow: var(--theme-shadow-md);
    padding: 2rem;
    border-radius: var(--theme-border-radius-lg);
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
