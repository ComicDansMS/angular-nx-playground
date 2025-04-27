import { TestBed } from '@angular/core/testing';
import { DARK_THEME, LIGHT_THEME, ThemeService } from './theme.service';
import { DOCUMENT } from '@angular/common';
import cssValidator from 'w3c-css-validator';
import { lightTheme as defaultLightTheme } from '@crm-project/ui/themes/light-theme';
import { darkTheme as defaultDarkTheme } from '@crm-project/ui/themes/dark-theme';
import { testLightTheme } from './test-themes/test-light.theme';
import { testDarkTheme } from './test-themes/test-dark.theme';

describe('ThemeService', () => {
  let service: ThemeService;
  let document: Document;

  describe('Default theme', () => {
    beforeEach(() => {
      localStorage.removeItem('lib-theme');

      TestBed.configureTestingModule({
        providers: [ThemeService],
      });

      service = TestBed.inject(ThemeService);
      document = TestBed.inject(DOCUMENT);
    });

    describe('State', () => {
      it('should initialise themeType state correctly', () => {
        expect(service.themeType()).toBe('light');
      });

      it('should initialise themeCss state correctly', () => {
        const lightThemeCss = service.generateCssFromTokens(defaultLightTheme.tokens);

        expect(service.themeCss()).toBe(lightThemeCss);
      });

      it('should update themeType state when theme is toggled', () => {
        expect(service.themeType()).toBe('light');
        service.toggleTheme$.next();
        expect(service.themeType()).toBe('dark');
        service.toggleTheme$.next();
        expect(service.themeType()).toBe('light');
      });

      it('should update themeCss state when theme is toggled', () => {
        const lightThemeCss = service.generateCssFromTokens(defaultLightTheme.tokens);
        const darkThemeCss = service.generateCssFromTokens(defaultDarkTheme.tokens);

        expect(service.themeCss()).toBe(lightThemeCss);
        service.toggleTheme$.next();
        expect(service.themeCss()).toBe(darkThemeCss);
        service.toggleTheme$.next();
        expect(service.themeCss()).toBe(lightThemeCss);
      });
    });

    describe('Methods', () => {
      it('should generate valid CSS when generateCssFromTokens() is provided with theme tokens', async () => {
        const generatedCss = service.generateCssFromTokens(defaultLightTheme.tokens);
        const validation = await cssValidator.validateText(generatedCss);

        if (!validation.valid) {
          const validationErrors = validation.errors
            .map((error) => `Line ${error.line}: ${error.message}`)
            .join('\n');

          throw new Error(`CSS validation errors:\n${validationErrors}`);
        }

        expect(validation.valid).toBe(true);
      });
    });

    describe('Style element', () => {
      it('should create the style element and add to document head', () => {
        const styleElement = document.querySelector('[data-lib-theme="light"]');

        expect(styleElement?.tagName).toBe('STYLE');
        expect(document.head.contains(styleElement)).toBe(true);
      });

      it('should match the style element CSS with the theme CSS', () => {
        const styleElement = document.querySelector('[data-lib-theme="light"]');
        const styleContent = styleElement?.textContent?.trim() || '';
        const themeCss = service.themeCss()?.trim();

        expect(styleContent).toBe(themeCss);
      });

      it('should have valid CSS in the style element', async () => {
        const styleElement = document.querySelector('[data-lib-theme="light"]');
        const styleContent = styleElement?.textContent || '';
        const validation = await cssValidator.validateText(styleContent);

        if (!validation.valid) {
          const validationErrors = validation.errors
            .map((error) => `Line ${error.line}: ${error.message}`)
            .join('\n');

          throw new Error(`CSS validation errors:\n${validationErrors}`);
        }

        expect(validation.valid).toBe(true);
      });

      it('should update the style element when theme is toggled', () => {
        const lightThemeElement = document.querySelector('[data-lib-theme="light"]');
        const lightThemeElementContent = lightThemeElement?.textContent?.trim() || '';
        const lightThemeCss = service.generateCssFromTokens(defaultLightTheme.tokens).trim();

        expect(lightThemeElementContent).toBe(lightThemeCss);
        service.toggleTheme$.next();

        const darkThemeElement = document.querySelector('[data-lib-theme="dark"]');
        const darkThemeElementContent = darkThemeElement?.textContent?.trim() || '';
        const darkThemeCss = service.generateCssFromTokens(defaultDarkTheme.tokens).trim();

        expect(darkThemeElementContent).toBe(darkThemeCss);
      });
    });
  });

  describe('Theme injection', () => {
    beforeEach(() => {
      localStorage.removeItem('lib-theme');

      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: LIGHT_THEME, useValue: testLightTheme },
          { provide: DARK_THEME, useValue: testDarkTheme },
        ],
      });

      service = TestBed.inject(ThemeService);
      document = TestBed.inject(DOCUMENT);
    });

    it('should initialise state with the injected light theme', () => {
      const defaultLightThemeCss = service.generateCssFromTokens(defaultLightTheme.tokens);
      const testLightThemeCss = service.generateCssFromTokens(testLightTheme.tokens);

      expect(service.themeCss()).not.toBe(defaultLightThemeCss);
      expect(service.themeCss()).toBe(testLightThemeCss);
      expect(service.themeType()).toBe('light');
    });

    it('should switch to the injected dark theme when theme is toggled', () => {
      const defaultDarkThemeCss = service.generateCssFromTokens(defaultDarkTheme.tokens);
      const testDarkThemeCss = service.generateCssFromTokens(testDarkTheme.tokens);

      service.toggleTheme$.next();

      expect(service.themeCss()).not.toBe(defaultDarkThemeCss);
      expect(service.themeCss()).toBe(testDarkThemeCss);
      expect(service.themeType()).toBe('dark');
    });
  });
});
