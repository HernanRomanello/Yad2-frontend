# Registration automation

For the read-only Search Ads suite, coverage matrix, and defect report, see [SEARCH.md](./SEARCH.md).

## Running

The suites use the existing npm installation and Playwright. Angular is started automatically in development mode when a local frontend is not already running. Start the ASP.NET Core API and disposable MySQL database separately. Defaults are http://localhost:4200 and https://localhost:7211; BASE_URL and API_BASE_URL override them. The Angular application's API URL must match API_BASE_URL; the test variable does not rewrite Angular configuration. Backend CORS currently permits http://localhost:4200.

Set REGISTRATION_TEST_PASSWORD in the process environment to a disposable 8–20-character password containing uppercase, lowercase, a digit, and a special character. Credentials are never loaded automatically from .env files. A missing or invalid password fails account-creating tests with a configuration error.

For an ephemeral password in PowerShell:

~~~powershell
$env:REGISTRATION_TEST_PASSWORD = 'Aa1!' + [guid]::NewGuid().ToString('N').Substring(0, 12)
# Prefer trusting the ASP.NET development certificate. If necessary, opt in locally:
$env:LOCAL_IGNORE_HTTPS_ERRORS = 'true'
node node_modules/@playwright/test/cli.js test registration.spec.ts --list
node node_modules/@playwright/test/cli.js test tests/e2e/registration.spec.ts --project=chromium
node node_modules/@playwright/test/cli.js test tests/api/registration.spec.ts --project=api
npm run test:registration
~~~

The HTTPS exception only applies when both configured service hosts are loopback. TLS verification is never disabled globally. On shared or deployed targets, real API registration tests and browser signup are skipped unless ALLOW_MUTATIONS=true. Invalid-form browser tests always abort signup requests. Do not opt in on a shared system without authorization.

To run only non-creating browser scenarios:

~~~powershell
node node_modules/@playwright/test/cli.js test tests/e2e/registration.spec.ts --project=chromium --grep-invert '@mutation'
~~~

A complete run has 16 browser scenarios per browser and 18 API scenarios. The api project runs once; it does not duplicate API account creation across browsers. A complete passing run creates six unique qa-registration-UUID@example.com accounts: one per browser, one duplicate-case seed, and two SQL/control accounts. No accounts are deleted and no database reset is performed. Run on a disposable database.

## Structure and assertions

- pages/RegistrationPage.ts owns locators and reusable actions, with a RegistrationFormData interface for email, password, and confirmPassword. Assertions stay in specs.
- tests/e2e/registration.spec.ts checks signup/login/navigation/session restoration, client validation, password boundaries, visibility, and SQL-shaped email input.
- tests/api/registration.spec.ts verifies model validation (400 and error keys), Identity password rejection (401 ProblemDetails), duplicates, SQL-shaped input, and a valid registration control.
- tests/utils/registration.ts provides unique emails, environment validation, shared-target safeguards, request matching, and the client-validation signup guard.

The frontend requires email, password, and confirmation; password validation describes 8–20 characters with English letters and digits. The server requires a valid email, nonempty password, matching confirmation, at least eight characters, uppercase/lowercase letters, a digit, and a special character. No server-side twenty-character maximum is configured. The observed signup response is 200 with JSON true, followed by a separate login request from Angular.

## Security checks

SQL probes use short boolean/comment expressions only. No destructive statements, stacked queries, delay probes, or load testing are used. Malformed SQL-shaped email must fail model validation; SQL-shaped mismatched confirmation must fail comparison validation. Neither may establish authentication. SQL-looking characters in an otherwise valid password are accepted as ordinary data by Identity. These checks are regression coverage, not a claim that every SQL injection vulnerability is ruled out.

Registration traces and automatic screenshots are disabled to avoid recording credentials and cookies. Reports and error-context files are ignored by Git; they may still contain request details or entered form values, so keep artifacts private and sanitize them before sharing. Test comparisons avoid printing credential values or full user responses.

## Known frontend defects

See REGISTRATION_DEFECTS.md. These scenarios retain ordinary assertions and fail until the application is fixed; they are not skipped or marked as expected failures. Guarded requests prevent invalid client submissions from creating records.

## Verification

See VERIFICATION.md for executed commands, final results, and the Firefox environment limitation. Run npm run test:registration:types for strict TypeScript checking.
