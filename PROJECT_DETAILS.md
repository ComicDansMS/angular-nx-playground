# Angular NX Playground Project Details

## Overview
This is an Angular 19 monorepo application built with NX 20.8.0, using a modern Angular setup with standalone components, the new input syntax, control flow `@if`/`@for` syntax, and signals. The project demonstrates a theme switching mechanism using CSS variables, Angular signals, and dependency injection.

## Versions and Technologies
- **Angular**: 19.2.0
- **NX**: 20.8.0
- **TailwindCSS**: 4.1.4
- **TypeScript**: 5.7.2
- **Testing**: Jest 29.7.0 for unit tests, Playwright for e2e

## Modern Angular Features
- **Standalone Components**: All components use the standalone: true syntax
- **New Control Flow**: Uses the modern `@if`/`@else` and `@for` syntax instead of `*ngIf`/`*ngFor`
- **Signals**: Uses Angular's signal API for reactive state management
- **Injectable DI**: Uses `inject()` function instead of constructor injection
- **Functional Providers**: Uses providers with the `provide` function
- **Lazy Loading**: Demonstrates route-level code splitting with dynamic imports

## Project Structure

```
- /Users/daniel/dev/experimentation/angular-nx-playground/
  - CLAUDE.md                          # Instructions for Claude
  - README.md
  - apps/                              # Contains all applications
    - angular-nx-playground/           # Main application
      - jest.config.ts
      - project.json                   # NX project configuration for this app
      - public/
        - favicon.ico
      - src/
        - app/
          - app.component.ts           # Root app component
          - app.config.ts              # App configuration with providers
          - app.routes.ts              # Application routes
          - home/
            - home.component.ts        # Home page component
          - nx-welcome.component.ts
          - theme-toggle/
            - theme-toggle.component.ts # Theme toggle component
        - index.html
        - main.ts                      # Application bootstrap
        - styles.css                   # Global styles with TailwindCSS
        - test-setup.ts
        - themes/                      # App-specific theme definitions
          - dark.theme.ts              # Dark theme tokens
          - light.theme.ts             # Light theme tokens
      - tsconfig.app.json
      - tsconfig.editor.json
      - tsconfig.json
      - tsconfig.spec.json
  - jest.config.ts
  - jest.preset.js
  - libs/                              # Contains all libraries
    - ui/
      - components/                    # UI components library (empty)
      - core/                          # Core UI functionality
        - interfaces/                  # Interface definitions
          - README.md
          - jest.config.ts
          - project.json
          - src/
            - index.ts
            - lib/
              - theme.interface.ts     # Theme interface definition
            - test-setup.ts
          - tsconfig.json
          - tsconfig.lib.json
          - tsconfig.spec.json
        - theme-provider/              # Theme provider component
          - README.md
          - jest.config.ts
          - project.json
          - src/
            - index.ts
            - lib/
              - theme-provider.component.spec.ts
              - theme-provider.component.ts
            - test-setup.ts
          - tsconfig.json
          - tsconfig.lib.json
          - tsconfig.spec.json
        - theme-service/               # Theme service
          - README.md
          - jest.config.ts
          - project.json
          - src/
            - index.ts
            - lib/
              - theme.service.ts       # Service for theme management
            - test-setup.ts
          - tsconfig.json
          - tsconfig.lib.json
          - tsconfig.spec.json
        - themes/                      # Theme definitions
          - dark-theme/                # Dark theme library
            - README.md
            - jest.config.ts
            - project.json
            - src/
              - index.ts
              - lib/
                - dark.theme.ts        # Dark theme token definitions
              - test-setup.ts
            - tsconfig.json
            - tsconfig.lib.json
            - tsconfig.spec.json
          - light-theme/               # Light theme library
            - README.md
            - jest.config.ts
            - project.json
            - src/
              - index.ts
              - lib/
                - light.theme.ts       # Light theme token definitions
              - test-setup.ts
            - tsconfig.json
            - tsconfig.lib.json
            - tsconfig.spec.json
  - nx.json                            # NX workspace configuration
  - package-lock.json
  - package.json
  - tsconfig.base.json                 # Base TypeScript configuration
```

