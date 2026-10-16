# Registration defects

Observed on Windows with Chromium and WebKit against Angular http://localhost:4200 and ASP.NET Core https://localhost:7211, using disposable qa-registration-UUID@example.com data. Test account creation uses generated environment credentials. No existing users were changed or deleted.

## Invalid forms still attempt signup — Medium

Rationale: frontend validation does not prevent invalid data from reaching the server. For some fields (including passwords longer than twenty characters), this can bypass the stated frontend rules because the backend has different constraints. Backend rejection of malformed email remains effective; this finding alone does not demonstrate SQL injection.

Reproduction:
1. Open /register in a fresh browser context.
2. Enter an empty or malformed email, or a password missing letters/digits or outside the stated length range.
3. Use identical password and confirmation; submit with המשך.

Expected: show the relevant validation message and issue no signup request.
Actual: POST /api/Users/signup is attempted despite the invalid Angular form. The test guard aborts the request, so negative browser scenarios create no users.
Evidence: ordinary request-count assertions in the client-validation and SQL-shaped-email groups report [POST signup] rather than [].
Source cause: handleSubmit() checks equality but never returns on signupForm.invalid.

## Valid 8–20-character passwords receive a length error — Medium

Rationale: misleading password feedback prevents users from understanding how to complete registration, although submission can still succeed because invalid-form submission is not blocked.

Reproduction:
1. Open /register and enter a valid disposable email.
2. Enter an eight- or twenty-character password containing English letters and digits; use different confirmation to avoid account creation.
3. Submit.

Expected: show the mismatch message without a password-length error.
Actual: shows נבקש סיסמה באורך 8-20 תווים for a password within that range. A twenty-one-character password can render no length message at all.
Evidence: the eight-/twenty-character boundary assertions receive the length message; the twenty-one-character validation-message assertion fails.
Source cause: password.length < 8 || password.length <= 20 rejects every nonempty candidate of length at most twenty. For longer values, Angular maxLength marks the field invalid but the template renders the unset mismatch string.

## Password mismatch feedback is hidden — Medium

Rationale: registration stops without explaining that confirmation differs.

Reproduction:
1. Open /register, fill a valid email and a composed 8–20-character password.
2. Fill a different confirmation or leave confirmation empty.
3. Submit.

Expected: show הסיסמאות אינן תואמות and remain on /register without signup.
Actual: signup is blocked, but the unrelated length error replaces mismatch feedback.
Evidence: confirmation and mismatch cases expect the mismatch text but receive the length error.
Source cause: the error template requires password.invalid and prioritizes passwordError over paswwordDontMatchError. Correcting only the length condition will still hide mismatch feedback for valid passwords.

These failures are deliberately retained as ordinary assertions. Backend validation and safe SQL input handling are covered independently; passing those checks is not a full security audit.
