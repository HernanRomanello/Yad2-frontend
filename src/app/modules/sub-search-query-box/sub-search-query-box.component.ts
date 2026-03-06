import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';

import { Subscription } from 'rxjs';
import {
  City,
  CityListService,
  Street,
} from '../../services/city-list.service';
import { SearchService } from '../../services/search.service';
import {
  allowedClasses,
  allowedClassesForSearchInput,
} from '../real-estate/real-estate-search/dataUtility';
import { NavigationService } from '../../services/navigation.service';
@Component({
  selector: 'app-sub-search-query-box',
  templateUrl: './sub-search-query-box.component.html',
  styleUrl: './sub-search-query-box.component.css',
})
export class SubSearchQueryBoxComponent implements OnInit, OnDestroy {
  clickedIndex: number[] = [-1, -1, -1];
  propertyTypeFilterValue: string = 'סוג הנכס';
  priceRangeFilterValue: string = 'מחיר';
  roomNumberFilterValue: string = 'חדרים';
  searchService = inject(SearchService);
  cityList: City[] = [];
  streetList: Street[] = [];
  cityListService = inject(CityListService);
  neighborhoodSuggestion: Street[] = [];
  areaSuggestion: City[] = [];
  citySuggestion: City[] = [];
  streetSuggestion: Street[] = [];
  searchInputSubscription!: Subscription;
  firstLocationIsArea: boolean = false;

  selectedPropertyTypes: string[] = [];
  selectedPriceRange: [number, number] = [-1, 20000];
  selectedRoomsAmount: string[] = [];
  selectedOption: string | null = null;
  advertisementTypeButtonText: string = 'מכירה';
  title = 'נדל"ן למכירה';
  searchInput: string = '';
  hasSelectedStreet: boolean = false;
  hasSelectedLocation: boolean = false;
  sortButtonThatAreOpen = <[string, boolean]>['', false];
  private cityListSubscription: any;
  private streetListSubscription: any;

  countSearchInputLetters: number = 0;

  selectedStreetAndCitySearchTexts: { city: string; street: string } = {
    city: '',
    street: '',
  };

  locationList: Array<{ city: string; neighborhood: string }> = [];

  selectedCities: string[] = [];
  @ViewChild('searchInputLocation', { static: false })
  searchInputLocation!: ElementRef;

  roomsFilterIsOpen: boolean = false;
  searchSuggestionsIsOpen: boolean = false;
  historyLocationSearchIsOpen: boolean = true;
  lastHoverSearchHistory = -1;

  historyLocationSearchSuggestions: string[] = ['חיפה ', 'באר שבע', 'רמלה'];

  displayHistory(countCharacters: number) {
    this.historyLocationSearchIsOpen = countCharacters === 0 ? true : false;
  }

  constructor(private navigationService: NavigationService) {}

  showSuggestionBox(searchQuery: string) {
    this.countSearchInputLetters = searchQuery.length;
    if (this.historyLocationSearchIsOpen) {
      this.searchInput = '';
      return;
    }
    if (searchQuery.length > 1) {
      if (this.hasSelectedStreet) {
        this.resetSearchInputLocation();
        return;
      }
      this.neighborhoodSuggestion = this.getStreetSuggestions(
        searchQuery,
      ).slice(0, 5);

      this.citySuggestion =
        this.cityListService.getFirstsCitiesContainingSubstring(
          this.cityList,
          searchQuery,
          'city_name_he',
          4,
        );
      if (
        this.calculateArrayLength(this.neighborhoodSuggestion) +
          this.calculateArrayLength(this.citySuggestion) >
        8
      ) {
        this.areaSuggestion = [];
        this.streetSuggestion = [];
        return;
      }
      this.areaSuggestion = this.citySuggestion.slice(0, 1);
      if (
        this.calculateArrayLength(this.neighborhoodSuggestion) +
          this.calculateArrayLength(this.citySuggestion) >=
        8
      ) {
        this.streetSuggestion = [];
        return;
      }

      this.streetSuggestion = this.neighborhoodSuggestion.slice(
        0,
        9 -
          this.calculateArrayLength(this.neighborhoodSuggestion) -
          this.calculateArrayLength(this.citySuggestion) -
          this.calculateArrayLength(this.areaSuggestion),
      );
    }
  }

  addLocationToSearchQuery(
    city: string,
    neighborhood: string,
    areaLocation: boolean,
  ) {
    if (neighborhood != null) {
      this.hasSelectedLocation = true;
    }
    const location = { city, neighborhood };
    this.hasSelectedLocation = true;
    const hasThisLocation = this.locationList.some((loc) => {
      return loc.city === city && loc.neighborhood === neighborhood;
    });

    if (this.locationList.length >= 5 || hasThisLocation) {
      return;
    }

    this.searchService.city.set(city);
    this.searchService.neighborhood.set(neighborhood);

    this.locationList.push(location);

    if (this.locationList.length == 1 && areaLocation) {
      this.firstLocationIsArea = true;
    }
  }