## Key Files and Components

### Project Configuration
- **package.json**: Contains dependencies including Angular 19.2.0, NX 20.8.0, TailwindCSS 4.1.4
- **nx.json**: NX workspace configuration with targets, cache settings, and plugin configuration
- **tsconfig.base.json**: Base TypeScript configuration with path mappings for libraries

### Theme System Architecture

The application implements a comprehensive theme system:

1. **Theme Interface** (`/libs/ui/core/interfaces/src/lib/theme.interface.ts`)
   ```typescript
   export interface Theme {
     '--theme-color-background-primary': string;
     '--theme-color-text-primary': string;
   }
   ```

2. **Theme Service** (`/libs/ui/core/theme-service/src/lib/theme.service.ts`)
   - Uses Angular signals for reactive state management
   - Manages theme toggling and CSS variable injection
   - Uses dependency injection tokens for theme configurations

3. **Theme Provider Component** (`/libs/ui/core/theme-provider/src/lib/theme-provider.component.ts`)
   - Wrapper component that initializes the theme service
   - Used in the app root to provide theming

4. **Theme Definitions**
   - Dark and light themes defined in separate libraries
   - CSS variables following naming convention `--theme-color-*`
   - The application has its own theme definitions in `/apps/angular-nx-playground/src/themes/`

5. **Toggle Component** (`/apps/angular-nx-playground/src/app/theme-toggle/theme-toggle.component.ts`)
   - Uses modern `@if` syntax for conditional rendering
   - Demonstrates component-level signal consumption
   - Standalone component with direct injection

### Application Bootstrap and Configuration

The application uses the modern Angular standalone bootstrapping approach:

1. **Main Entry** (`/apps/angular-nx-playground/src/main.ts`)
   ```typescript
   import { bootstrapApplication } from '@angular/platform-browser';
   import { appConfig } from './app/app.config';
   import { AppComponent } from './app/app.component';

   bootstrapApplication(AppComponent, appConfig).catch((err) =>
     console.error(err)
   );
   ```

2. **App Configuration** (`/apps/angular-nx-playground/src/app/app.config.ts`)
   - Uses functional providers with `provideRouter`, `provideZoneChangeDetection`
   - Configures theme tokens with application-specific themes
   - Demonstrates modern dependency injection approach

3. **Routes Configuration** (`/apps/angular-nx-playground/src/app/app.routes.ts`)
   - Uses lazy loading pattern with dynamic imports
   - Modern route configuration with component imports

### Styling
- Uses TailwindCSS 4.1.4
- CSS variables for theming integrated with Tailwind
- Responsive design patterns in components

## Development Commands

```
# Build the application
npx nx build angular-nx-playground
npx nx build angular-nx-playground --configuration=development

# Serve the application
npx nx serve angular-nx-playground

# Lint a project
npx nx lint [project-name]

# Run tests
npx nx test [project-name]
npx nx test [project-name] --testFile=path/to/test.spec.ts
```

## Libraries and Code Organization

The project follows NX's monorepo approach with clear separation of concerns:

1. **Apps**: Contains the main application
2. **Libs**: Contains reusable libraries:
   - `ui/core/interfaces`: Common interfaces 
   - `ui/core/theme-provider`: Theme provider component
   - `ui/core/theme-service`: Theme management service
   - `ui/core/themes/dark-theme` & `light-theme`: Theme definitions

## Code Style and Conventions
- Component files: `component-name.component.ts`
- Service files: `service-name.service.ts`
- Component selectors:
  - App components: kebab-case with 'app' prefix (`app-component-name`)
  - Library components: kebab-case with 'lib' prefix (`lib-component-name`)
- Code formatting: Prettier with 130 char width, single quotes
- Import paths: Uses aliases defined in tsconfig.base.json