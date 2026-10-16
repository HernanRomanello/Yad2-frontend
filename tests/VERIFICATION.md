# Verification — 2026-10-14

Environment: Windows; Angular http://localhost:4200; ASP.NET Core https://localhost:7211; disposable local database. Account-creating tests used an ephemeral password generated into REGISTRATION_TEST_PASSWORD, never printed or committed. LOCAL_IGNORE_HTTPS_ERRORS=true was required by the self-signed local API certificate. No deletion or database resets were performed.

## Final complete run

The terminal helper was unavailable, so Node's child-process runner invoked the installed Playwright CLI. Exact command (with no credential literal):

~~~powershell
node -e "process.env.LOCAL_IGNORE_HTTPS_ERRORS='true';process.env.REGISTRATION_TEST_PASSWORD='Aa1!'+require('node:crypto').randomBytes(6).toString('hex');process.argv=['node','playwright','test','registration.spec.ts'];require('./node_modules/@playwright/test/cli.js');"
~~~

Result: exit 1; 66 cases, 24 passed, 42 failed.

| Project | Passed | Failed | Classification |
| --- | ---: | ---: | --- |
| api | 18 | 0 | All validation, duplicate, and SQL input assertions passed |
| chromium | 3 | 13 | Signup/session and both visibility controls passed; frontend validation defects reproduced |
| webkit | 3 | 13 | Signup/session and both visibility controls passed; same frontend validation defects reproduced |
| firefox | 0 | 16 | browserContext.newPage: Target crashed, before registration interaction |

The SQL browser failures show missing client-side submission gating, not demonstrated SQL injection. Backend SQL-shaped email/confirmation rejection and SQL-looking password handling passed.

Full HTML report: ../playwright-report/index.html. Per-test error-context files are under ../test-results/. Keep artifacts private and sanitize them before sharing. REGISTRATION_DEFECTS.md summarizes evidence without credentials.

## Focused checks

- Installed Playwright CLI discovery: 66 cases in two registration spec files.
- Chromium visibility: two passed after fixing relative filter selectors and clicking the visible icon rather than its zero-height container.
- API suite: eighteen passed after correcting assertions to observed 401 ProblemDetails responses.
- Isolated Firefox command: node node_modules/@playwright/test/cli.js test tests/e2e/registration.spec.ts --project=firefox --grep 'password control toggles' --workers=1 --reporter=list --output=test-results-firefox-check. Result: one failed with the same page-creation crash; not classified as a registration defect.
- Strict type checking: node node_modules/typescript/bin/tsc --project tests/tsconfig.json. Passed.
- git diff --check. Passed (only Windows line-ending notices).

Earlier API attempts without the explicit local certificate exception were blocked by TLS verification. They are not treated as application defects. Application source files remain unchanged.

After the complete run, the invalid-form signup guard was broadened to block signup paths on any origin, protecting against a mismatched Angular backend configuration. Strict type checking passed again. The focused command node node_modules/@playwright/test/cli.js test tests/e2e/registration.spec.ts --project=chromium --grep "requires email" --reporter=list --output=test-results-firefox-check reproduced the expected application failure (one attempted signup, aborted by the guard).
