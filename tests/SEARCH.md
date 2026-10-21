# Search Ads automation

## Scope and execution

122 independent TypeScript scenarios exercise the Angular search UI using controlled HTTP responses. Tests do not create accounts, ads, favorites, or database records. Search-history POSTs are fulfilled in the browser; unhandled API calls and mutation requests are blocked and reported. Third-party requests are blocked. New browser contexts isolate each test.

Run from the repository root:

```sh
npm run test:search:types
npm run test:search
# All three existing browser projects:
npx playwright test --config playwright.search.config.ts
# One group, or repeated reliability checks:
npm run test:search -- --grep "Location search"
npm run test:search -- --grep "Search defaults" --repeat-each=2
npx playwright show-report playwright-report/search
```

The existing configuration starts Angular in development mode at `http://localhost:4200`, or reuses an existing local server outside CI. `BASE_URL` must be loopback. Browser requests to `/api/Advertisement/GetAdvertisements`, individual listing details, authentication checks, and search history are intercepted. City/street JSON assets have small deterministic replacements. These tests need no functioning API/database for their browser interactions. Angular SSR may still attempt its own read requests during rendering; browser routing does not intercept server-side HTTP.

Use the development app matching this checkout. `API_BASE_URL` does not rewrite the Angular environment. No TLS setting or application code was changed. Existing failure screenshot/trace settings and CI retry policy are inherited; no test contains sleeps or manual retries.

## Implementation inventory

Inspected the real-estate route/resolver, search/results components, SearchService, AdvertisementService, CityListService, additional filters, property selector, room selectors, price/floor/size components, advertisement detail route, API model, and existing auth/registration test patterns.

* Ads: fetched through `GET /api/Advertisement/GetAdvertisements`, then filtered client-side. Exact card identities, result counts, and order are asserted against synthetic data rather than live counts.
* Transaction: sale (default) and rent.
* Location: city, neighborhood, area, street suggestions; selecting/confirming, multiple locations with OR semantics, duplicate prevention, five-location limit, removal, and reset. Area selection currently uses the suggested city rather than geographic bounds.
* Property types: דירה, דירת גן, גג/ פנטהאוז, דופלקס, תיירות ונופש, מרתף/ פרטר, טריפלקס, יחידת דיור, החלפת דירות, סאבלט, סטודיו/ לופט, בית פרטי/ קוטג, דו משפחתי, משק חקלאי/ נחלה, משק עזר, מגרשים, דיור מוגן, בניין מגורים, מחסן, חניה, קב' רכישה/ זכות לנכס, כללי. Multi-select and select-all apartment/house groups are present.
* Price: minimum/maximum text inputs and a range slider. Sale slider initializes at 0–20,000,000; code contains a 20,000 rent sentinel, but the slider is constructed before transaction changes. Tests cover numeric, formatted, empty, alphabetic, negative, and excessive values, inclusive/equal endpoints, zero, and no matches.
* Rooms: 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, +6; one value or inclusive ranges, reverse selection, third-selection replacement. +6 is open-ended.
* Ad characteristics: image, moshav/kibbutz, price, price reduction.
* Publisher: broker and developer/contractor.
* Amenities: parking, elevator, safe room, balcony, air conditioning, storage, renovated, accessible, bars, furnished, exclusivity, pets, roommates.
* Condition: new from builder, new within ten years, renovated within five years, well maintained, needs renovation. Together with the preceding categories, these are 24 independent boolean controls.
* Floor: basement, ground, 1–18; dropdown endpoints and range slider.
* Area: square-meter inputs and slider, 0–500 displayed range.
* Sort: date, price ascending, price descending, near me. Current date sort uses descending ID; near me uses ascending ID with no coordinates/geolocation.
* Results: no-results message, listing detail navigation, browser back. Filters remain in the singleton service across SPA navigation; refresh resets them. Search does not write URL query parameters.
* Mobile: modal entry, property, rooms, trade, price, and combined city/rooms controls.

Not implemented as filtering behavior: entry date, immediate-entry checkbox, additional free-text input. They have no filter binding/handler. Nearby location suggestion, recent-search suggestions, and alert creation also lack working search actions. There is no pagination, infinite scroll, URL query parsing, or durable refresh persistence. No tests invent those capabilities.

## Coverage matrix

Each row maps to named `describe` groups and focused test names in the two spec files. Parameterized rows generate distinct Playwright cases, not loops of assertions inside one large test.

