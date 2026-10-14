# AGENTS.md — Yad2 Test Automation Project

## Purpose
This repository contains automated tests for a Yad2-style real estate platform. Work as a careful QA automation engineer: prioritize reliable tests, readable code, meaningful assertions, and clear defect reports.

## Application Under Test
- Frontend: Angular 18 — `http://localhost:4200`
- Backend: ASP.NET Core 6 REST API — `https://localhost:7211` (Angular `environment.apiUrl`).
- Database: MySQL (configure for the local development environment).
- Authentication: JWT in HttpOnly cookies.
- Main features: registration/login, listings, advanced search and filters, favorites, recent searches, listing details, creating/editing ads, user profile, and image uploads.

The frontend now runs locally rather than in the cloud. Start the Angular application before running browser tests. The local API and database must also be available for scenarios that depend on them. Never delete or modify real users' data, create bulk records, or run destructive tests against any shared environment without explicit authorization. Prefer dedicated test accounts and disposable test data.

## Tech Stack and Conventions
- Prefer Playwright with TypeScript for browser E2E and API tests.
- Use `@playwright/test` fixtures, assertions, and built-in request contexts.
- Follow existing project configuration, package manager, directory structure, and naming conventions rather than introducing competing patterns.
- If starting from scratch, use `tests/e2e/`, `tests/api/`, `pages/`, `fixtures/`, and `utils/` as appropriate; do not over-engineer.
- Name test files `*.spec.ts` and write descriptive test names focused on behavior.
- Prefer reusable fixtures and small helper functions; use Page Objects only where they genuinely reduce duplication.

## Test Priorities
1. Authentication: successful login, failed login, logout, unauthorized access, and authenticated session behavior.
2. Search: search by keyword, filters, combined filters, clearing filters, no-results state, and result navigation.
3. Favorites: add/remove favorites, correct displayed state, and persistence across navigation or re-login when expected.
4. Listings: listing details and relevant validation, empty states, and navigation.
5. Ad management: create/edit an ad, field validation, permissions, and optional images **only with safe test data**.
6. Profile and recent searches: correct saved data, authorization, and user-visible state.
7. API: status codes, response schema/key fields, authentication/authorization, validation errors, and negative cases.

## Quality Rules
- Test observable behavior, not implementation details.
- Use `getByRole`, `getByLabel`, `getByPlaceholder`, and stable `data-testid` selectors. Avoid brittle CSS selectors and XPath unless necessary.
- Never use fixed sleeps (`waitForTimeout`) to hide timing issues. Rely on Playwright auto-waiting, locator assertions, or targeted network waits.
- Keep each test independent and runnable in isolation. Avoid test order dependencies.
- Use explicit assertions for outcomes; clicking a button alone does not prove success.
- Test both positive and negative cases where valuable.
- Do not silently swallow failures, use unconditional retries inside tests, or loosen assertions to make tests pass.
- Avoid broad screenshot snapshots or excessive mocking for critical integration flows. Use network interception only when it serves a deliberate test objective.
- For API assertions, verify relevant response body fields in addition to status codes.
- Use clear test steps and attach evidence for failures when supported by existing configuration.

## Authentication and Test Data
- Read secrets from environment variables. Never hard-code or commit passwords, tokens, cookies, AWS credentials, or personal information.
- Use dedicated test users and uniquely identifiable test records (e.g., a prefix plus a random ID).
- Never commit `.env` files or Playwright `storageState` containing authenticated cookies; add them to `.gitignore`.
- Store generated state under an ignored directory such as `playwright/.auth/`.
- Reuse authenticated `storageState` through a setup project or fixture where appropriate, while covering login separately.
- Clean up records created by tests only when deletion is approved and scoped to those exact records. Otherwise use ephemeral fixtures or a disposable environment.
- Avoid depending on current listing counts, display order, or user-created data.

## Environment Configuration
- Default frontend `BASE_URL` to `http://localhost:4200`.
- Default `API_BASE_URL` to `https://localhost:7211`, matching Angular `environment.apiUrl`. Do not use the retired cloud API endpoint.
- The backend uses local HTTPS. Trust the ASP.NET Core development certificate (`dotnet dev-certs https --trust`) when possible. Do not disable TLS verification globally; if a local self-signed certificate requires a Playwright `ignoreHTTPSErrors` exception, scope it strictly to the local development environment.
- The external `dataGovApiUrl` (`https://data.gov.il/api/3/action/datastore_search`) is a separate third-party API and is not the Yad2 backend. Avoid making uncontrolled external requests in tests.
- Check that the local Angular app and any required backend services are running before executing tests.
- Require explicit opt-in (e.g., `ALLOW_MUTATIONS=true`) before running tests that create, edit, delete, or upload data against a shared or deployed environment.
- Never run migrations, database resets, cleanup of shared data, or load tests automatically.
- Support local execution and CI without embedding developer-specific paths.
- Avoid logging sensitive response bodies, authorization headers, or cookies.

## Suggested Commands
Check `package.json` before running anything. When Playwright is configured conventionally:

```bash
npm install
npx playwright install
npx playwright test
npx playwright test tests/e2e
npx playwright test tests/api
npx playwright test --ui
npx playwright show-report
```

Use the repository's actual package manager and scripts when they differ from these examples.

## Workflow for Every Task
1. Inspect existing tests, fixtures, `playwright.config.ts`, and relevant app behavior before changing code.
2. State the scenario and intended assertions; identify whether it is read-only or mutating.
3. Implement the smallest maintainable change consistent with the repository.
4. Run the focused test first, then the relevant suite when practical.
5. Report what was changed, the exact command executed, pass/fail status, and any test-environment limitations.
6. If a test fails, distinguish an application defect from a test defect or environment issue. Do not claim a test passed unless it actually ran and passed.

## Bug Reporting
For a suspected product defect, provide:
- Concise title and severity with rationale
- Environment and browser
- Preconditions and sanitized test data
- Exact reproduction steps
- Expected vs. actual result
- Evidence (trace, screenshot, response/status) without exposing secrets

## Definition of Done
- Tests describe real user or API behavior and include meaningful assertions.
- Tests are isolated, deterministic where feasible, and safe for the target environment.
- New code follows existing TypeScript/Playwright conventions.
- Focused tests were executed, or execution blockers were clearly reported.
- No credentials, sensitive user data, or unintended changes to shared production-like data.

## Instructions for Coding Agents
- Don't assume an element, API route, request body, or response shape exists; inspect the codebase or observed behavior first.
- Don't fabricate test results, selectors, backend behavior, or coverage claims.
- Ask before making destructive or irreversible changes.
- Prefer small, reviewable commits and explain significant changes.
- If the user requests a new test suite, deliver executable tests and necessary configuration, not merely a test plan.
