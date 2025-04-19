# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npx nx build angular-nx-playground` (add `--configuration=development` for dev)
- Serve: `npx nx serve angular-nx-playground`
- Lint: `npx nx lint [project-name]`
- Test: `npx nx test [project-name]`
- Test single file: `npx nx test [project-name] --testFile=path/to/test.spec.ts`

## Code Style
- Format: Prettier with 130 char width, single quotes, bracket spacing
- Component files: `component-name.component.ts`
- Service files: `service-name.service.ts`
- Component selectors: kebab-case with 'app' prefix (`app-component-name`)
- Directive selectors: camelCase with 'app' prefix (`appDirectiveName`)
- Import paths: Use aliases defined in tsconfig.base.json
- Testing: Jest for unit tests, Playwright for e2e
- Project structure: Nx workspace with monorepo approach (apps/, libs/)