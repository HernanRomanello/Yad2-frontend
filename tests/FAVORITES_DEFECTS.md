# Favorites defect reports

## FAV-BUG-001 — authenticated direct Favorites load redirects to login

- **Severity:** Medium. Saved-data entry via bookmark/direct URL or a full reload is interrupted, while SPA navigation works. No saved-data loss was observed.
- **Environment:** Local Angular at `http://localhost:4200`; Chromium, WebKit and Pixel 7 Chromium emulation; stateful controlled API responses. Real backend/cookie reproduction remains to be performed.
- **Preconditions:** Isolated authenticated API simulation; `/api/Users/User` returns a valid synthetic user; `/api/Users/GetFavorites` returns property 101.
- **Steps:** Run FAV-017. Open search; wait for property 101's selected heart, proving authentication/list hydration; navigate directly to `/favorites` in the same browser context.
- **Expected:** Favorites route remains accessible and property 101 appears once.
- **Actual:** URL becomes `/login`; the Favorites page is not displayed despite the mocked authenticated user response.
- **Evidence:** `test-results/favorites-final/e2e-favorites-favorites-Fa-32595-s-navigation-retains-access-chromium/test-failed-1.png` and sibling `trace.zip`. Earlier focused reproduction is also under `test-results/favorites-chromium/`. These are generated, ignored artifacts.
- **Source evidence / likely cause:** `src/app/Guards/auth.guard.ts` uses `first()` on `isUserLogin`, whose initial value is false. `AuthService.checkAuth()` populates it asynchronously. The guard can redirect before cookie-based session hydration completes. This cause is inferred from source and browser behavior.
- **Status:** Open. The regression assertion remains active and fails normally; no skip, expected-failure annotation or application workaround was added to FAV-017.
- **Retest:** Final combined run reproduced the same failure on all three functioning UI projects. Pending application fix; browser-specific counts are recorded in `FAVORITES.md`.

## Environment issue — Firefox process/page crash

Firefox attempts failed during browser/page creation (`Target crashed`), before meaningful Favorites assertions. This is not classified as an application defect. Chromium and WebKit can execute the same UI scenarios. Re-run Firefox in a functioning Playwright browser environment; no browser-security settings were changed to suppress the crash.

## Implementation limitations, not confirmed defects

Favorites-card hearts have no removal handler; removal is supported elsewhere. Details save controls are absent for image-less ads. Invalid numeric property IDs throw in repository source, but their live HTTP response has not been verified. No bug severity or live reproduction is fabricated for these findings.
