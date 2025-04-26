import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export abstract class AbstractStyledDirective {
  document = inject(DOCUMENT);

  abstract name: string;
  abstract componentStyles: string;

  private static componentRegistry = new Map<
    string,
    { element: HTMLStyleElement; count: number }
  >();

  loadStyles(): void {
    const existing = AbstractStyledDirective.componentRegistry.get(this.name);

    if (existing) {
      existing.count++;
    } else {
      const styleElement = this.document.createElement('style');
      styleElement.setAttribute('data-lib-style', this.name);
      styleElement.textContent = this.componentStyles;

      this.document.head.appendChild(styleElement);

      AbstractStyledDirective.componentRegistry.set(this.name, {
        element: styleElement,
        count: 1,
      });
    }
  }

  removeStyles(): void {
    const existing = AbstractStyledDirective.componentRegistry.get(this.name);

    if (existing) {
      existing.count--;

      if (existing.count === 0) {
        this.document.head.removeChild(existing.element);
        AbstractStyledDirective.componentRegistry.delete(this.name);
      }
    }
  }
}
