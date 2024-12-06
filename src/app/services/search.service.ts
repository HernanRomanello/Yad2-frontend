import { Injectable, signal, Signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PropertyFilters } from '../shared/models/Filters';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  propertyTypeFilterValue = signal<string>('סוג הנכס');
  priceRangeFilterValue = signal<string>('מחיר');
  roomNumberFilterValue = signal<string>('');
  additionalFilterValue = signal<string>('');
  private propertyFilters: PropertyFilters = {
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
    floorsRange: ['0', '18'],
    aptSizeRange: [0, 500],
  };

  apartmentsSortedByStreet: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  getFilters() {
    return this.propertyFilters;
  }
  setFilters(filters: PropertyFilters) {
    this.propertyFilters = filters;
  }

  adds = [
    {
      title: 'רנט איט מוריה אטריום',
      pic: 'assets/images/ad2.jpg',
      city: 'מודעין מכבים רעות',
      program: 'שכירות ארוכת טווח',
    },

    {
      title: 'אשטרום תל אביב',
      pic: 'assets/images/ad1.jpg',
      city: 'תל אביב יפו',
      program: 'מהפכת השכירות בתל אביב',
    },
    {
      title: 'מורשת טל',
      pic: 'assets/images/ad3.jpg',
      city: 'מודעין מכבים רעות',
      program: 'מבצע חד-פעמי לפנטהואוזים!',
    },
  ];
  selectedPropertyTypes: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);

  selectedPriceRange: BehaviorSubject<[number, number]> = new BehaviorSubject([
    -100000000, 100000000,
  ]);

  selectedTradeType: BehaviorSubject<'מכירה' | 'השכרה'> = new BehaviorSubject(
    'מכירה' as 'מכירה' | 'השכרה'
  );

  selectedCityText: BehaviorSubject<string> = new BehaviorSubject<string>('');

  selectedStreetText: BehaviorSubject<string> = new BehaviorSubject<string>('');

  locationSubject: BehaviorSubject<{ city: string; neighborhood: string }[]> =
    new BehaviorSubject<{ city: string; neighborhood: string }[]>([]);

  selectedRoomsAmount: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  constructor() {}

  emitSelectedTradeType(searchType: 'מכירה' | 'השכרה') {
    this.selectedTradeType.next(searchType);
  }
  emitSelectedPropertyTypes(propertyTypes: string[]) {
    this.selectedPropertyTypes.next(propertyTypes);
  }
  emitSelectedPriceRange(priceRange: [number, number]) {
    this.selectedPriceRange.next(priceRange);
  }

  emitSelectedRoomsAmount(roomsAmount: string[]) {
    this.selectedRoomsAmount.next(roomsAmount);
  }

  emitSelectedFreecityText(freeText: string) {
    this.selectedCityText.next(freeText);
    if (freeText !== '') {
      this.apartmentsSortedByStreet.next(true);
    } else {
      this.apartmentsSortedByStreet.next(false);
    }
  }

  emitSelectedStreetFunc(street: string) {
    this.selectedStreetText.next(street);
  }

  emitLocation(location: { city: string; neighborhood: string }[]) {
    this.locationSubject.next(location);
  }
}
