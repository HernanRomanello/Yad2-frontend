<!-- Copilot / AI agent instructions for contributors -->
# Copilot instructions — AngularYad2

Purpose: give AI coding agents the minimal, actionable knowledge to be productive in this repository.

- Quick commands
  - Install: `npm install`
  - Dev (browser): `npm run start` (runs `ng serve`)
  - Build (browser + server assets): `npm run build` (outputs to `dist/angular-yad2`)
  - Serve SSR after build: `npm run serve:ssr:angular-Yad2` (runs `node dist/angular-yad2/server/server.mjs`)
  - Tests: `npm run test` (Karma)

- High-level architecture
  - This is an Angular application with optional SSR. Browser entry: `src/main.ts`; server entry: `src/main.server.ts` -> `src/app/app.module.server.ts`.
  - Express-based SSR server is defined in `server.ts` and uses `@angular/ssr`'s `CommonEngine` to render pages.
  - Build output (both browser and server) goes to `dist/angular-yad2` per `angular.json`.

- Authentication & API patterns (important)
  - Backend base URL is in `src/environments/environment.development.ts` (URl: https://localhost:7211/). All API calls use `AuthService` as the central place for user flow.
  - `AuthService` is at `src/app/services/user/auth.service.ts` — it stores an `access_token` in localStorage and exposes `isUserLogin`/`user` observables.
  - HTTP requests use the new `provideHttpClient` pattern (see `src/app/app.module.ts`): `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))`.
  - `authInterceptor` (`src/app/interceptors/auth.interceptor.ts`) sets `withCredentials: true`. The backend expects cookies/credentials; don't remove `withCredentials` without checking backend CORS/auth behavior.
  - Route protection uses `authGuard` (`src/app/Guards/auth.guard.ts`) which reads `AuthService.isUserLogin` observable.

- SSR and runtime caveats
  - Server-side execution has no `window`/`localStorage`. `AuthService` uses `afterNextRender` to read localStorage — be careful when moving synchronous localStorage usage into code that runs during SSR.
  - When changing bootstrapping or services that touch browser-only globals, ensure server build still compiles (`ng build`) and server rendering doesn't throw.
  - The SSR flow: build -> `dist/angular-yad2` contains `browser` and `server` assets -> `server.ts` (already wired) serves them.

- Project conventions & structure (where to look)
  - UI modules/components: `src/app/modules/*` (each feature has its own folder and sometimes `dataUtilities.ts`).
  - Services: `src/app/services/*` (user-specific under `services/user`).
  - Models: `src/app/shared/models` (shared DTO shapes used across services/components).
  - Pipes: `src/app/pipes/*`.
  - Guards/Interceptors: `src/app/Guards`, `src/app/interceptors`.

- Useful patterns and examples
  - Http client + interceptor: see `src/app/app.module.ts` + `src/app/interceptors/auth.interceptor.ts`.
  - Auth flow + token lifecycle: `src/app/services/user/auth.service.ts` (login/register/logout, and how user data and lists are refreshed).
  - SSR server: `server.ts` (Express + `CommonEngine`) and server bootstrap: `src/main.server.ts`.

- Testing & debugging notes
  - Unit tests use Karma configured by `ng test`.
  - For SSR errors, build first (`npm run build`) then run the server script to reproduce server-side exceptions.

- When editing code
  - Preserve the `provideHttpClient(..., withInterceptors([authInterceptor]))` pattern unless you intentionally migrate to a different HTTP strategy — many services rely on that interceptor for credentials.
  - Prefer using existing models from `src/app/shared/models` for API shapes.
  - If adding server-only code, update `server.ts` or create separate server utilities; avoid imports of browser-only APIs in modules used by `AppServerModule`.

- If anything is unclear
  - Tell me which area to expand (API endpoints, authentication examples, or SSR troubleshooting steps).
