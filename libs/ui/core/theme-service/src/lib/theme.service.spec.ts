import { TestBed } from '@angular/core/testing';
import { ThemeService, LIGHT_THEME } from './theme.service';
import { DOCUMENT } from '@angular/common';
import { lightTheme } from '@crm-project/ui/themes/light-theme';

describe('ThemeService', () => {
  let service: ThemeService;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: LIGHT_THEME, useValue: lightTheme }],
    });

    service = TestBed.inject(ThemeService);
    document = TestBed.inject(DOCUMENT);
  });

  describe('initialization', () => {
    let styleElement: HTMLStyleElement | null = null;

    beforeEach(() => {
      styleElement = document.getElementById(
        'crm-theme-tokens'
      ) as HTMLStyleElement;
    });

    it('should initialize with light theme by default', () => {
      expect(service.themeType()).toBe('light');
    });

    it('should create the style element and add to document head', () => {
      expect(styleElement).toBeTruthy();
      expect(styleElement?.tagName).toBe('STYLE');
      expect(document.head.contains(styleElement)).toBe(true);
    });

    it('the style element should contain CSS variables from light theme', () => {
      const styleContent = styleElement?.textContent || '';

      // Test the basic structure of the CSS
      expect(styleContent).toMatch(/:root \{[\s\S]+\}/);

      // Test each token from the actual light theme
      Object.entries(lightTheme.tokens).forEach(([key, value]) => {
        expect(styleContent).toContain(`${key}: ${value}`);
      });
    });
  });

  // TODO: Test theme toggling
  // - Calling toggleTheme$.next() should switch from light to dark theme
  // - Calling toggleTheme$.next() again should switch back to light theme
  // - The themeType computed signal should be updated accordingly
  // - The style element's content should be updated with new theme CSS variables

  // TODO: Test theme injection tokens
  // - Test overriding the default themes with custom themes
  // - Verify that toggling works with custom themes

  // TODO: Test CSS variable generation
  // - Test that generateCssVariables produces correct CSS string from tokens
  // - Verify format matches ":root {--var1: value1; --var2: value2; }"

  // TODO: Test DOM manipulation
  // - Verify style element is created with correct ID
  // - Verify style element is attached to document head
  // - Verify style element content is updated when theme changes

  // TODO: Test state management
  // - Verify state is properly initialized
  // - Verify state is updated correctly when theme is toggled

  // TODO: Test reactivity
  // - Verify that changes to theme trigger appropriate updates to DOM
  // - Test the reactive flow from toggleTheme$ to theme$ to DOM updates
});
