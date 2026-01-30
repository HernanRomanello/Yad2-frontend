import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { SearchService } from '../../../services/search.service';
import {
  City,
  CityListService,
  Street,
} from '../../../services/city-list.service';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../../services/navigation.service';
import { allowedClasses, allowedClassesForSearchInput } from './dataUtility';
@Component({
  selector: 'app-real-estate-search',
  templateUrl: './real-estate-search.component.html',
  styleUrl: './real-estate-search.component.css',
})
export class RealEstateSearchComponent implements OnInit, OnDestroy {
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

  onCloseAdditionalFiltersMenu(event: any) {
    this.toggleMenu('');
  }

  constructor(private navigationService: NavigationService) {}

  clickEvent(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const clientY = event.clientY;
    const [filterName, filterOpen] = this.sortButtonThatAreOpen;

    if (
      (filterName === 'additionalFiltersMenu' && filterOpen) ||
      (filterName === 'propertyTypeMenu' && filterOpen)
    ) {
      this.navigationService.searchFilterOpenClose(true);
    } else {
      this.navigationService.searchFilterOpenClose(false);
    }

    if (
      clientY < 135 &&
      !clickedElement.classList.contains('search-button') &&
      filterOpen &&
      filterName.length > 1 &&
      filterName !== 'additionalFiltersMenu'
    ) {
      this.toggleMenu('');
    } else if (
      filterName === 'additionalFiltersMenu' &&
      clickedElement.classList.contains('overlay')
    ) {
      this.toggleMenu('');
    }

    const hasAllowedClass = Array.from(clickedElement.classList).some((cls) =>
      allowedClasses.has(cls),
    );

    if (!hasAllowedClass && filterName !== 'additionalFiltersMenu') {
      this.toggleMenu('');
    }

    if (
      clickedElement.id !== 'propertyRoomButton' &&
      clickedElement.id !== 'searchQuery'
    ) {
      const hasClass = Array.from(clickedElement.classList).some((cls) =>
        allowedClassesForSearchInput.has(cls),
      );

      if (!hasClass) {
        this.searchSuggestionsIsOpen = false;
      }
    }
  }

