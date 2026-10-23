# Additional property filter implementation

Scope: frontend only. Backend code and database schema were inspected read-only. No backend changes or migrations were made.

## Contract findings

The sibling backend defines `AdvertisementsModel.PriceDiscount` and `AdvertisementDto.PriceDiscount`; the response uses `priceDiscount`. The UI's existing `pirceDiscount` key is retained and explicitly mapped to that response field.

`AirConditioning` and `AirConditioner` are separate backend fields. General air conditioning is entered as `airConditioning` by the create/edit forms and displayed from that field on listing details. The UI's `airConditioner` search key therefore maps only to `airConditioning`. Tests deliberately give these two response fields opposite values.

The backend listing model and DTO have no exclusivity field. Frontend `exclusivity` is optional and unknown values do not match an active exclusivity search. Synthetic positive tests validate the frontend path only. Real exclusivity search cannot be completed without a backend contract/data change, which the user prohibited.

| UI filter | Response field | Before this change |
|---|---|---|
| hasImage | hasImage | Generic filter worked |
| moshavOrKibutz | moshavOrKibutz | Generic filter worked |
| hasPrice | hasPrice | Generic filter worked |
| pirceDiscount | priceDiscount | Incorrect spelling prevented real matches |
| publisherIsMiddleMan | publisherIsMiddleMan | Generic filter worked |
| publisherIsContractor | publisherIsContractor | Generic filter worked |
| hasPrivateParking | hasPrivateParking | Generic filter worked |
| elevator | elevator | Generic filter worked |
| safeRoom | safeRoom | Generic filter worked |
| hasBolcony | hasBolcony | Generic filter worked |
| airConditioner | airConditioning | Incorrectly required two distinct fields |
| storageRoom | storageRoom | Generic filter worked |
| renovated | renovated | Generic filter worked |
| accessibleForDisabled | accessibleForDisabled | Generic filter worked |
| windowBars | windowBars | Generic filter worked |
| furnished | furnished | Generic filter worked |
| exclusivity | exclusivity, if supplied | Missing backend field; limitation remains explicit |
| petsAllowed | petsAllowed | Incorrectly also compared forRoommates |
| forRoommates | forRoommates | Generic filter worked; unwanted coupling to pets |

Existing property-condition checkboxes remain supported through typed optional filter fields.

## Implementation

- The existing boolean pass is retained; duplicate passes were removed. Only `true` restricts results, and all active predicates use AND.
- SearchService stores copied applied filters and emits a change event after committing, so Apply/Reset update displayed results immediately.
- The additional-filter dialog has its own SearchService instance for draft controls, including nested mobile controls. Opening copies current state; Apply commits it; Close/outside dismissal discards it. Action buttons no longer implicitly submit the enclosing search form.
- Floor controls emit their actual event, represent basement as -1 and ground as 0, restore current values, and keep slider/dropdowns synchronized.
- Floor and area ranges include endpoints and normalize reversed values. Empty floor endpoints impose no bound; Reset removes boolean and range restrictions.
- Upper/lower area input handlers emit after parsing. The existing no-results template remains in use.

## Changed files

- `src/app/shared/models/Filters.ts`: typed existing condition flags and common empty-filter defaults.
- `src/app/shared/models/AdvertisementsModel.ts`: actual priceDiscount response name and explicitly optional exclusivity.
- `src/app/services/search.service.ts`: copied applied state, normalization, notifications.
- `src/app/modules/real-estate-additional-filters/real-estate-additional-filters.component.ts` and `.html`: isolated draft state, Apply/Reset, correctly wired ranges and non-submit buttons.
- `src/app/modules/real-estate/real-estate-search/real-estate-search.component.html`: create/dispose the draft dialog on open/close.
- `src/app/modules/real-estate/real-estate-results/real-estate-results.component.ts`: response mappings and independent inclusive predicates.
- `src/app/modules/real-estate/real-estate-price-slider-select/real-estate-price-slider-select.component.ts` and `RealEstateFloorSliderSelect.component.html`: floor control state and valid select options.
- `src/app/modules/real-estate-price-slider-component2/real-estate-price-slider-component2.component.ts` and `RealEstateSquareSizeSlider.component.html`: applied range restoration and parsed input emissions.
- `tests/fixtures/search-data.ts`: response-field fixture names.
- `tests/e2e/search/additional-property-filters.spec.ts`: desktop/mobile independent boolean filters, false clearing, unapplied drafts, pets/roommates independence, range cancellation/reversal/reset, distinct field mappings, and missing exclusivity no-results behavior.

## Verification

Browser tests use the existing route-isolated fixture. Listings are synthetic and mutation requests are intercepted; no real user records are edited. A fresh frontend server is used because the existing server on port 4200 did not reliably reflect the edited source.

Focused command (PowerShell):

```powershell
$env:BASE_URL='http://localhost:4202'
npm.cmd run test:search -- --grep 'Additional property filters|Verified listing field mappings|Missing backend exclusivity' *> playwright-report/filter-focused.log
```

Playwright result: **54 passed**. The first run exposed the upper-area input emission defect, which was corrected before this rerun. PowerShell's stderr redirection can report a nonzero native-command status despite Playwright's passing summary; inspect the JSON reporter/summary for the actual test results.

Static checks: `npm.cmd run test:search:types` and `npx.cmd tsc --noEmit -p tsconfig.app.json` passed.

Full regression command:

```powershell
$env:BASE_URL='http://localhost:4203'
npm.cmd run test:search *> playwright-report/search-regression.log
```

Full result: **168 passed, 8 failed, 0 skipped, 0 flaky, 176 total**, in 178 seconds. All 54 new additional-filter tests passed in this run, including the assertion that draft selections leave visible results unchanged.

The eight failures reproduce defects already recorded in SEARCH.md before this task (previous full result: 109 passed, 13 failed):

| Existing defect | Failing scenarios | Test |
|---|---:|---|
| S01: property types compared against one comma-separated string | 3 | search-ads.spec.ts:42 and :55 |
| S02: last selected property type is not cleared | 1 | search-ads.spec.ts:62 |
| S05: formatted price input emission | 1 | search-ads.spec.ts:119, formatted input case |
| S06: street search is not consumed by results | 1 | search-ads.spec.ts:174, street case |
| S09: removing one city removes another with the same empty neighborhood | 1 | search-interactions.spec.ts:19 |
| S10: date sorting uses ID rather than creationDate | 1 | search-interactions.spec.ts:63 |

These assertions were not weakened, skipped, or marked as expected failures. This task fixes S03, S04, S07, S08, and S11. The unrelated existing defects remain open.

Evidence: [JSON results](../test-results/search-results.json), [browser report and traces](../playwright-report/search/index.html), and [full console output](../playwright-report/search-regression.log).

Environment: Angular's existing SSR path logs `document is not defined` and rejects the local self-signed API certificate. Browser fixture tests execute, but they are not live backend integration verification. No global TLS exception was introduced. Initial sandboxed fresh-server compilation was blocked by filesystem restrictions; fresh-server browser runs required elevated execution.
