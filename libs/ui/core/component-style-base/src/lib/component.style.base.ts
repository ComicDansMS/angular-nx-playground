import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class ComponentStyleBase {
  abstract componentStyles: string;

  private styleElement: HTMLStyleElement | null = null;

  private minifyCss(css: string): string {
    return css.replace(/\s+/g, ' ').trim();
  }

  /**
   * Load style content into the DOM
   */
  loadStyles() {
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.setAttribute('type', 'text/css');
      document.head.appendChild(this.styleElement);
    }

    this.styleElement.textContent = this.minifyCss(this.componentStyles);
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
