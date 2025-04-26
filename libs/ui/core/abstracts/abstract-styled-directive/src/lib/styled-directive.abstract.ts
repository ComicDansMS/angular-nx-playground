import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export abstract class AbstractStyledDirective {
  document = inject(DOCUMENT);

  abstract componentName: string;
  abstract componentStyles: string;

  private static componentRegistry = new Map<
    string,
    { element: HTMLStyleElement; count: number }
  >();

  loadStyles(styles: string, identifier: string): void {
    const existing = AbstractStyledDirective.componentRegistry.get(identifier);

    if (existing) {
      existing.count++;
    } else {
      const styleElement = this.document.createElement('style');
      styleElement.setAttribute('data-lib-style', identifier);
      styleElement.textContent = styles;

      this.document.head.appendChild(styleElement);

      AbstractStyledDirective.componentRegistry.set(identifier, {
        element: styleElement,
        count: 1,
      });
    }
  }

  removeStyles(identifier: string): void {
    const existing = AbstractStyledDirective.componentRegistry.get(identifier);

    if (existing) {
      existing.count--;

      if (existing.count === 0) {
        this.document.head.removeChild(existing.element);
        AbstractStyledDirective.componentRegistry.delete(identifier);
      }
    }
  }
}
