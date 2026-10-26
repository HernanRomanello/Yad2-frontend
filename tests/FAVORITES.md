# Favorites QA suite

## Implementation inspected

Angular `AuthService` owns `UserFavoriteAdvertisements` (BehaviorSubject). Search result hearts and the details save control call `updateAdvertisementToFavorites(id)`. The service sends a null-body POST and, on success, fetches the list again. The global auth interceptor sends credentials; JavaScript does not read the HttpOnly JWT cookie.

`/favorites` uses `authGuard`, `favoritesAdResolver` and `favoritesNotesResolver`. `FavoriteAdsComponent` renders the resolved list, with card navigation to `/advertisement/:id`. Its orange heart is decorative: removal is supported from search or details, not from the Favorites card. Details only show the save control inside the nonempty `mainPicture` branch. The header and mobile sidebar also navigate to Favorites.

Backend source was inspected in the adjacent local `Yad2 Backend/Yad2` checkout (not changed): `Controllers/UsersController.cs`, `Repositories/UserRepository.cs`, and `Program.cs`.

| Endpoint | Observed source contract |
| --- | --- |
| GET `/api/Users/GetFavorites` | `[Authorize]`; advertisement array including pictures, scoped by authenticated Name claim |
| POST `/api/Users/user/updateFavorite/{id}` | `[Authorize]`; toggle, null body; 200 with advertisement object |
| GET `/api/Users/user/GetNotes` | Favorites route prerequisite, notes array |
| POST `/api/Users/login` | email/password; JWT in `access_token` HttpOnly cookie |
| POST `/api/Users/logout` | clears authentication cookies |

JWT bearer authentication reads `access_token` from the request cookie. There is no caller-supplied user ID in either Favorites endpoint. An unknown numeric advertisement throws in the repository; the controller's null/400 branch does not handle that exception. This is a source finding, not a verified live invalid-ID response.

## Architecture, scope and safety

- All Favorites UI selectors and interactions live in `pages/FavoritesPage.ts`, reusing `SearchAdsPage`. Desktop login/logout reuse `LoginPage` and `HomePage`.
- `tests/fixtures/favorites.fixture.ts` provides a fresh, in-memory API simulation per test. It exercises the real Angular UI, but is **not backend persistence or real cookie authentication coverage**. Synthetic login credentials have no real account.
- Every API request is intercepted explicitly. Unknown API calls, mutations and external hosts are blocked. No database cleanup is performed by UI tests.
- The dedicated config inherits local Angular startup, base URL, screenshots on failure, retained failure traces and HTML reporting. It adds Pixel 7 Chromium viewport emulation; this is not physical-device testing.
- Real API tests use isolated request contexts. Authenticated tests require explicit dedicated-data confirmation, local API, opt-in, account credentials and a property ID. They preserve pre-existing Favorites, skip if that property is already saved, and remove only the specific favorite they added. Do not run another process against the same dedicated account concurrently.
- No real UI integration with authenticated cookies is claimed. Existing authentication fixtures block business-data mutations and therefore cannot be reused unchanged for Favorites writes.

## Cases and expected results

| ID | Coverage / expected result |
| --- | --- |
| FAV-001 | Add from search; selected heart; exactly one identified Favorites card |
| FAV-002 | Remove seeded favorite; unselected heart; unrelated favorite preserved |
| FAV-003 | Saved search heart and card survive refresh |
| FAV-004 | UI logout/login retains saved favorite (desktop) |
| FAV-005 | Three distinct saved properties, once each; correct details URL |
| FAV-006 | Search/details state synchronizes; details removal reflected in search/list |
| FAV-007 | Anonymous save gets simulated 401; no stored favorite |
| FAV-008 | Anonymous direct navigation redirects to login |
| FAV-009 | Three sequential toggles end saved, without duplicate cards |
| FAV-010 | Not implemented: no remove-only endpoint/UI for an unsaved property; calling toggle would add it |
| FAV-011 | Real authenticated invalid string route ID returns validation 400; list unchanged |
| FAV-012 | Empty resolved list renders zero stale cards |
| FAV-013-500/network/401 | Three separate save failures; no false selected heart; simulated 401 clears client state |
| FAV-014 | Rapid double click produces two simulated toggles and returns to unsaved |
| FAV-015 | Controlled pending save completes after details navigation and updates the heart |
| FAV-016-null/malformed | Two invalid list-response cases; refresh recovers the previously saved property |
| FAV-017 | Authenticated direct Favorites load should retain access; exposes FAV-BUG-001 |
| FAV-AUTH-read/toggle | Two real local unauthenticated API calls return empty 401 responses |
| FAV-API-001 | Real add/read, logout denials, re-login persistence, repeated toggle removal; original list restored |
| FAV-AUTH-ISOLATION | Two authorized accounts; changes in A leave B unchanged |

There are **23 executable unique cases**: 18 UI simulations and 5 real API cases. Four UI projects plus one API project collect 77 test instances. FAV-010 is documented as unsupported and is not counted as an executable case.

## Environment and commands

