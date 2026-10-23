import type { AdvertisementsModel } from '../../src/app/shared/models/AdvertisementsModel';

type BooleanAdvertisementKey = {
  [Key in keyof AdvertisementsModel]: AdvertisementsModel[Key] extends boolean ? Key : never;
}[keyof AdvertisementsModel];

// Exclusivity is optional because the current backend omits it. Synthetic true
// values exercise frontend behavior, not live API support.
type BooleanFilterDefinition = readonly [
  label: string,
  key: BooleanAdvertisementKey | 'exclusivity',
  control: 'checkbox' | 'feature',
];

export const propertyTypes = [
  'דירה', 'דירת גן', 'גג/ פנטהאוז', 'דופלקס', 'תיירות ונופש', 'מרתף/ פרטר',
  'טריפלקס', 'יחידת דיור', 'החלפת דירות', 'סאבלט', 'סטודיו/ לופט',
  'בית פרטי/ קוטג', 'דו משפחתי', 'משק חקלאי/ נחלה', 'משק עזר',
  'מגרשים', 'דיור מוגן', 'בניין מגורים', 'מחסן', 'חניה', "קב' רכישה/ זכות לנכס", 'כללי',
] as const;

// Keys are API response fields: UI pirceDiscount maps to priceDiscount,
// and the general air-conditioning filter maps to airConditioning.
export const booleanFilters = [
  ['עם תמונה', 'hasImage', 'checkbox'],
  ['רק מושבים וקיבוצים', 'moshavOrKibutz', 'checkbox'],
  ['עם מחיר', 'hasPrice', 'checkbox'],
  ['נכסים שמחירם ירד', 'priceDiscount', 'checkbox'],
  ['תיווך', 'publisherIsMiddleMan', 'checkbox'],
  ['יזם/קבלן', 'publisherIsContractor', 'checkbox'],
  ['חניה', 'hasPrivateParking', 'feature'], ['מעלית', 'elevator', 'feature'],
  ['ממ״ד', 'safeRoom', 'feature'], ['מרפסת', 'hasBolcony', 'feature'],
  ['מיזוג', 'airConditioning', 'feature'], ['מחסן', 'storageRoom', 'feature'],
  ['משופצת', 'renovated', 'feature'], ['גישה לנכים', 'accessibleForDisabled', 'feature'],
  ['סורגים', 'windowBars', 'feature'], ['מרוהטת', 'furnished', 'feature'],
  ['בבלעדיות', 'exclusivity', 'feature'], ['חיות מחמד', 'petsAllowed', 'feature'],
  ['לשותפים', 'forRoommates', 'feature'],
  ['חדש מקבלן (לא גרו בכלל)', 'isNewFromBuilder', 'checkbox'],
  ['חדש (נכס בן עד 10 שנים)', 'isNew', 'checkbox'],
  ['משופץ (שופץ ב-5 שנים האחרונות)', 'isRenovated', 'checkbox'],
  ['במצב שמור (במצב טוב, לא שופץ)', 'isWellMaintained', 'checkbox'],
  ['דרוש שיפוץ (זקוק לעבודת שיפוץ)', 'needsRenovation', 'checkbox'],
] as const satisfies readonly BooleanFilterDefinition[];
export type BooleanFilter = typeof booleanFilters[number];
export type SearchAd = Partial<AdvertisementsModel> & Pick<AdvertisementsModel,
  'id' | 'street' | 'number' | 'tradeType' | 'assetType' | 'price' | 'rooms' |
  'floor' | 'totalSquareMeters' | 'city' | 'neighborhood'> & { exclusivity?: boolean };

export interface SearchFixtureData {
  ads: SearchAd[];
}

export function makeAd(id: number, overrides: Partial<SearchAd> = {}): SearchAd {
  return {
    ...Object.fromEntries(booleanFilters.map(([, key]) => [key, false])),
    id, street: `QA Search ${id}`, number: 1, tradeType: 'מכירה', assetType: 'דירה',
    price: 1000000, rooms: '3', floor: 2, totalFloors: 18, totalSquareMeters: 80,
    city: 'חיפה', neighborhood: 'הדר', mainPicture: '', pictures: [],
    creationDate: '2026-01-01T00:00:00Z', entryDate: '2026-12-01T00:00:00Z',
    description: 'Synthetic search test listing', airConditioning: false,
    ...overrides,
  };
}

export const defaultAds: SearchAd[] = [
  makeAd(101, { price: 1000000, rooms: '1', floor: -1, totalSquareMeters: 40 }),
  makeAd(102, { price: 2000000, rooms: '3.5', floor: 2, totalSquareMeters: 80,
    city: 'תל אביב יפו', neighborhood: 'מרכז', assetType: 'דירת גן', hasPrivateParking: true }),
  makeAd(103, { price: 3000000, rooms: '6', floor: 18, totalSquareMeters: 120,
    neighborhood: 'כרמל', hasPrivateParking: true, elevator: true }),
  makeAd(104, { price: 0, rooms: '7', floor: 0, totalSquareMeters: 160, city: 'באר שבע' }),
  makeAd(105, { tradeType: 'השכרה', price: 5000, rooms: '2' }),
];
export const saleIds = [104, 103, 102, 101];
