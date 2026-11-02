# Ad creation tests

The existing Playwright/TypeScript framework runs the real Angular UI on local desktop Chromium and a Pixel 7 viewport. `pages/AdCreationPage.ts` owns interactions; the fixture owns synthetic authentication, address catalogues, uploads and API responses. Each test receives fresh browser and server state.

```sh
npm install
npx playwright install chromium
npm run test:ads:types
npm run test:ads
npm run test:ads -- --project ads-desktop
npm run test:ads -- --grep "completes the rental"
npx playwright show-report
```

The inherited webServer configuration starts Angular automatically at `http://localhost:4200` (or reuses an existing local instance). `BASE_URL` must be loopback. `API_BASE_URL` defaults to `https://localhost:7211` and must match Angular's configured API origin. No API or database service is required for this simulated integration suite. No real credentials are read or written. All API writes are intercepted, unknown API requests fail the test, and external requests are blocked. No real ads, uploads, promotions, purchases or database records are created; cleanup consists of disposing the test context and fixture state.

The creation response deliberately returns success without validating the payload. This isolates client-side progression and submission defects rather than allowing a simulated server to hide them. Payload assertions cover the successful flow. These tests do not prove backend persistence, authorization, storage validation or published-listing rendering.

## Verified run (2026-10-31)

- `npm run test:ads:types`: passed.
- `git diff --check`: passed.
- `npx playwright test --config playwright.ads.config.ts --workers 4`: **68 passed, 76 failed**, 144 executions, approximately six minutes. Both desktop and mobile happy paths passed. Failed assertions remain enabled.
- Desktop: 37 passed / 35 failed. Mobile: 31 passed / 41 failed. Failures include repeated manifestations of the same validation/submission defect; these are not 76 distinct defects.
- Evidence: `playwright-report/index.html` and per-test screenshots, `error-context.md`, and `trace.zip` under ignored `test-results/`. Use `npx playwright show-trace <trace.zip>` to inspect pointer interception and submitted requests.
- Mobile image removal, retry navigation and immediate-entry checkbox tests also encounter covered controls. Treat these as layout findings in the fallback-font environment pending normal-font confirmation. Some later assertions cannot run until earlier defects are resolved.

## Coverage

- Rental flow through seven steps, basic/free submission, confirmation and request payload.
- Categories, required fields, digit-only floor/area rules, phone length/pattern, correction, whitespace, zero and large digit inputs.
- Description boundaries at 399/400/401 characters, Hebrew/English, emoji, literal HTML-like and SQL-like text. These strings are never sent to a real service.
- Back/forward persistence, refresh, furniture-dependent fields, immediate-entry checkbox, image previews, removal, ten-image limit, PNG/JPEG selection.
- Server/network failures, interrupted uploads, retry, pending submission and duplicate prevention.
- Desktop/mobile execution, label-based access, keyboard focus and programmatic error associations.

Tests prefixed `regression:` assert missing safeguards as ordinary tests. They are intentionally not skipped or marked expected-failure. A red suite is meaningful: inspect traces before changing assertions. Other validation tests can also expose the shared navigation-button defect described below.

## Defects and evidence

Environment: local Angular development app, Playwright Chromium (desktop and mobile emulation). Preconditions: synthetic QA account and intercepted backend. Reproduction uses only synthetic inputs. Screenshots, error context and traces are saved under ignored `test-results/`; the HTML report links each failing assertion.

1. **High: invalid-step Continue can submit an incomplete ad.** Select rental, fill a valid address, replace floor with `-1`, and click Continue. Expected: remain on address with a field error and no POST. Actual observed in desktop Chromium: a creation request succeeds against the simulated endpoint and the UI navigates to confirmation. Navigation buttons lack explicit button types, and `handleSubmit` checks contact-step fields whose DOM error elements are absent on earlier steps. The valid contact Continue path does not reproduce premature submission because that button is removed during navigation.
2. **High: price validation omitted from step validation.** Enter a negative price with otherwise valid payment fields. Expected: block progression with an error. Source inspection shows `price` has a pattern validator but is absent from the step's checked fields and has no error element.
3. **High: no in-flight submission guard.** Hold a creation response and click the free plan again. Expected: one request and disabled submit. Source contains no pending flag.
4. **Medium: whitespace contact name, missing house number, unsupported image type and error associations.** Regression assertions exercise these safeguards. Contact name uses required without trimming; house number is omitted from step checks; image selection has no type validation; error IDs are not referenced by inputs.
5. **Medium: missing review and failure feedback.** Final step shows plans rather than entered values. Request/upload failures are logged; no alert is rendered by the creation component.
6. **High, suspected mobile usability defect: consent checkbox is covered by other content.** Reach Contacts on the Pixel 7 viewport and click the consent checkbox. Expected: it is clickable and becomes checked. Observed trace: contact phone input/adjacent content intercepts pointer events. A dedicated pointer test retains this failure; broader flows use focus and Space to exercise the remaining steps. Recheck with the normal font assets before assigning a CSS root cause (see environment limitation below).
7. **Medium: refresh and back-navigation recovery.** Refresh at the payment step redirects to Login despite a successful synthetic authentication response. Back-navigation testing also observes the selected property type disappearing from its button. Expected: a usable authenticated form and retained selections. These findings have independent regression assertions; some later validation assertions remain blocked by the earlier unintended-submission defect.

These are frontend findings. A successful simulated POST is not evidence that the real backend accepts invalid data.

## Remaining gaps / assumptions

- No email input exists in this flow, so email validation is not applicable.
- No documented image byte-size limit or allowlist exists. Oversized rejection cannot have a truthful boundary assertion until a policy is specified. Unsupported-type rejection is covered as a regression.
- No text minimum exists; description is optional with an HTML maxlength of 400. Furniture description advertises 200 characters but has no matching validator or maxlength. Contact-name limits are unspecified.
- Zero and huge digit floor values currently have no range validator; retention tests characterize this behavior, not endorse it. Business-approved numeric ranges, price minima and precision are needed for further boundary assertions.
- Category selection currently exposes the same property form. Distinct category-specific schemas are not implemented.
- Full accessibility auditing, physical mobile devices, image decoding/security, video uploads and paid plans are outside this suite. Keyboard checks cover initial input focus and consent with Space. Second-contact binding and optional numeric-field serialization are not yet covered.
- External Google fonts and Material Icons are blocked along with other external resources. Layout/pointer findings therefore describe the isolated fallback-font environment and need comparison with a normal font-loaded render; they do not establish a production CSS defect by themselves.
- Live creation and cleanup require an explicitly authorized disposable backend, dedicated account and exact-record deletion contract. No live mutation tests were enabled because that authorization/cleanup contract was not supplied.
