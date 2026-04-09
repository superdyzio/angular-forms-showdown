# CLAUDE.md — Angular Forms Showdown

## Project Purpose

Interactive presentation app comparing three Angular form approaches:
- **Template-Driven Forms** — `src/app/pages/template/`
- **Reactive Forms** — `src/app/pages/reactive/`
- **Signal-Based Forms** — `src/app/pages/signal/`

14 slide components live in `src/app/slides/`. The same complex user-registration form (dynamic addresses, async email validation, password strength, conditional fields) is implemented three times to make comparisons fair.

## Dev Commands

```bash
ng serve          # dev server at localhost:4200
ng build          # production build → dist/
ng build --watch  # watch mode (incremental rebuilds)
ng test           # Karma/Jasmine unit tests
```

Language can be switched via URL query param: `?lang=en` or `?lang=pl`

## Architecture Notes

- **Standalone components** throughout — no NgModules
- **Routing:** lazy-loaded pages, child routes for slides (`/slideshow/:slideNumber`)
- **i18n:** ngx-translate with source JSON files in `src/app/lang/` (en + pl), built to `assets/i18n/` at build time via `angular.json` asset config
- **Email validator:** `src/app/services/email-check.service.ts` — simulates 800 ms network delay; taken emails: `test@example.com`, `john@doe.com`, `jane@doe.com`
- **Performance benchmarks:** each form page has "Add 1k" / "Update 1k" buttons that time operations and log heap memory to the console

## Key Files

| File | Purpose |
|------|---------|
| `src/app/types/user.ts` | Shared `User` model + `UserForm` signal-based type (`WritableSignal<Address>[]`) |
| `src/app/types/address.ts` | Address sub-model for dynamic address list |
| `src/app/services/email-check.service.ts` | Simulated async email uniqueness check |
| `src/app/lang/en.json` | ~240 translation keys (source of truth for copy) |
| `src/app/app.routes.ts` | All routes including lazy-loaded slide children |
| `src/app/app.config.ts` | Application providers (TranslateService, Router, HttpClient) |
| `src/app/pages/main/main.component.ts` | Home / navigation hub page |
| `src/app/pages/slideshow/slideshow.component.ts` | Slide container with arrow-key navigation and progress tracking |
| `src/app/pages/template/template-email-async.validator.ts` | Custom async validator directive for template-driven email check |
| `docs/ANALYSIS.md` | Deep analysis: benchmarks, improvement ideas, slide suggestions |

## Git Conventions

- Do not include `Co-Authored-By` trailers in commit messages

## Conventions

- **TypeScript strict mode** — no `any`, no implicit returns
- **SCSS** per component (no global utility classes except `styles.scss`)
- **Prettier** config in `package.json`: printWidth 100, singleQuote, Angular HTML parser
- All user-visible strings go through ngx-translate — do not hardcode copy in templates
- Performance benchmark buttons use `console.time` / `console.timeEnd` and `performance.now()`

## Known Issues / TODOs

- Email validation regex is duplicated across four locations (three form components + `EmailCheckService`) — should be extracted to a shared validator
- Async email validator has no debounce — fires on every keystroke
- No `OnPush` change detection on any component
- Tests are minimal (1 spec file `app.spec.ts` with 2 test cases)
- Leftover TODO comments in `template.component.ts` about SolidJS comparison

## Slide Architecture

Slides are numbered `01`–`14` in `src/app/slides/`. Each is a standalone component rendered inside `SlideshowComponent`. Navigation uses `ActivatedRoute` param and arrow-key listeners. To add a slide: create the component, add it to `app.routes.ts` as a child of `/slideshow`, update the total count in `SlideshowComponent`.
