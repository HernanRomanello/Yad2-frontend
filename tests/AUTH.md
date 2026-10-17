# Login and logout E2E

Run only this suite with `npm run test:auth`. Do not run the registration suite against an important database: its separate tests create users.

The suite reuses the root `pages/` convention and existing dotenv dependency. `LoginPage` owns form interactions and validation locators; `HomePage` owns account navigation and logout. Test-scoped fixtures provide fresh contexts and perform real UI login independently for each authenticated scenario. No storage state or test-order dependencies are used. The dedicated config runs Chromium with one worker and no retries to prevent concurrent sessions and repeated failed-password attempts. The main config excludes these tests so they cannot accidentally run with its parallel multi-browser settings.

Copy `.env.example` to `.env` if needed, preserving any existing local configuration. Supply an **existing dedicated** account in `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD`. Missing credentials skip six account-dependent tests. Set `E2E_TEST_INVALID_PASSWORD` to a known incorrect value only after checking account lockout policy; otherwise the negative-password test skips. No credentials are invented or users created.

Start the local ASP.NET API and MySQL first. The config starts Angular if needed. Defaults are `http://localhost:4200` and `https://localhost:7211`. `E2E_BASE_URL` overrides `BASE_URL` for this suite; `API_BASE_URL` must match Angular's compiled environment setting. Only loopback services are accepted. Prefer a trusted development certificate; `LOCAL_IGNORE_HTTPS_ERRORS=true` enables a local-only browser/request-context exception.

```powershell
npm run test:auth:types
npm run test:auth -- --list
npm run test:auth
```

Coverage: successful UI login and profile access, incorrect password, required fields, session restoration on reload, anonymous profile/favorites redirects, UI logout, logout persistence with protected-route checks, and browser back navigation. Authenticated login checks the protected user response and HttpOnly cookie metadata without exposing values. Logout checks the endpoint success and subsequent protected API denial, allowing either cookie expiration or server-side invalidation.

The fixture blocks all non-read requests except local login/logout, and blocks requests to other origins, including data.gov.il. There are no account, ad, favorite, profile, migration, seeding, or cleanup operations. Account credentials are never changed. This is an authentication-session suite; backend login-side auditing/lockout behavior cannot be established from this frontend repository.

HTML/list reports include sanitized endpoint status attachments on failure and a form-only screenshot with inputs masked when on the login page. Traces/video and general screenshots are disabled because they may record passwords, cookie values, or personal account data. Treat all generated reports as private; Playwright's error context can include rendered page content. Nothing is uploaded.

## Verification on 2026-10-17

- `node node_modules/typescript/bin/tsc --project tests/tsconfig.json`: passed.
- `node node_modules/@playwright/test/cli.js test --config playwright.auth.config.ts --list`: nine Chromium tests discovered.
- With `LOCAL_IGNORE_HTTPS_ERRORS=true`, `node node_modules/@playwright/test/cli.js test --config playwright.auth.config.ts`: two passed, one failed, six skipped (account credentials unavailable).
- Profile and favorites anonymous redirects passed, including protected user endpoint denial.
- Empty-form test displayed both required messages and remained anonymous, but detected a real login POST; see defect below.
- Successful login/logout, cookie issuance, authenticated reload and back-navigation remain unverified until credentials are supplied. Backend controller source is not in this repository; exact cookie name/options and invalid-credential status must be confirmed against the running API.

## Defect: empty login form sends an authentication request

Severity: Low — unnecessary backend traffic bypasses client validation, although anonymous access remains denied.

Environment: local Angular at localhost:4200, API localhost:7211, Chromium. Preconditions: fresh anonymous context; no account required. Open `/login`, leave both inputs empty and click `התחברות`.

Expected: both required messages appear, user stays anonymous, no login POST occurs. Actual: messages appear and the session stays anonymous, but POST `/api/Users/login` is sent. `LoginComponent.handleSubmit()` calls `AuthService.login()` without checking `loginForm.invalid`. Evidence: the required-field test fails on the observed login request; sanitized endpoint statuses and masked form screenshot are attached to its report. Production authentication code was left unchanged.

Source-review concern (unconfirmed): the guard consumes the initial false BehaviorSubject before asynchronous session restoration, which may redirect an authenticated hard navigation to a protected URL. Home-page reload is tested separately; this concern has not been browser-verified without credentials.
