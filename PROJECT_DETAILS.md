# Angular NX Playground Project Details

## Overview
This is an Angular 19 monorepo application built with NX 20.8.0, using a modern Angular setup with standalone components, the new input syntax, control flow `@if`/`@for` syntax, and signals. The project demonstrates a theme switching mechanism using CSS variables, Angular signals, and dependency injection, along with a reusable UI component library.

## Versions and Technologies
- **Angular**: 19.2.0
- **NX**: 20.8.0
- **TailwindCSS**: 4.1.4
- **TypeScript**: 5.7.2
- **Testing**: Jest 29.7.0 for unit tests, Playwright for e2e

## Modern Angular Features
- **Standalone Components**: All components use the standalone approach
- **New Input/Output Syntax**: Uses the new `input()` and `output()` functions
- **New Control Flow**: Uses the modern `@if`/`@else` and `@for` syntax instead of `*ngIf`/`*ngFor`
- **Signals**: Uses Angular's signal API for reactive state management
- **Injectable DI**: Uses `inject()` function instead of constructor injection
- **Directives for Components**: Uses directive-based approach for reusable UI elements
- **Dynamic CSS Injection**: Custom system for component-level CSS injection

## Project Structure

```
- /Users/daniel/dev/experimentation/@ngnx-playground/
  - CLAUDE.md                          # Instructions for Claude
  - PROJECT_DETAILS.md                 # This file
  - README.md
  - apps/                              # Contains all applications
    - @ngnx-playground/           # Main application
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
  - libs/                              # Contains all libraries
    - ui/
      - components/                    # UI components library
        - button/                      # Button directive implementation
          - src/
            - lib/
              - button.directive.ts    # Button directive
              - button.style.ts        # Button styles
        - input/                       # Input directive implementation
          - src/
            - lib/
              - input.directive.ts     # Input directive
              - input.style.ts         # Input styles
      - core/                          # Core UI functionality
        - component-style-base/        # Base class for component styling
          - src/
            - lib/
              - component.style.base.ts # Abstract base class for styles
        - interfaces/                  # Interface definitions
          - src/
            - lib/
              - theme-type.type.ts     # Theme type definition
              - theme.interface.ts     # Theme interface definition
              - tokens.interface.ts    # Theme tokens interface
        - theme-provider/              # Theme provider component
          - src/
            - lib/
              - theme-provider.component.ts # Theme provider component
        - theme-service/               # Theme service
          - src/
            - lib/
              - theme.service.ts       # Service for theme management
      - themes/                        # Theme definitions
        - dark-theme/                  # Dark theme library
          - src/
            - lib/
              - dark.theme.ts          # Dark theme token definitions
        - light-theme/                 # Light theme library
          - src/
            - lib/
              - light.theme.ts         # Light theme token definitions
  - nx.json                            # NX workspace configuration
  - package-lock.json
  - package.json
  - tsconfig.base.json                 # Base TypeScript configuration with path aliases
```

## Key Files and Components

### Project Configuration
- **package.json**: Contains dependencies including Angular 19.2.0, NX 20.8.0, TailwindCSS 4.1.4
- **nx.json**: NX workspace configuration with targets, cache settings, and plugin configuration
- **tsconfig.base.json**: Base TypeScript configuration with path mappings for libraries and components

### UI Component Library Architecture

The project implements a sophisticated component library with a unique styling approach:

1. **Component Style Base** (`/libs/ui/core/component-style-base/src/lib/component.style.base.ts`)
   - Abstract base class for component styling
   - Dynamically injects CSS into the DOM via `<style>` elements
   - Provides lifecycle methods for loading and removing styles
   ```typescript
   export abstract class ComponentStyleBase {
     abstract componentStyles: string;
     
     loadStyles() {
       // Creates and injects a style element into document.head
     }
     
     removeStyles() {
       // Removes the style element from document.head
     }
   }
   ```

2. **Component Style Implementation** (e.g., `button.style.ts`, `input.style.ts`)
   - Extends the base ComponentStyleBase class
   - Defines component-specific CSS as a template literal
   - Injected as a provider in the corresponding directive
   ```typescript
   @Injectable()
   export class ButtonStyle extends ComponentStyleBase {
     componentStyles = /* css */ `
       .lib-button {
         background: var(--theme-color-button-primary);
         // other styles...
       }
     `;
   }
   ```