  toggleFavoriteAd(index: number): void {
    if (this.clickedIndex[index] === -1) {
      this.clickedIndex[index] = index;
    } else {
      this.clickedIndex[index] = -1;
    }
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

  updateButtonsLabels() {
    this.priceRangeFilterValue = this.searchService.priceRangeFilterValue();
    this.propertyTypeFilterValue = this.searchService.propertyTypeFilterValue();
    this.priceRangeFilterValue = this.searchService.priceRangeFilterValue();
    this.roomNumberFilterValue = this.searchService.roomNumberFilterValue();
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

  toggleMenu(type: string) {
    const [currentType, currentState] = this.sortButtonThatAreOpen;

    if (currentType === type) {
      this.sortButtonThatAreOpen = [type, !currentState];
    } else {
      this.sortButtonThatAreOpen = [type, true];
    }
    this.searchSuggestionsIsOpen = false;
    this.updateButtonsLabels();
    switch (type) {
      case 'propertyTypeMenu':
        this.propertyTypeFilterValue =
          this.searchService.propertyTypeFilterValue();

        break;
    }
  }

  checkTheFilter(filterType: string): boolean {
    const [name, isOpen] = this.sortButtonThatAreOpen;

    const open: boolean = name === filterType;

    if (open) {
      return isOpen;
    } else {
      return false;
    }
  }

  calculateArrayLength(array: any[]): number {
    if (!(array.length > 0)) {
      return 0;
    }
    return array.length;
  }

  applyFilter(option: 'מכירה' | 'השכרה') {
    this.searchService.needToMakeResetFilters.set(true);
    this.selectedOption = option;
    this.advertisementTypeButtonText = option;
    this.title = option === 'מכירה' ? 'נדל"ן למכירה' : 'נדל"ן להשכרה';

    if (option === 'מכירה') {
      this.searchService.forSale.set(true);
      this.searchService.forRent.set(false);
      this.searchService.forRent.set(false);
    } else if (option === 'השכרה') {
      this.searchService.forSale.set(false);
      this.searchService.forRent.set(true);
    }
    this.searchService.emitSelectedTradeType(option);
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

  onSearch() {
    this.searchSuggestionsIsOpen = false;

    this.emitQuerySearch(this.hasSelectedLocation, this.hasSelectedStreet);

    this.searchService.emitSelectedPriceRange(this.selectedPriceRange);
    this.searchService.emitSelectedPropertyTypes(this.selectedPropertyTypes);
    this.searchService.emitSelectedRoomsAmount(this.selectedRoomsAmount);
    this.toggleMenu('');
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
  onPriceRangeSelected(priceRange: [number, number]) {
    let newValue = 'מחיר';
    if (priceRange[0] < priceRange[1] && priceRange[1] !== 20000) {
      newValue = `${this.formatNumberWithComma(
        priceRange[0],
      )} ₪ - ${this.formatNumberWithComma(priceRange[1])} ₪`;
    } else if (priceRange[1] === 20000) {
      newValue = `${this.formatNumberWithComma(
        priceRange[0],
      )} ₪ - ${this.formatNumberWithComma(priceRange[1])}+ ₪`;
    } else if (priceRange[0] < priceRange[1]) {
      newValue = `${this.formatNumberWithComma(
        priceRange[1],
      )} ₪ - ${this.formatNumberWithComma(priceRange[0])} ₪`;
    }
    this.searchService.minPrice.set(priceRange[0]);
    this.searchService.maxPrice.set(priceRange[1]);
    this.searchService.priceRangeFilterValue.set(newValue);
    this.selectedPriceRange = priceRange;
  }

  onPropertyTypeSelected(propertyTypes: string[]) {
    const uniquePropertyTypes = [...new Set(propertyTypes)];
    let optionsNumber = uniquePropertyTypes.length;
    if (optionsNumber === 0) {
      this.searchService.propertyTypeFilterValue.set('סוג הנכס');
    } else if (optionsNumber === 1) {
      this.searchService.propertyTypeFilterValue.set(propertyTypes[0]);
    } else if (optionsNumber > 1) {
      let count = 0;
      if (uniquePropertyTypes.includes('דירות_הכל')) {
        optionsNumber--;
        count++;
      }
      if (uniquePropertyTypes.includes('בתים_הכל')) {
        optionsNumber--;
        count++;
      }
      this.searchService.propertyTypeFilterValue.set(
        `סוג הנכס (${optionsNumber - count}) `,
      );
    }

    if (optionsNumber === 11 && propertyTypes.includes('דירות_הכל')) {
      this.searchService.propertyTypeFilterValue.set('דירות');
    }
    if (optionsNumber === 4 && propertyTypes.includes('בתים_הכל')) {
      this.searchService.propertyTypeFilterValue.set('בתים');
    }

    if (propertyTypes.length > 0) {
      this.selectedPropertyTypes = uniquePropertyTypes;

      this.searchService.assetTypeList.set(
        this.transformArrayTOPropertyTypesString(uniquePropertyTypes),
      );
    }
  }

  transformArrayTOPropertyTypesString(propertyTypes: string[]): string {
    let searchText = '';

    propertyTypes.forEach((propertyType) => {
      if (propertyType !== 'דירות_הכל' && propertyType !== 'בתים_הכל') {
        searchText += propertyType + ', ';
      }
    });
    if (searchText.endsWith(', ')) {
      searchText = searchText.slice(0, -2);
    }
    return searchText;
  }

  onRoomsAmountSelected(roomsAmount: string[]) {
    this.roomsFilterIsOpen = true;
    const minRooms = Math.min(...roomsAmount.map((room) => parseFloat(room)));
    const maxRooms = Math.max(...roomsAmount.map((room) => parseFloat(room)));
    let buttonText = 'חדרים';
    if (minRooms !== maxRooms) {
      buttonText = `${minRooms} - ${maxRooms}` + ' חדרים';
    } else if (maxRooms > 0) {
      buttonText = `${maxRooms}` + ' חדרים';
    }

    this.searchService.minRooms.set(minRooms);
    this.searchService.maxRooms.set(maxRooms);
    this.searchService.roomNumberFilterValue.set(buttonText);
    this.selectedRoomsAmount = roomsAmount;
  }

  isPriceRangeSelected() {
    return this.selectedPriceRange[0] !== -1;
  }
}
