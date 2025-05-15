import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { DOCUMENT } from '@angular/common';

function setMatchMediaMock(colorScheme = 'light') {
  return jest.fn().mockImplementation((query) => ({
    matches: query === `(prefers-color-scheme: ${colorScheme})`,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    onchange: null,
    dispatchEvent: jest.fn(),
  }));
}

function expectThemeToBe(
  themeService: ThemeService,
  document: Document,
  theme: string
) {
  const oppositeTheme = theme === 'dark' ? 'light' : 'dark';
  expect(themeService.theme()).toBe(`${theme}`);
  expect(document.body.classList.contains(`theme-${theme}`)).toBe(true);
  expect(document.body.classList.contains(`theme-${oppositeTheme}`)).toBe(
    false
  );
}

describe('ThemeService', () => {
  let themeService: ThemeService;
  let document: Document;

  const originalLocalStorage = window.localStorage;
  const originalMatchMedia = window.matchMedia;

  const localStorageMock = {
    store: {} as { [key: string]: string },
    getItem: jest.fn(function (key: string) {
      return this.store[key] || null;
    }),
    setItem: jest.fn(function (key: string, value: string) {
      this.store[key] = value.toString();
    }),
    removeItem: jest.fn(function (key: string) {
      delete this.store[key];
    }),
    clear: jest.fn(function () {
      this.store = {};
    }),
  };

  const matchMediaMock = setMatchMediaMock();

  function setupTest(
    options: { localStorageTheme?: string; prefersColorScheme?: string } = {}
  ) {
    if (options.localStorageTheme) {
      window.localStorage.setItem('lib-theme', options.localStorageTheme);
    }

    if (options.prefersColorScheme) {
      const updatedMatchMediaMock = setMatchMediaMock(
        options.prefersColorScheme
      );

      Object.defineProperty(window, 'matchMedia', {
        value: updatedMatchMediaMock,
        writable: true,
      });
    }

    themeService = TestBed.inject(ThemeService);
  }

  beforeEach(() => {
    localStorageMock.clear();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    Object.defineProperty(window, 'matchMedia', {
      value: matchMediaMock,
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [ThemeService],
    });

    document = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
    });
    Object.defineProperty(window, 'matchMedia', { value: originalMatchMedia });
  });

  it('should set the default theme to light when no localStorage or OS preference is set', () => {
    setupTest();

    expectThemeToBe(themeService, document, 'light');
  });

  it('should set the theme to dark when OS preference is dark', () => {
    setupTest({ prefersColorScheme: 'dark' });

    expectThemeToBe(themeService, document, 'dark');
  });

  it('should set the theme to light when localStorage preference is light', () => {
    setupTest({ localStorageTheme: 'light' });

    expectThemeToBe(themeService, document, 'light');
  });

  it('should set the theme to dark when localStorage preference is dark', () => {
    setupTest({ localStorageTheme: 'dark' });

    expectThemeToBe(themeService, document, 'dark');
  });

  it('should prioritise localStorage (light) over OS preference (dark)', () => {
    setupTest({ localStorageTheme: 'light', prefersColorScheme: 'dark' });

    expectThemeToBe(themeService, document, 'light');
  });

  it('should correctly cycle themes through multiple toggles', () => {
    setupTest();

    expect(themeService.theme()).toBe('light');

    themeService.toggleTheme$.next();

    expectThemeToBe(themeService, document, 'dark');
    expect(window.localStorage.getItem('lib-theme')).toBe('dark');

    themeService.toggleTheme$.next();

    expectThemeToBe(themeService, document, 'light');
    expect(window.localStorage.getItem('lib-theme')).toBe('light');

    themeService.toggleTheme$.next();

    expectThemeToBe(themeService, document, 'dark');
    expect(window.localStorage.getItem('lib-theme')).toBe('dark');
  });

  it('should fall back to OS preference (dark) if localStorage theme is invalid', () => {
    setupTest({
      localStorageTheme: 'invalid-theme',
      prefersColorScheme: 'dark',
    });
    expectThemeToBe(themeService, document, 'dark');
  });

  it('should fall back to default theme (light) if localStorage and OS preference are not definitive', () => {
    setupTest({ localStorageTheme: 'invalid-theme' });
    expectThemeToBe(themeService, document, 'light');
  });

  it('should not store theme preference if toggle is not triggered', () => {
    setupTest();
    expect(window.localStorage.getItem('lib-theme')).toBe(null);
  });
});