Frontend defaults to `http://localhost:4200`; API defaults to `https://localhost:7211`. The inherited webServer starts local Angular or reuses it. Start ASP.NET/MySQL separately for real API tests. TLS exceptions in API contexts are permitted only after the local-host safety check. No extra dependencies were installed.

```powershell
npm.cmd run test:favorites:types
npx.cmd playwright test --config playwright.favorites.config.ts --list
npm.cmd run test:favorites -- --project=chromium
npm.cmd run test:favorites -- --project=firefox
npm.cmd run test:favorites -- --project=webkit
npm.cmd run test:favorites -- --project=mobile-chromium
$env:RUN_FAVORITES_API='true'
npm.cmd run test:favorites -- --project=api
npx.cmd playwright show-report playwright-report/favorites
```

To enable authenticated real API cases, set all of the following through ignored local environment configuration or CI secrets:

| Variable | Requirement |
| --- | --- |
| RUN_FAVORITES_API | `true` |
| ALLOW_MUTATIONS | `true` |
| FAVORITES_TEST_DATA_CONFIRMED | `true`; confirms dedicated account/property ownership and scoped cleanup authorization |
| FAVORITES_TEST_EMAIL / FAVORITES_TEST_PASSWORD | Dedicated existing account, never a real user account |
| FAVORITES_PROPERTY_ID | Positive integer, dedicated existing property, initially unsaved by this account |
| FAVORITES_SECOND_EMAIL / FAVORITES_SECOND_PASSWORD | Distinct dedicated account for isolation case |

Missing opt-ins/data produce explicit skips. An opted-in unavailable API fails; it is not silently skipped. The second account is never mutated. Do not commit `.env`, cookies or authenticated state. Reports and traces remain ignored artifacts.

## Execution results

Execution date: 2026-10-25 local (Asia/Jerusalem). Earlier development failures caused by incomplete synthetic picture/asset-state data were test-fixture defects and were corrected; they are not product bugs.

Final command (PowerShell):

```powershell
$env:RUN_FAVORITES_API='true'
npx.cmd playwright test --config playwright.favorites.config.ts --output=test-results/favorites-final
```

| Project | Passed | Failed in Playwright | Skipped | Classification |
| --- | ---: | ---: | ---: | --- |
| Chromium | 17 | 1 | 0 | FAV-017 product defect |
| Firefox | 0 | 18 | 0 | Environment blocked: page creation crashes |
| WebKit | 17 | 1 | 0 | FAV-017 product defect |
| Mobile Chromium (Pixel 7 emulation) | 16 | 1 | 1 | FAV-017 defect; desktop logout flow skipped |
| Real local API | 2 | 0 | 3 | Anonymous authorization passes; dedicated authenticated data/opt-in missing |
| **Total** | **52** | **21** | **4** | **77 collected, 73 attempted; 18 failures are environment blocks** |

Of the failures, three reproduce the same application defect; the other 18 occur before UI assertions. No failures were silently skipped or marked expected. The three authenticated API skips are also coverage blockers until dedicated data is supplied.

Additional checks:

- `npx.cmd tsc --project tests/tsconfig.json`: passed (includes the Favorites config and Page Objects).
- `npx.cmd playwright test --config playwright.favorites.config.ts --list`: 77 instances in two spec files.
- `npx.cmd playwright test --config playwright.search.config.ts --project=chromium --grep=initial --output=test-results/favorites-regression`: one existing search regression passed.
- `npx.cmd playwright test --config playwright.favorites.config.ts --project=firefox --grep=FAV-008 --workers=1 --reporter=list --output=test-results/favorites-firefox-check`: failed again with `browserContext.newPage: Target crashed`; concurrency reduction did not resolve it.
- `git diff --check`: passed (only existing Windows line-ending conversion notices).

These counts describe the final combined run only, excluding development reruns and the separate regression/Firefox diagnostic. HTML report: `playwright-report/favorites/index.html`; machine-readable result: `test-results/favorites-results.json`; screenshots and retained traces: `test-results/favorites-final/`.

## Limitations and follow-up

- Real authenticated tests are implemented but require dedicated opt-in data; successful mocked persistence does not establish MySQL persistence.
- The 401 UI case simulates expiry/revocation. It does not wait for a cryptographic JWT to expire.
- Real multi-account coverage checks claim-scoped isolation; there is no exposed arbitrary user-ID Favorites endpoint to probe.
- Missing numeric IDs, deleted/unavailable listings, concurrent real backend toggles and refresh before server acknowledgement remain unverified. Do not infer those contracts from the simulator.
- FAV-016 checks recovery, not graceful error messaging. The current service logs non-401 errors to the console; no user-facing save-error contract or explicit empty-state message was found. Empty-list coverage checks actual rendered cards.
- Mobile logout/login is explicitly skipped because this suite reuses the existing desktop `HomePage` flow; other mobile cases use the real sidebar navigation.
- CSS/ID fallbacks are necessary for unlabeled div hearts/cards. Recommended improvements: accessible button names, `aria-pressed`, stable property IDs, a clear empty state and error feedback, and an idempotent add/remove API for safe retries.
- Confirmed product findings and evidence are tracked in `FAVORITES_DEFECTS.md`; no application behavior was changed.
