import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class BaseStyledDirective {
  abstract name: string;
  abstract componentStyles: string;

  private styleElement: HTMLStyleElement | null = null;

  /**
   * Load style content into the DOM
   */
  loadStyles() {
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.setAttribute('type', 'text/css');
      this.styleElement.setAttribute('lib-component', this.name);
      document.head.appendChild(this.styleElement);
    }

    this.styleElement.textContent = this.componentStyles;
  }

  /**
   * Remove the style element from the DOM
   */
  removeStyles() {
    if (this.styleElement && document.head.contains(this.styleElement)) {
      document.head.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }
}
