# Profile Management tests

## Architecture and safety

- `pages/ProfilePage.ts`: profile navigation, scoped field locators, values/errors, Save/Cancel and image controls. Labels in the app generally have no matching input ID; documented `formControlName` fallbacks are centralized in the POM.
- `tests/fixtures/profile.fixture.ts`: per-test synthetic user, stateful simulation of the inspected update repository, deterministic city/street catalogues, upload simulation and failure injection. Only the configured backend origin is intercepted. Unexpected API calls and business mutations are blocked; external traffic is blocked.
- `tests/e2e/profile/profile.spec.ts`: 51 isolated UI tests. Persistence assertions here verify the frontend against a controlled backend contract, not actual database persistence.
- `tests/e2e/profile/profile-live.spec.ts`: one explicitly enabled real UI/API persistence test with restoration.
- `tests/api/profile.spec.ts`: eight real API tests: two read/auth checks and six explicitly enabled mutation/authorization checks. Uses existing `credentials()` and API URL helpers.
- `playwright.profile.config.ts`: Chromium and API projects, one worker, inherited reporters, server startup and UI failure artifacts.
- `tests/tsconfig.json`: includes the new config in the existing type check.

Total: **60 tests**. No application code, shared reporting configuration, existing Auth tests or Favorites tests were changed by this task. The Favorites spec already had local changes when work began.

Synthetic tests need no credentials and never modify real users. Real tests are local-only. Mutating tests require `RUN_PROFILE_API=true`, `ALLOW_MUTATIONS=true`, `PROFILE_TEST_DATA_CONFIRMED=true`, existing dedicated `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD`, and a single worker. Do not use the mutable account concurrently in other runs. The cross-user test also requires distinct dedicated `PROFILE_SECOND_EMAIL` / `PROFILE_SECOND_PASSWORD`. Credentials are read from the existing ignored environment configuration. No users or files are created in the real environment by the default run.

Real tests restore the captured editable DTO fields in `finally`; cleanup failures fail the test. A nonempty original name is required for reliable restoration because the repository ignores empty strings. The API mutation tests also require original first name, last name and phone to be nonempty. Real image uploads are excluded because file cleanup is not authorized. Real-account tests disable traces/screenshots/video, following Auth, because requests can include credentials and Identity secrets. UI simulations retain the existing failure artifacts and attach synthetic state.

## Inputs discovered and coverage

| Actual input | Implementation rule | Automated coverage |
| --- | --- | --- |
| First name, text | Angular required; no length limit or character filter | Initial value; length 0/1; Hebrew, punctuation and preserved outer spaces; save, refresh and navigation persistence; multi-field update; real opt-in persistence |
| Last name, text | Angular required; no length limit or character filter | Initial value; length 0/1; Unicode, punctuation and outer spaces; save/refresh/navigation; multi-field update |
| Phone, text | Required only; HTML maxlength 11; first hyphen removed on save | Initial formatting; empty; valid formatted phone; normalized request/saved value; persistence; input overflow truncated to 11; explicit characterization of short/alphabetic input accepted by validator |
| Email, text | Angular required/email validator; local part <=64 and total <=254; **not in backend update DTO** | Empty, malformed, outer whitespace; valid plus-address update/persistence defect; local lengths 63/64/65 and total lengths 253/254/255 |
| Birth date, native date | Optional in UI; no min/max; backend nonnullable DateTime | Initial value; leap day save/refresh/navigation; clear optional input/request; real API rejects malformed date and empty string |
| City, catalogue text input | Exact catalogue membership; required for submission | Existing value; valid alternate city and dependent street; empty/unknown/outer-space rejection; multi-field persistence |
| Street, dependent catalogue text input | Exact city/street membership; required for submission | Existing value; alternate valid street; save/refresh/navigation; empty/unknown/outer-space rejection; city dependency |
| House number, text | Required and digits pattern in form; submit only checks numeric >0; API Int32 | Empty, -1, 0, 1, nonnumeric, fraction; maximum 2147483647 UI; real API rejects maximum+1 and fraction |
| Profile image, file input/modal | No accept attribute, MIME/extension or explicit size validator in frontend/controller; separate upload request | PNG selection/preview/update request; selection cancellation; deletion and saved deletion; preservation of existing image when another field changes |

Shared functional coverage: open Edit Profile through the existing account menu; all initial values; single/multiple updates; unchanged submission; Save success; validation text; invalid data/request prevention; Cancel; 500/network/401 failure handling; anonymous UI access; real backend anonymous rejection; Identity-secret exposure; cookie-owner authorization against spoofed body identity.