  ngOnDestroy(): void {
    if (this.cityListSubscription) {
      this.cityListSubscription.unsubscribe();
    }
    if (this.streetListSubscription) {
      this.streetListSubscription.unsubscribe();
    }

    if (this.searchInputSubscription) {
      this.searchInputSubscription.unsubscribe;
    }
  }
  ngOnInit(): void {
    this.cityListSubscription = this.cityListService
      .getCityList()
      .subscribe((data) => {
        this.cityList = data;
      });

    this.streetListSubscription = this.cityListService
      .getStreetList()
      .subscribe((data) => {
        this.streetList = data;
      });
  }

  resetSearchInput() {
    this.searchSuggestionsIsOpen = false;
    this.hasSelectedStreet = false;
    this.selectedCities = [];
    this.locationList = [];
    this.firstLocationIsArea = false;
    this.hasSelectedLocation = false;
    this.selectedStreetAndCitySearchTexts = { city: '', street: '' };
    this.historyLocationSearchIsOpen = true;
    this.searchService.emitSelectedFreecityText('');
    this.searchService.emitSelectedStreetFunc('');

    this.cityListService.getCityList().subscribe((cities) => {
      this.searchService.locationList.set(
        cities.map((c: any) => ({
          city: c.city_name_he,
          neighborhood: '',
        })),
      );
    });
  }

  resetSearchInputLocation() {
    this.hasSelectedStreet = false;
    this.selectedStreetAndCitySearchTexts = { city: '', street: '' };
    this.selectedCities = [];
    this.searchService.emitSelectedFreecityText('');
    this.searchService.emitSelectedStreetFunc('');
  }

  openSeveralSearches() {
    setTimeout(() => {
      this.searchSuggestionsIsOpen = true;
    }, 50);
  }

  getStreetSuggestions(substring: string): Street[] {
    return this.streetList.filter((street) => {
      const value = street.Street_Name;
      return (
        typeof value === 'string' &&
        value.toLowerCase().includes(substring.toLowerCase())
      );
    });
  }

  calculateArrayLength(array: any[]): number {
    if (!(array.length > 0)) {
      return 0;
    }
    return array.length;
  }

  setSearchValues(city: string, street: string) {
    if (this.hasSelectedStreet) {
      this.selectedStreetAndCitySearchTexts.city = city;
      this.selectedStreetAndCitySearchTexts.street = street;
    }
  }
  reduceTextLength(text: string, length: number) {
    const Text = this.addSpaceAfterComma(text);
    if (Text.length > length) {
      return text.slice(0, length) + '...';
    }
    return Text;
  }

  addSpaceAfterComma(text: string) {
    const commaIndex = text.indexOf(',');
    if (commaIndex === text.length - 1 || commaIndex === 0) {
      return text.replace(/,/g, '');
    }

    return text.replace(/,/g, ', ');
  }

  removeSelectedLocation(city: string, neighborhood: string) {
    this.locationList = this.locationList.filter((loc) => {
      return loc.city !== city && loc.neighborhood !== neighborhood;
    });
    if (this.locationList.length === 0) {
      this.resetSearchInput();
      this.resetSearchInputLocation();
      this.searchInput = '';
    }
  }

  emitQuerySearch(SearchByStreet: boolean) {
    if (!SearchByStreet) {
      this.searchService.locationList.set(this.locationList);
    } else {
      this.searchService.emitLocation([]);
    }

    setTimeout(() => {
      this.searchSuggestionsIsOpen = false;
    }, 60);
    if (SearchByStreet) {
      this.searchService.emitSelectedStreetFunc(
        this.selectedStreetAndCitySearchTexts.street.valueOf(),
      );
      this.searchService.emitSelectedFreecityText(
        this.selectedStreetAndCitySearchTexts.city.valueOf(),
      );
    }
  }

  formatNumberWithComma(num: number): string {
    const numStr = num.toString();

    const [integerPart, fractionalPart] = numStr.split('.');

    const result: string[] = [];
    let count = 0;

    for (let i = integerPart.length - 1; i >= 0; i--) {
      result.unshift(integerPart[i]);
      count++;
      if (count % 3 === 0 && i !== 0) {
        result.unshift(',');
      }
    }

    return fractionalPart
      ? `${result.join('')}.${fractionalPart}`
      : result.join('');
  }
}
