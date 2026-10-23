export type FilterValue = boolean | undefined;
export type PropertyFilters = {
  hasImage: FilterValue;
  moshavOrKibutz: FilterValue;
  hasPrice: FilterValue;
  pirceDiscount: FilterValue;
  publisherIsMiddleMan: FilterValue;
  publisherIsContractor: FilterValue;
  hasPrivateParking: FilterValue;
  elevator: FilterValue;
  safeRoom: FilterValue;
  hasBolcony: FilterValue;
  airConditioner: FilterValue;
  storageRoom: FilterValue;
  renovated: FilterValue;
  accessibleForDisabled: FilterValue;
  windowBars: FilterValue;
  furnished: FilterValue;
  exclusivity: FilterValue;
  petsAllowed: FilterValue;
  forRoommates: FilterValue;
  isNewFromBuilder?: FilterValue;
  isNew?: FilterValue;
  isRenovated?: FilterValue;
  isWellMaintained?: FilterValue;
  needsRenovation?: FilterValue;
  floorsRange: [string, string];
  aptSizeRange: [number, number];
};

export function emptyPropertyFilters(): PropertyFilters {
  return {
    hasImage: undefined,
    moshavOrKibutz: undefined,
    hasPrice: undefined,
    pirceDiscount: undefined,
    publisherIsMiddleMan: undefined,
    publisherIsContractor: undefined,
    hasPrivateParking: undefined,
    elevator: undefined,
    safeRoom: undefined,
    hasBolcony: undefined,
    airConditioner: undefined,
    storageRoom: undefined,
    renovated: undefined,
    accessibleForDisabled: undefined,
    windowBars: undefined,
    furnished: undefined,
    exclusivity: undefined,
    petsAllowed: undefined,
    forRoommates: undefined,
    isNewFromBuilder: undefined,
    isNew: undefined,
    isRenovated: undefined,
    isWellMaintained: undefined,
    needsRenovation: undefined,
    floorsRange: ['', ''],
    aptSizeRange: [0, Number.MAX_SAFE_INTEGER],
  };
}
