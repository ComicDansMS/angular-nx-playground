import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export abstract class BaseStyledDirective {
  document = inject(DOCUMENT);

  abstract name: string;
  abstract componentStyles: string;
  abstract id: string;

  private static componentRegistry = new Map<
    string,
    { element: HTMLStyleElement; count: number }
  >();

  loadStyles(): void {
    const existing = BaseStyledDirective.componentRegistry.get(this.id);

    if (existing) {
      existing.count++;
    } else {
      const styleElement = this.document.createElement('style');
      styleElement.setAttribute('data-lib-style', this.id);
      styleElement.textContent = this.componentStyles;

      this.document.head.appendChild(styleElement);

      BaseStyledDirective.componentRegistry.set(this.id, {
        element: styleElement,
        count: 1,
      });
    }
  }

  removeStyles(): void {
    const existing = BaseStyledDirective.componentRegistry.get(this.id);

    if (existing) {
      existing.count--;

      if (existing.count === 0) {
        this.document.head.removeChild(existing.element);
        BaseStyledDirective.componentRegistry.delete(this.id);
      }
    }
  }

  makeId() {
    return this.name;
  }
}
