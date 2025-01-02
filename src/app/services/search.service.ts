import { Injectable, signal } from '@angular/core';
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
  minRooms = signal<number>(0);
  maxRooms = signal<number>(0);
  minPrice = signal<number>(0);
  maxPrice = signal<number>(0);
  minSquareSize = signal<number>(0);
  maxSqaureSize = signal<number>(99999999);
  uniqueMonthDayArray = signal<{ month: number; day: number }[]>([]);
  city = signal<string>('');
  neighborhood = signal<string>('');
  assetTypeList = signal<string>('');
  forRent = signal<boolean>(false);
  forSale = signal<boolean>(true);
  needToMakeResetFilters = signal<boolean>(false);

  public UserLastSearches = new BehaviorSubject<LastsearchesModel[]>([]);
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
      program: 'המרכז החדש של מודעין',
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
    this.httpClient
      .get<LastsearchesModel[]>(this.Url + 'api/Users/user/GetLastSearches')
      .subscribe((data) => {
        this.UserLastSearches.next(data);
        const uniqueMonthDayArray = data
          .map((search) => ({
            month: search.monthOfCreation,
            day: search.dayOfCreation,
          }))
          .filter(
            (value, index, self) =>
              index ===
              self.findIndex(
                (t) => t.month === value.month && t.day === value.day
              )
          );

        this.uniqueMonthDayArray.set(uniqueMonthDayArray);
      });
  }

  removeLastSearch(id: string) {
    this.httpClient
      .delete(this.Url + 'api/Users/user/DeleteLastSearch/' + id)
      .subscribe(
        () => {
          this.GetUserLastSearches();
        },
        (error) => {
          console.error('Error deleting last search:', error);
        }
      );
  }

  removeAllLastSearches() {
    this.httpClient
      .delete(this.Url + 'api/Users/user/DeleteAllLastSearches')
      .subscribe(
        () => {
          this.GetUserLastSearches();
        },
        (error) => {
          console.error('Error deleting all last searches:', error);
        }
      );
  }

  addLastSearchToDB() {
    const lastSearch = {
      city: this.city(),
      neighborhood: this.neighborhood(),
      forSale: this.forSale(),
      forRent: this.forRent(),
      moshavOrKibuutz: this.propertyFilters.moshavOrKibutz,
      assetType: this.assetTypeList(),
      minRooms: this.minRooms(),
      maxRooms: this.maxRooms(),
      minPrice: this.minPrice(),
      maxPrice: this.maxPrice(),
      hasImmediateEntry: false,
      hasAccessibleForDisabled: this.propertyFilters.accessibleForDisabled,
      hasAirConditioner: this.propertyFilters.airConditioner,
      hasExclusivity: this.propertyFilters.exclusivity,
      hasBalcony: this.propertyFilters.hasBolcony,
      hasWindowBars: this.propertyFilters.windowBars,
      minFloor: this.minFloor(),
      maxFloor: this.maxFloor(),
      forRoommates: this.propertyFilters.forRoommates,
      hasFurnished: this.propertyFilters.furnished,
      hasPrivateParking: this.propertyFilters.hasPrivateParking,
      petsAllowed: this.propertyFilters.petsAllowed,
      hasPrice: this.propertyFilters.hasPrice,
      hasImage: this.propertyFilters.hasImage,
      isRenovated: this.propertyFilters.renovated,
      hasSafeRoom: this.propertyFilters.safeRoom,
      hasElevator: this.propertyFilters.elevator,
      minSquareSize: this.minSquareSize(),
      maxSquareSize: this.maxSqaureSize(),
      hasStorageRoom: this.propertyFilters.storageRoom,
    };
    this.httpClient
      .post(this.Url + 'api/Users/user/AddLastSearch', lastSearch)
      .subscribe(
        () => {
          this.GetUserLastSearches();
        },
        (error) => {
          console.error('Error adding last search:', error);
        }
      );
  }
}
