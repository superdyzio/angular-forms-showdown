# AngularFormsShowdown

An interactive presentation + live-demo app (Angular 22) comparing three Angular form approaches side by side — **Template-Driven**, **Reactive**, and the **Signal-Based Forms** API (`@angular/forms/signals`, stable as of Angular 22). The same complex user-registration form (dynamic addresses, async email validation, password strength, conditional fields) is implemented three times under `src/app/pages/`, and a 23-slide deck under `src/app/slides/` walks through the comparison. A small `compatForm` migration proof lives at `/compat-demo` (not part of the deck). Copy is bilingual (EN/PL) via ngx-translate — switch with the `?lang=en` / `?lang=pl` query param.

> **Note:** `angular-eslint` has no Angular 22 release yet, so dependency installs require `npm install --legacy-peer-deps`.

## Benchmarks

Each form page has an "Add/Update 1k" button that bulk-adds then bulk-updates 1000 addresses, timing each pass with `performance.now()`. For reproducible heap/memory figures, run the headless benchmark:

```bash
npm run benchmark   # node scripts/benchmark.mjs
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