3. **Directive Implementation** (e.g., `button.directive.ts`, `input.directive.ts`)
   - Uses directive selectors like `button[libButton]` or `input[libInput]`
   - Injects the corresponding style class
   - Manages the style lifecycle with `ngOnInit()` and `ngOnDestroy()`
   - Uses Angular's host bindings for class application
   ```typescript
   @Directive({
     selector: 'button[libButton]',
     host: {
       class: 'lib-button',
       '[class.lib-button--type-secondary]': 'variant() === "secondary"',
       // other conditional classes...
     },
     providers: [ButtonStyle],
   })
   export class LibButtonDirective implements OnInit, OnDestroy {
     private componentStyle = inject(ButtonStyle);
     variant = input<ButtonVariant>();
     
     ngOnInit() {
       this.componentStyle.loadStyles();
     }
     
     ngOnDestroy() {
       this.componentStyle.removeStyles();
     }
   }
   ```

### Theme System Architecture

The application implements a comprehensive theme system that integrates with the component library:

1. **Theme Tokens Interface** (`/libs/ui/core/interfaces/src/lib/tokens.interface.ts`)
   ```typescript
   export interface Tokens {
     '--theme-color-background-primary': string;
     '--theme-color-text-primary': string;
     '--theme-color-button-primary': string;
     '--theme-color-button-primary-hover': string;
     '--theme-color-button-secondary': string;
     '--theme-color-button-secondary-hover': string;
   }
   ```

2. **Theme Service** (`/libs/ui/core/theme-service/src/lib/theme.service.ts`)
   - Uses Angular signals for reactive state management
   - Manages theme toggling and CSS variable injection
   - Uses dependency injection tokens for theme configurations

3. **Theme Provider Component** (`/libs/ui/core/theme-provider/src/lib/theme-provider.component.ts`)
   - Wrapper component that initializes the theme service
   - Used in the app root to provide theming context

4. **Theme Definitions**
   - Dark and light themes defined in separate libraries
   - CSS variables following naming convention `--theme-color-*`
   - Component styles reference these variables (e.g., `var(--theme-color-button-primary)`)

5. **Theme Toggle Component** (`/apps/@ngnx-playground/src/app/theme-toggle/theme-toggle.component.ts`)
   - Uses the new input/output syntax (`input()`, `output()`)
   - Uses modern `@if` syntax for conditional rendering
   - Integrates with UI component library (`libButton`)

### Application Integration

The home component demonstrates how the UI components and theming are used together:

```typescript
@Component({
  selector: 'app-home',
  template: `
    <div class="flex gap-4 flex-col items-center w-96 mx-auto border border-slate-300 rounded-lg shadow p-4">
      <app-theme-toggle
        [themeType]="themeService.themeType()"
        (toggleTheme)="themeService.toggleTheme$.next()"
      />

      <p>It's very {{ themeService.themeType() }}</p>

      <input type="text" libInput placeholder="input.." />

      <button libButton [width]="'full'">Big Button</button>
      <button libButton [variant]="'secondary'">Secondary</button>
    </div>
  `,
  imports: [ThemeToggleComponent, LibInputDirective, LibButtonDirective],
})
export default class HomeComponent {
  themeService = inject(ThemeService);
}
```

## CSS Architecture

The project uses a hybrid styling approach:

1. **Component-specific styles**:
   - BEM-like naming convention (`.lib-button`, `.lib-button--type-secondary`)
   - Dynamically injected into the DOM at component lifecycle hooks
   - Each component's styles are isolated to their specific elements

2. **Theme variables**:
   - Global CSS variables injected at `:root` by the theme service
   - Component styles reference these variables

3. **TailwindCSS**:
   - Used for layout and utility classes
   - Applied directly in component templates

## Development Commands

```
# Build the application
npx nx build @ngnx-playground
npx nx build @ngnx-playground --configuration=development

# Serve the application
npx nx serve @ngnx-playground

# Lint a project
npx nx lint [project-name]

# Run tests
npx nx test [project-name]
npx nx test [project-name] --testFile=path/to/test.spec.ts
```

## Code Style and Conventions
- Component files: `component-name.component.ts`
- Service files: `service-name.service.ts`
- Directive files: `directive-name.directive.ts`
- Component selectors: kebab-case with 'app' prefix (`app-component-name`)
- Directive selectors: camelCase with 'lib' prefix for library directives (`libDirectiveName`)
- Import paths: Uses aliases defined in tsconfig.base.json
- CSS naming: BEM-like convention for component styles