| Feature | Cases / assertions | Count |
| --- | --- | ---: |
| Default/empty search and sale/rent | `Search defaults and trade type`: exact sale results, empty submit, rent and back | 3 |
| Every property type | `Property type: <type>`: matching sale included; other type/rent excluded | 22 |
| Property multi-select/reset | `Property multi-selection and clearing`: OR, both select-all groups with positive fixtures, final deselection | 4 |
| Every boolean filter | `Additional filter: <label>`: matching sale only, negative and rental controls | 24 |
| Every room choice and ranges | `Rooms`: all eleven options, inclusive/reverse ranges, replacement | 14 |
| Price ranges and invalid inputs | `Price inputs and boundaries`: boundaries, formatted/invalid inputs, no matches | 10 |
| Sorting/filter interaction | `Sorting and interaction with filters`: four choices, repeated changes, sorting after room filter | 6 |
| Locations and clearing | `Location search`: four suggestion categories, absent city, unselected short/invalid input, clear | 9 |
| Floor/size/combinations/reset | `Ranges, combinations and reset`: each numeric filter, AND across city/rooms/price/amenities/sort, incompatible amenities, uncheck/reset | 13 |
| Navigation and lifecycle | `Navigation, refresh and empty data`: detail/back, refresh/URL, empty API data | 3 |
| Multiple locations | `Multiple locations`: OR, duplicates, exact removal, maximum five | 4 |
| Keyboard sliders | `Range keyboard interactions`: price minimum ArrowRight, floor End | 2 |
| Actual date ordering | `Date sort with nonsequential creation dates`: chronology independent of ID | 1 |
| Draft versus applied filters | `Additional filter draft changes`: close initial draft; close edit after prior apply | 2 |
| Mobile search | `Mobile search controls`: property, fractional rooms, rent, price boundaries, city + rooms | 5 |
| **Total** | | **122** |

The combination strategy covers OR within property/location selections and representative AND combinations across filter families, filtering with sorting, conflicting criteria, clearing, and navigation. It does not enumerate the exponential Cartesian product of all possible filters.

## Files

| File | Responsibility |
| --- | --- |
| `pages/SearchAdsPage.ts` | Search POM and additional-filter component object; interactions only |
| `tests/fixtures/search-data.ts` | Typed synthetic listings, property options, boolean filter mapping |
| `tests/fixtures/search.fixture.ts` | Isolated routing, safety checks, fixture-data evidence, page object |
| `tests/e2e/search/search-ads.spec.ts` | 108 core behavior scenarios and result assertions |
| `tests/e2e/search/search-interactions.spec.ts` | 14 multi-location, slider, date, draft, and mobile scenarios |
| `playwright.search.config.ts` | Reuses existing browser/web-server settings; isolates search and adds JSON report |
| `package.json` | `test:search` and `test:search:types` commands |
| `tests/tsconfig.json` | Includes the search configuration in type checking |
| `tests/SEARCH.md` | Inventory, coverage, run instructions, limitations, and results |
| `tests/README.md` | Link to the search suite documentation |

Preferred role/text/placeholder locators are used wherever supported. Existing component tags, IDs, and a few narrowly scoped classes are necessary because result cards, sort choices, suggestions, range endpoints, and decorative remove/close images have no accessible interaction names or test IDs. No application markup was changed to accommodate tests.

## Results and evidence

Verification date: 2026-10-18. Local Angular development frontend on Windows; headless Playwright browser projects.

* `npm run test:search:types`: passed.
* Initial core run: `npx.cmd playwright test tests/e2e/search --project=chromium --workers=2 --reporter=list,json` — 99 passed, 9 failed out of 108. A later improvement added positive data for the house select-all scenario, which previously had only a no-match fixture.
* Cross-browser subset: `npx.cmd playwright test --config playwright.search.config.ts --project=chromium --project=firefox --project=webkit --grep "initial search shows|inclusive min and max|mobile price range|mobile city and room|removing one city"` — Chromium 4 passed/1 product failure; WebKit 4 passed/1 identical product failure; Firefox 5 environment failures (`browserContext.newPage: Target crashed`) before assertions. Full Firefox/WebKit coverage has not been verified. The subset JSON is preserved at `playwright-report/search-cross-browser.json`.
* Final complete Chromium run: `npm.cmd run test:search` — **109 passed, 13 failed, 0 skipped, 0 flaky, 122 total**, in approximately 3.4 minutes. All 13 failures are exact behavioral assertion failures corresponding to the 11 product findings below (S01 has three scenarios). No locator/action timeout or unhandled API failure remains in this run. Exit code is 1 because the defects remain open.
* Final `npm.cmd run test:search:types` and `git diff --check`: passed. Earlier automation issues with array-valued fixture overrides, ambiguous parking text, and a decorative removal image were corrected. The final street fixture was aligned with the actual synthetic ad street before the complete run.

