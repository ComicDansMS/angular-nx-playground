import { Directive, inject, input, OnDestroy, OnInit } from '@angular/core';
import { InputStyle } from './input.style';

type Size = 'small' | 'large';

@Directive({
  selector: 'input[libInput]',
  host: {
    class: 'lib-input',
    '[class.lib-input--small]': 'size() === "small"',
    '[class.lib-input--large]': 'size() === "large"',
  },
  providers: [InputStyle],
})
export class LibInputDirective implements OnInit, OnDestroy {
  private componentStyle = inject(InputStyle);

  size = input<Size>();

  ngOnInit() {
    this.componentStyle.loadStyles();
  }

  ngOnDestroy() {
    this.componentStyle.removeStyles();
  }
}
