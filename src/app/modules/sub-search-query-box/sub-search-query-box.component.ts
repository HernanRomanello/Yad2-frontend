import {
  Component,
  ElementRef,
  inject,
  ViewChild,
  signal,
} from '@angular/core';
import { SearchService } from '../../services/search.service';
import {
  City,
  CityListService,
  Street,
} from '../../services/city-list.service';

@Component({
  selector: 'app-sub-search-query-box',
  templateUrl: './sub-search-query-box.component.html',
  styleUrl: './sub-search-query-box.component.css',
})
export class SubSearchQueryBoxComponent {
  searchSuggestionsIsOpen: boolean = false;
  hasSelectedStreet: boolean = false;
  locationList: Array<{ city: string; neighborhood: string }> = [];
  hasSelectedLocation: boolean = false;
  firstLocationIsArea: boolean = false;
  countSearchInputLetters: number = 0;
  historyLocationSearchIsOpen: boolean = true;
  searchInput: string = '';
  searchService = inject(SearchService);
  cityListService = inject(CityListService);
  selectedCities: string[] = [];
  neighborhoodSuggestion: Street[] = [];
  streetList: Street[] = [];
  citySuggestion: City[] = [];
  cityList: City[] = [];
  areaSuggestion: City[] = [];
  streetSuggestion: Street[] = [];
  historyLocationSearchSuggestions: string[] = ['חיפה ', 'באר שבע', 'רמלה'];
  lastHoverSearchHistory = -1;
  searchInputLocationQuery = signal<string>('');
  // @ViewChild('searchInputLocation', { static: false })
  // searchInputLocation!: ElementRef;

  setSearchValues(city: string, street: string) {
    if (this.hasSelectedStreet) {
      this.selectedStreetAndCitySearchTexts.city = city;
      this.selectedStreetAndCitySearchTexts.street = street;
    }
  }

  test(value: string) {
    console.log(value);
  }

  displayHistory(countCharacters: number) {
    this.historyLocationSearchIsOpen = countCharacters === 0 ? true : false;
  }

  emitQuerySearch(searchByLocation: boolean, SearchByStreet: boolean) {
    if (searchByLocation && !SearchByStreet) {
      this.searchService.emitLocation(this.locationList);
    } else if (!searchByLocation) {
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

  reduceTextLength(text: string, length: number) {
    const Text = this.addSpaceAfterComma(text);
    if (Text.length > length) {
      return text.slice(0, length) + '...';
    }
    return Text;
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

  openSeveralSearches() {
    setTimeout(() => {
      this.searchSuggestionsIsOpen = true;
    }, 50);
  }

  addSpaceAfterComma(text: string) {
    const commaIndex = text.indexOf(',');
    if (commaIndex === text.length - 1 || commaIndex === 0) {
      return text.replace(/,/g, '');
    }

    return text.replace(/,/g, ', ');
  }

  selectedStreetAndCitySearchTexts: { city: string; street: string } = {
    city: '',
    street: '',
  };
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

  resetSearchInputLocation() {
    this.hasSelectedStreet = false;
    this.selectedStreetAndCitySearchTexts = { city: '', street: '' };
    this.selectedCities = [];
    this.searchService.emitSelectedFreecityText('');
    this.searchService.emitSelectedStreetFunc('');
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

  //////// test

  handleLocationInput(value: string) {
    this.searchInputLocationQuery.set(value);
    if (value.length > 1) {
      this.showSuggestionBox(value);
      this.hasSelectedLocation = false;
    } else {
      this.hasSelectedLocation = true;
    }

    this.cityListService.getCityList().subscribe((cities) => {
      this.cityList = cities;

      console.log(this.cityList);
    });

    // this.test(value);
    // alert(value);
    // console.log(value);
  }

  effect() {
    if (this.searchInputLocationQuery().length > 1) {
      this.searchSuggestionsIsOpen = false;
    }
  }
}
