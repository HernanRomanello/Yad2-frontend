import { FormControl } from '@angular/forms';

export type AdvertisementFormValue = {
  city: string;
  tradeType: string;
  street: string;
  number: string;
  floor: string;
  totalFloors: string;

  onPillars: boolean;
  neighborhood: string;
  area: string;

  assetType: string;
  assetState: string;

  airDirections: number;
  view: string;
  rearProperty: boolean;

  rooms: string;
  showerRooms: number;
  privateParking: number;
  hasPrivateParking: boolean;

  hasBolcony: boolean;
  hasImage: boolean;
  hasPrice: boolean;

  needsRenovation: boolean;
  isWellMaintained: boolean;
  isRenovated: boolean;
  isNew: boolean;
  isNewFromBuilder?: boolean;

  balconiesNumber: number;

  accessibleForDisabled: boolean;
  airConditioning: boolean;
  windowBars: boolean;
  solarWaterHeater: boolean;
  elevator: boolean;
  forRoommates: boolean;
  furnished: boolean;
  separateUnit: boolean;
  kosherKitchen: boolean;
  petsAllowed: boolean;
  renovated: boolean;
  safeRoom: boolean;
  multiLockDoors: boolean;
  airConditioner: boolean;
  tornadoAirConditioner: boolean;
  storageRoom: boolean;

  description: string;
  furnituredescription: string;

  numberOfPayments: number | null;
  houseCommitteePayment: number | null;
  municipalityMonthlyPropertyTax: number | null;
  builtSquareMeters: number | null;
  gardenSquareMeters: number | null;
  totalSquareMeters: string;

  price: number | null;
  minimumAmount: number | null;
  pricePerMeter: number | null;

  entryDate: string;
  immediate: boolean;
  flexible: boolean;
  longTerm: boolean;

  pictures: string[];
  video: string;

  contactName: string;
  secondContactName: string;
  contactPhone: string;
  secondContactPhone: string;

  standardizationAccepted: boolean;
};

export type CreateAdvertisementRequest = AdvertisementFormValue & {
  pictures: string[];
  video: string;
};

export type AdvertisementForm = {
  [K in keyof AdvertisementFormValue]: FormControl<AdvertisementFormValue[K]>;
};

export type AdvertisementFormKey = keyof AdvertisementForm;

export type BooleanFormKey = {
  [K in keyof AdvertisementFormValue]: AdvertisementFormValue[K] extends boolean
    ? K
    : never;
}[keyof AdvertisementFormValue];

export type BooleanControlKey = {
  [K in keyof AdvertisementForm]: AdvertisementForm[K] extends FormControl<boolean>
    ? K
    : never;
}[keyof AdvertisementForm];
