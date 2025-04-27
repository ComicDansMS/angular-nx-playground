import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export abstract class AbstractStyledDirective {
  private document = inject(DOCUMENT);
  private static componentRegistry = new Map<
    string,
    { element: HTMLStyleElement; count: number }
  >();
  protected abstract componentName: string;
  protected abstract componentStyles: string;

  loadStyles(styles: string, identifier: string): void {
    const registryComponent =
      AbstractStyledDirective.componentRegistry.get(identifier);

    if (registryComponent) {
      registryComponent.count++;
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
    const registryComponent =
      AbstractStyledDirective.componentRegistry.get(identifier);

    if (registryComponent) {
      registryComponent.count--;

      if (registryComponent.count === 0) {
        this.document.head.removeChild(registryComponent.element);
        AbstractStyledDirective.componentRegistry.delete(identifier);
      }
    }
  }
}
