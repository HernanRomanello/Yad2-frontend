# Profile defects

Environment: local Angular frontend `http://localhost:4200`, configured local ASP.NET backend `https://localhost:7211`, Playwright Chromium desktop, 2026-10-27. UI reproductions use a fresh synthetic account with a valid city/street/house number and phone. They cannot affect real users. The simulation follows the inspected UserUpdateDto/repository semantics; real API verification is identified separately.

## P-01 — Save sends invalid required/email fields (High)

Precondition: open Profile > Edit Profile using the isolated fixture. Clear first name, last name or email; alternatively enter `plain-address` or a 255-character email.

1. Observe the required/invalid-email message.
2. Click Save.
3. Inspect the update requests in the synthetic-state attachment.

Expected: validation blocks PUT and leaves saved values unchanged. Actual: PUT `/api/Users/user/update` is sent despite the visible invalid field. Empty first/last names are ignored by the repository; invalid email is ignored because it is absent from the DTO. Success can still be shown. Impact: contradictory validation and a misleading save outcome. `updateUserDetails()` never checks `$updatedUser.valid`.

Evidence: failing tests `rejects empty required name/lastName/email`, `rejects invalid email ...`, `email total length boundary 255`; synthetic request attachment, screenshot and trace in HTML report.

## P-02 — Cancel submits and saves changes (High)

1. Open Edit Profile and change first name to `Unsaved QA`.
2. Click Cancel.
3. Navigate away and return.

Expected: no PUT; original name restored. Actual: Cancel submits the form, sending the changed name. The button lacks `type="button"` and has no cancel handler. Impact: unintended modification and data loss.

Evidence: `cancel discards edits without submitting`, update payload in synthetic attachment.

## P-03 — Failed updates announce success (High)

1. Use the fixture's HTTP 500, network abort or HTTP 401 response mode.
2. Change first name and click Save.
3. Observe the success notification.

Expected: no success message; an actionable error and recoverable edit state. Actual: success notification appears although server state is unchanged. The component sets success synchronously; the service handles non-401 errors only in the console.

Evidence: the three `does not announce success when update fails` tests, unchanged synthetic server profile and failed request in trace. No real backend failure was induced.

## P-04 — Editable email silently discarded (Medium)

1. Change email to `qa+updated@example.invalid` and Save.
2. Observe success.
3. Reopen profile and inspect email.

Expected: either persist the permitted change or clearly disallow it. Actual: original email returns; UserUpdateDto and repository contain no email update. Impact: user cannot rely on the save confirmation.

Evidence: `persists a valid changed email rather than reporting a discarded update`, trace and synthetic persisted profile. Backend omission confirmed by source; a real account email change was not attempted.

## P-05 — Saving another field clears existing profile image (High)

1. Start with an existing image (`/assets/images/image_placeholder_.svg` in the fixture).
2. Change first name without opening the image picker.
3. Save.

Expected: original picture retained. Actual: request contains `picture: ''`; saved profile loses the image. Component's no-new-file branch unconditionally clears `$user.picture`.

Evidence: `preserves an existing image when saving another field`, request and persisted synthetic profile.

## P-06 — Fractional house number bypasses form validation (Medium)

1. Enter `1.5` for house number.
2. Save with valid city/street.

Expected: digits-only validator prevents update. Actual: component checks only numeric positivity and submits a fraction, which the backend Int32 cannot accept.

Evidence: `house number must be an integer, not a fraction`; synthetic update request. Real API fraction rejection test is provided but requires mutation opt-in.

## Source-confirmed issues requiring further real integration validation

- Clearing optional birthday sends `birthDate: ''`, incompatible with nonnullable DateTime. UI characterization passes; an opt-in API rejection test is supplied. Do not interpret UI success as database persistence.
- Phone's validator is required-only and accepts alphabetic/one-character values; no documented phone format contract was found. Characterization tests record this gap without inventing a regex.
- Image selection/controller contain no explicit extension/MIME/size checks and the upload controller has no Authorize attribute. No real upload was attempted, because it writes files and safe cleanup was not authorized.
- Profile GET/update return IdentityUser directly in source. The real read-only API test checks that passwordHash/securityStamp/concurrencyStamp are absent without logging their values. Runtime outcome is recorded in PROFILE.md.

Failure evidence is local under ignored `test-results/` and the HTML report. Synthetic UI traces contain synthetic data only. Real-account API/browser artifacts are disabled to prevent disclosure; their assertions use boolean checks instead of dumping response bodies.

## P-07 — Real profile API exposes password hash (High, runtime confirmed)

Precondition: existing dedicated account credentials in `E2E_TEST_EMAIL` / `E2E_TEST_PASSWORD` and local API available.

1. Authenticate through POST `/api/Users/login` using a separate Playwright request context.
2. GET `/api/Users/User` with that context's cookie.
3. Check whether `passwordHash` is present and non-null, without printing it.

Expected: a public profile DTO containing only necessary profile data. Actual: response includes a non-null `passwordHash`. Impact: password verifier material is unnecessarily delivered to the browser/client. Source returns the IdentityUser entity directly; update responses should also be reviewed, but were not exercised against a real account in this run.

Evidence: real read-only test `authenticated profile response excludes Identity secrets` fails with `passwordHash must not be exposed`. Credentials and field values are absent from assertion output. Runtime presence of securityStamp/concurrencyStamp was not separately confirmed because the first assertion failed.
