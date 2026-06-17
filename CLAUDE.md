# CLAUDE.md — Angular Forms Showdown

## Project Purpose

Interactive presentation app comparing three Angular form approaches:
- **Template-Driven Forms** — `src/app/pages/template/`
- **Reactive Forms** — `src/app/pages/reactive/`
- **Signal-Based Forms** — `src/app/pages/signal/`

23 slide components live in `src/app/slides/`. The same complex user-registration form (dynamic addresses, async email validation, password strength, conditional fields) is implemented three times to make comparisons fair. A separate `compatForm` migration proof (a small reactive→signal interop form) lives at `src/app/pages/compat-demo/`, reachable at `/compat-demo` — it is not part of the slide deck.

**Stack:** Angular 22 · TypeScript 6 · RxJS 7.8 · ngx-translate 17 · zone.js · Karma/Jasmine · SCSS

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
- **Performance benchmarks:** each form page has an "Add/Update 1k" button (`addOrUpdateThousandAddresses`) that bulk-adds then bulk-updates 1000 addresses, timing each pass with `performance.now()` and logging the result to the console. Heap/memory figures come from the separate headless runner `scripts/benchmark.mjs` (`npm run benchmark`), not the in-page button.

## Key Files

| File | Purpose |
|------|---------|
| `src/app/types/user.ts` | Shared `User` model + `UserForm` signal-based type (`WritableSignal<Address>[]`) |
| `src/app/types/address.ts` | Address sub-model for dynamic address list |
| `src/app/services/email-check.service.ts` | Simulated async email uniqueness check |
| `src/app/lang/en.json` | 313 translation keys (source of truth for copy; `pl.json` mirrors it exactly) |
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
- Performance benchmark buttons measure with `performance.now()` and `console.log` (not `console.time` / `console.timeEnd`)

## Resolved / Notes

- ~~Email validation regex duplicated across four locations~~ — extracted to `src/app/validators/email.validator.ts` (`EMAIL_REGEX`, `isValidEmailFormat`), now consumed by all three form components and `EmailCheckService`
- ~~Async email validator has no debounce~~ — all three approaches debounce (`debounceTime(300)` / `timer(300)` + `switchMap`)
- ~~No `OnPush` change detection on any component~~ — the three form pages (`template`, `reactive`, `signal`) set `ChangeDetectionStrategy.OnPush` explicitly, since they are the perf-sensitive components under comparison. The remaining components (slides, `main`, `slideshow`) use Angular's default strategy; the app runs with zone.js (no zoneless provider).
- ~~Tests are minimal~~ — 10 spec files, **166 tests** (validators, services, all three form components, and the compatForm demo)
- ~~Leftover TODO comments in `template.component.ts` about SolidJS comparison~~ (already removed)
- `angular-eslint` has no v22 release yet (peer caps at `@angular/cli < 22`); `npm install` requires `--legacy-peer-deps`. Lint still passes.

## Slide Architecture

Slides are numbered `01`–`23` in `src/app/slides/`. Each is a standalone component rendered inside `SlideshowComponent`. Navigation uses `ActivatedRoute` param and arrow-key listeners. To add a slide: create the component, add it to `app.routes.ts` as a child of `/slideshow`, and add it to the `slides` array in `SlideshowComponent` (the total is derived from that array's length).
