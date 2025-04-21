import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class BaseStyledDirective {
  abstract name: string;
  abstract componentStyles: string;
  abstract id: string;

  private styleElement: HTMLStyleElement | null = null;

  loadStyles(): void {
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.setAttribute('type', 'text/css');
      this.styleElement.setAttribute('lib-component', `${this.id}`);
      document.head.appendChild(this.styleElement);
    }

    this.styleElement.textContent = this.componentStyles;
  }

  removeStyles(): void {
    if (this.styleElement && document.head.contains(this.styleElement)) {
      document.head.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }
}
