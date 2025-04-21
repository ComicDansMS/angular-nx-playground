import { Directive, OnDestroy, OnInit } from '@angular/core';
import { style } from './input.style';

@Directive({
  selector: 'input[libInput]',
  host: {
    class: 'lib-input',
  },
})
export class LibInputDirective implements OnInit, OnDestroy {
  styleElement: HTMLStyleElement | null = null;
  componentStyle = style;

  minifyCss(css: string): string {
    return css.replace(/\s+/g, ' ').trim();
  }

  ngOnInit() {
    console.log('hello');
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.setAttribute('type', 'text/css');
      document.head.appendChild(this.styleElement);
    }

    this.styleElement.textContent = this.minifyCss(this.componentStyle);
  }

  ngOnDestroy() {
    if (this.styleElement && document.head.contains(this.styleElement)) {
      document.head.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }
}
