import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
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
      TestBed.configureTestingModule({
        providers: [ThemeService],
      });

      service = TestBed.inject(ThemeService);
      document = TestBed.inject(DOCUMENT);
    });

    describe('State', () => {
      it('should initialize themeType state correctly', () => {
        expect(service.themeType()).toBe('light');
      });

      it('should initialize themeCss state correctly', () => {
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

    describe('Document style element', () => {
      it('should create the style element and add to document head', () => {
        const styleElement = document.querySelector('[data-lib-theme="light"]');

        expect(styleElement?.tagName).toBe('STYLE');
        expect(document.head.contains(styleElement)).toBe(true);
      });

      it('should match the theme CSS with the style element CSS', () => {
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

      it('should update CSS in the style element on theme toggle', () => {
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

    describe('Methods', () => {
      it('should generate valid CSS when tokens passed to generateCssFromTokens()', async () => {
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
  });

  describe('Theme injection', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ThemeService],
      });

      service = TestBed.inject(ThemeService);
      document = TestBed.inject(DOCUMENT);
    });

    it('should initialize state with injected light theme', () => {
      const lightThemeCss = service.generateCssFromTokens(testLightTheme.tokens);

      expect(service.themeCss()).toBe(lightThemeCss);
      expect(service.themeType()).toBe('light');
    });

    it('should load injected dark theme when theme is toggled', () => {
      const darkThemeCss = service.generateCssFromTokens(testDarkTheme.tokens);

      service.toggleTheme$.next();

      expect(service.themeType()).toBe('dark');
      expect(service.themeCss()).toBe(darkThemeCss);
    });
  });
});