## Rules not invented / remaining limitations

- No maximum exists for names or phone in the inspected model snapshot; no invented name maximum, phone minimum/regex, forbidden-character rule, date range or upload-size threshold is asserted.
- Angular email boundaries are tested separately from the database's 256-character email column because the update DTO omits email entirely.
- Native date controls prevent entering arbitrary malformed text through normal `fill`; malformed dates are tested at the real API layer instead.
- Birthday is optional in UI but empty string is incompatible with the API DateTime. UI request characterization and API rejection are deliberately separate assertions.
- Address suggestions are deterministic synthetic catalogues; catalogue completeness and the third-party government API are outside this suite.
- File type/size rejection cannot be asserted without a defined restriction. Inspection found none; real uploads are excluded to avoid leaving files on disk.
- There is no implemented backend-error notification to target. Failure tests assert that unchanged server state must not be presented as a successful update; they currently expose false success.
- Backend required/format/range business validation is absent from `UserUpdateDto`; empty strings are ignored by the repository, and nonzero house numbers are accepted. Tests do not claim a validation contract that does not exist.
- Real mutation, cross-user and real UI persistence coverage remains opt-in. Skipped tests are not evidence that those behaviors work.
- The checked-in backend model snapshot uses SQL Server `nvarchar`/`datetime2` types, despite the project instructions mentioning MySQL. Actual deployed database constraints were not queried.

## Commands (PowerShell)

Run only Profile Management tests with normal safe defaults:

```powershell
npx.cmd playwright test --config playwright.profile.config.ts
```

Enable read-only local API verification while explicitly preventing real mutations:

```powershell
$env:RUN_PROFILE_API='true'
$env:ALLOW_MUTATIONS='false'
npx.cmd playwright test --config playwright.profile.config.ts
```

For dedicated disposable account integration, configure the credentials in the ignored environment, then explicitly set all three opt-in flags described above and use the same profile command. Never run two Playwright processes against the same output directory or mutable account.

Type check:

```powershell
npx.cmd tsc --project tests/tsconfig.json
```

HTML report:

```powershell
npx.cmd playwright show-report playwright-report
```

See `PROFILE_DEFECTS.md` for reproduction steps and evidence. Product defect assertions intentionally fail; they are not marked expected-failure or weakened to produce a green run.

## Execution results — 2026-10-27

Profile command executed with `RUN_PROFILE_API=true` and `ALLOW_MUTATIONS=false`:

```powershell
npx.cmd playwright test --config playwright.profile.config.ts
```

Result: **37 passed, 16 failed, 6 skipped** (59 tests, 4.5 minutes). UI: 36 passed / 15 failed; API: 1 passed / 1 failed / 6 skipped. The subsequently added opt-in live UI test was checked separately with:

```powershell
npx.cmd playwright test --config playwright.profile.config.ts --project=chromium profile-live.spec.ts --reporter=list --output=test-results/profile-live-check
```

Result: **1 skipped**, as required with mutation opt-in disabled. Aggregate for the final 60 tests: **37 passed, 16 failed, 7 skipped**. The HTML report contains the 59-test profile run; the extra live-test skip used the list reporter to preserve that report.

The 15 UI failures are intentional assertions exposing actual frontend defects, not expected-failure annotations: invalid-field submission (8 cases including the email-length boundary), discarded email update, Cancel submission, false success after three failure modes, unintended image clearing, and fractional house-number submission. The real API failure confirms non-null `passwordHash` exposure. No secret field value was logged.

All real mutations, cross-user integration and real UI/database persistence were skipped. Local frontend/API were available; database availability was not independently checked beyond successful read/login requests. No lint script is configured. `npx.cmd tsc --project tests/tsconfig.json` passed, including the new config. `git diff --check` passed.

An earlier exploratory run had a trace-file collision because two Playwright invocations shared the default output directory. It was superseded by the sequential profile run above, which had no artifact collisions. Subsequent regression checks use separate output subdirectories and the list reporter.

Regression commands and results:

```powershell
npx.cmd playwright test --config playwright.auth.config.ts --reporter=list --output=test-results/auth-regression
npx.cmd playwright test --config playwright.favorites.config.ts --project=chromium --reporter=list --output=test-results/favorites-regression
```

Authentication: **9 passed**, 0 failed/skipped (18.0 seconds). Favorites Chromium UI: **17 passed**, 0 failed/skipped (23.2 seconds). Other Favorites browser projects/API integration were not rerun. Existing Favorites working-tree changes were preserved.
