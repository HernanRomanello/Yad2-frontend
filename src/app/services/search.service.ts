import { Injectable, signal, Signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PropertyFilters } from '../shared/models/Filters';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { LastsearchesModel } from '../shared/models/LastsearchesModel';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  Url = environment.URl;
  propertyTypeFilterValue = signal<string>('סוג הנכס');
  priceRangeFilterValue = signal<string>('מחיר');
  roomNumberFilterValue = signal<string>('חדרים');
  additionalFilterValue = signal<string>('');
  minFloor = signal<number>(-1);
  maxFloor = signal<number>(20);
  minSquareSize = signal<number>(0);
  maxSqaureSize = signal<number>(99999999);
  constructor(private httpClient: HttpClient) {}
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
    floorsRange: ['-1', '180'],
    aptSizeRange: [0, 9999999999],
  };

  apartmentsSortedByStreet: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  getFilters() {
    return this.propertyFilters;
  }
  setFilters(filters: PropertyFilters) {
    this.propertyFilters = filters;
    this.propertyFilters.floorsRange = [
      this.minFloor().toString(),
      this.maxFloor().toString(),
    ];
    this.propertyFilters.aptSizeRange = [
      this.minSquareSize(),
      this.maxSqaureSize(),
    ];
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

  GetUserLastSearches() {
    return this.httpClient.get<LastsearchesModel>(
      this.Url + 'api/Users/user/GetLastSearches'
    );
  }
}
