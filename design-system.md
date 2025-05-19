### Design Tokens

#### Colors

```
:root {
  --color-primary-50: ?;
  --color-primary-100: ?;
  /* ... and so on */

  --color-secondary-50: ?;
  --color-secondary-100: ?;
  /* ... and so on */

  --color-neutral-50: ?;
  --color-neutral-100: ?;
  /* ... and so on */

  /* Semantic/Functional Colors */
  --color-success: ?;
  --color-error: ?;
  --color-warning: ?;
  --color-info: ?;

  /* Text Colors */
  --color-text-normal: ?;
  --color-text-secondary: ?;
  --color-text-on-primary: ?;
  --color-text-on-secondary: ?;

  /* Background Colors */
  --color-background-body: ?;
  --color-background-surface: ?; /* For cards, modals, etc. */
}
```

#### Typography

```
:root {
  --font-family-base: 'Inter', sans-serif;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semi-bold: 600;
  --font-weight-extra-bold: 800;

  --font-size-h1: 30px;
  --font-size-body-lg: 16px;
  --font-size-body-md: 14px;
  --font-size-caption: 10px;

  --line-height-default: ?;
  --line-height-heading: ?;
}
```

#### Spacing

```
:root {
  --space-unit: 8px;

  --space-xxs: calc(var(--space-unit) / 4);
  --space-xs: calc(var(--space-unit) / 2);
  --space-sm: var(--space-unit);
  --space-md: calc(var(--space-unit) * 2);
  --space-lg: calc(var(--space-unit) * 3);
  --space-xl: calc(var(--space-unit) * 4);
  --space-xxl: calc(var(--space-unit) * 6);
  --space-xxxl: calc(var(--space-unit) * 8);
}
```

#### Border

```
:root {
  --border: solid 1px var(--color-neutral-300);
}
```

#### Border radius

```
:root {
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  --border-radius-full: 50%;
}
```

#### Shadows

```
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.16);
}
```

#### Transitions

```
:root {
  --transition-duration-fast: 150;
  --transition-duration-medium: 300;
  --transition-duration-slow: 500;
}
```

#### Breakpoints

These values are arbitrary and will be resolved during development

```
:root {
  --breakpoint-xs: 350px;
  --breakpoint-sm: 500px;
  --breakpoint-md: 750px;
  --breakpoint-lg: 1000px;
  --breakpoint-xl: 1200px;
}
```

#### Z-index

```
:root {
  --z-index-base: 0; /* Default stacking context */
  --z-index-header: 10; /* header */
  --z-index-sidebar: 20; /* sidebar */
  --z-index-modal: 1000; /* modals */
  --z-index-tooltip: 1010; /* tooltips, which should be above modals */
  --z-index-notification: 2000; /* notifications */
}
```

#### Sizing (icon sizes, images, etc)

These values are arbitrary and will be resolved during development

```
:root {
  --size-icon-sm: 16px;
  --size-icon-md: 24px;
  --size-icon-lg: 32px;

  --size-avatar-sm: 40px;
  --size-avatar-md: 60px;
  --size-avatar-lg: 80px;
}
```