The search configuration writes `test-results/search-results.json` and `playwright-report/search/index.html`. Each product failure retains its screenshot, trace, and error context under `test-results/`; each test attaches its synthetic input records. Reports are ignored by Git. Run `npx playwright show-trace <trace.zip>` to inspect a failure.

## Product defects

All reproductions use the dedicated synthetic records in `search-data.ts` or the named test's override. No personal data is involved. Environment: local Angular application, Chromium; location removal also reproduced in WebKit. Failed exact-result assertions, screenshots, and traces are the evidence. The following are application findings, not disabled tests or expected-failure markers.

| ID / severity and impact | Reproduction | Expected versus actual / code finding |
| --- | --- | --- |
| S01 High: multi-property searches lose valid ads | Select two property types and Search; also select all apartments or all houses | Union of matching types expected. No results: `RealEstateResultsComponent` compares each type with one comma-joined string. Three scenarios detect this. |
| S02 Medium: final property cannot be cleared | Select garden apartment, Search, deselect it, Search | All sale ads expected. Old type remains because `onPropertyTypeSelected` only updates `assetTypeList` for a nonempty selection. |
| S03 Medium: air-conditioning criteria conflict | Matching record has `airConditioner: true`; select מיזוג and apply/search | That record expected. Generic filter checks `airConditioner`, then another branch additionally requires `airConditioning`; fixture exposes the inconsistent fields. |
| S04 Medium: pets filter unexpectedly requires roommates | Select pets with a pets-enabled sale record whose `forRoommates` is false | Pets-enabled record expected. Results empty because a pets branch compares `forRoommates` with an unset filter. |
| S05 Medium: formatted price range is misapplied | Enter 1,000,000 and 2,000,000 then Search | Only the inclusive range expected. Other records remain; input emission/model update and sanitization do not produce the displayed range consistently. |
| S06 High: street search does not constrain results | Choose the QA Search 101 street suggestion in חיפה, confirm and Search | Only matching street expected. Other sale ads remain; result stream never consumes selected street/city subjects. |
| S07 Medium: basement/ground range ignored | Additional filters: basement to ground; apply/Search | Floors -1 and 0 expected. Other floors remain; Hebrew floor values are parsed as NaN. |
| S08 Medium: reset retains numeric constraints | Apply 80–120 m²; reopen and Reset; Search | All sale ads expected. Size-filtered results remain; reset clears booleans but not numeric signals. |
| S09 Medium: removing one city removes other cities | Choose חיפה and תל אביב יפו; remove חיפה | Tel Aviv selection expected to remain. Both disappear; removal uses city inequality AND neighborhood inequality, dropping cities with the same empty neighborhood. |
| S10 Medium: date ordering follows ID | Use ads with newest date on ID 1, oldest on ID 2, middle on ID 3; choose date | Order 1,3,2 expected. Actual 3,2,1; sorter compares ID instead of `creationDate`. |
| S11 Medium: closing an edit still changes applied filters | Apply parking; reopen, select elevator, close without Apply; Search | Previously applied parking results expected. Elevator restriction leaks into results because component and service share a mutable filter object. |

Near-me sorting is a documented implementation gap rather than verified geographic behavior: its characterization test checks current ascending ID order. The static recent-search suggestions and alert controls are also incomplete rather than backend-integrated coverage.

## Limits and recommended follow-up

* Mocked-browser tests validate Angular filtering and rendering, not the live backend schema, authorization, SQL filtering, or database contents. Add a separate read-only API smoke test once a dedicated API/database dataset is available.
* Exclusivity is dynamically read by the search service but absent from `AdvertisementsModel`. Its isolated UI fixture supplies that service key explicitly; the passing test does not establish that a real API returns it. Verify the backend contract before claiming integrated exclusivity support.
* Investigate Firefox page-creation crashes before running its full suite. Run complete WebKit and Firefox suites in CI after the environment is stable.
* Fix the reported product defects, then rerun all scenarios. Keep exact assertions; do not mark defects as expected failures to obtain a green build.
* Add accessible labels/roles or stable IDs to the existing nonsemantic controls through a separately reviewed accessibility change.
* Add entry-date/free-text, geographic near-me/area, alert, pagination, durable state, and query-string cases only when those features acquire working implementations.
