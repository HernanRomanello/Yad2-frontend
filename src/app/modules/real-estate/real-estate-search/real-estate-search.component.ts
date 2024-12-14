import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { SearchService } from '../../../services/search.service';
import { formatPrice } from '../../../utilities';
import {
  City,
  CityListService,
  Street,
} from '../../../services/city-list.service';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../../services/navigation.service';
import e from 'express';
@Component({
  selector: 'app-real-estate-search',
  templateUrl: './real-estate-search.component.html',
  styleUrl: './real-estate-search.component.css',
})
export class RealEstateSearchComponent
  implements OnInit, OnDestroy, AfterViewInit
{
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
  advertisementTypebuttonText: string = 'מכירה';
  title = 'נדל"ן למכירה';
  searchInput: string = '';
  hasSelectedStreet: boolean = false;
  hasSelectedLocation: boolean = false;

  countSearchInputLetters: number = 0;

  selectedStreetAndCitySearchTexts: { city: string; street: string } = {
    city: '',
    street: '',
  };

  locationList: Array<{ city: string; neighborhood: string }> = [];

  selectedCities: string[] = [];
  @ViewChild('searchInputLocation', { static: false })
  searchInputLocation!: ElementRef;

  @ViewChild('propertyTypeMenu', { static: false })
  propertyTypeMenu!: ElementRef;

  @ViewChild('roomsAmountMenu', { static: false })
  roomsAmountMenu!: ElementRef;

  @ViewChild('priceSlider', { static: false })
  priceSlider!: ElementRef;

  @ViewChild('additionalFiltersMenu', { static: false })
  additionalFiltersMenu!: ElementRef;

  @ViewChild('priceSliderButton', { static: false })
  priceSliderButton!: ElementRef;

  @ViewChild('tradeTypeMenu', { static: false })
  tradeTypeMenu!: ElementRef;
  roomsFilterIsOpen: boolean = false;
  searchSuggestionsIsOpen: boolean = false;
  historyLocationSearchIsOpen: boolean = true;
  lastHoverSearchHistory = -1;

  historyLocationSearchSuggestions: string[] = ['חיפה ', 'באר שבע', 'רמלה'];

  displayHistory(countCharacters: number) {
    this.historyLocationSearchIsOpen = countCharacters === 0 ? true : false;
  }

  onCloseAdditionalFiltersMenu(event: any) {
    this.additionalFiltersMenu.nativeElement
      .querySelector('.menu')
      .classList.add('hidden');
  }

  constructor(
    private navigationService: NavigationService,
    private render: Renderer2
  ) {
    afterNextRender(() => {
      document.body.addEventListener('click', (event) => {
        const clickedElement = event.target as HTMLElement;
        if (
          !clickedElement.classList.contains('search-button') &&
          !clickedElement.classList.contains('rooms-select') &&
          !clickedElement.classList.contains('room-btn') &&
          !clickedElement.classList.contains('p-slider-handle') &&
          !clickedElement.classList.contains('slider') &&
          !clickedElement.classList.contains('price') &&
          !clickedElement.classList.contains('price-slider-bg') &&
          !clickedElement.classList.contains('price-container') &&
          !clickedElement.classList.contains('hyphen') &&
          !clickedElement.classList.contains('property-type-header') &&
          !clickedElement.classList.contains('property-type-select') &&
          !clickedElement.classList.contains('property-type selected') &&
          !clickedElement.classList.contains('property-type') &&
          !clickedElement.classList.contains('material-icons')
        ) {
          const roomsAmountContainer =
            document.getElementById('propertyRoomButton');
          roomsAmountContainer?.click();
          roomsAmountContainer?.click();
          const propertyRoomArrow =
            document.getElementById('propertyRoomArrow');
          this.render.addClass(propertyRoomArrow, 'not-Rotate');
          this.rotateAllArrows('');

          this.hideAllMenus('');
          if (!clickedElement.classList.contains('overlay')) {
            this.navigationService.IsSearchFilterOpen.set(false);
          }
        }

        if (this.propertyTypeMenu.nativeElement.contains(clickedElement)) {
          return;
        } else if (this.priceSlider.nativeElement.contains(clickedElement)) {
          if (this.selectedPriceRange[0] !== -1) {
          }

          return;
        }

        const isSliderHidden = this.priceSlider.nativeElement
          .querySelector('.menu')
          .classList.contains('hidden');

        this.priceRangeFilterValue = this.searchService.priceRangeFilterValue();

        if (!isSliderHidden && this.selectedPriceRange[0] !== -1) {
          changeButtonInnerHtml(
            this.priceSliderButton,
            this.selectedPriceRange
          );
        }

        this.propertyTypeMenu.nativeElement
          .querySelector('.menu')
          .classList.add('hidden');
        this.propertyTypeFilterValue =
          this.searchService.propertyTypeFilterValue();

        this.priceSlider.nativeElement
          .querySelector('.menu')
          .classList.add('hidden');

        this.priceRangeFilterValue = this.searchService.priceRangeFilterValue();

        this.rotateAllArrows('tradeTypeArrow');
        if (
          !clickedElement.classList.contains('search-button') &&
          !clickedElement.classList.contains('arrow-up')
        ) {
          this.tradeTypeMenu.nativeElement
            .querySelector('.menu')
            .classList.add('hidden');
          const arrow =
            this.tradeTypeMenu.nativeElement.querySelector('#tradeTypeArrow');
          if (arrow) {
            if (arrow.classList.contains('arrow-up')) {
              arrow.classList.remove('arrow-up');
            }
          }
        }
        function changeButtonInnerHtml(
          priceSliderButton: ElementRef,
          selectedPriceRange: [number, number]
        ) {
          priceSliderButton.nativeElement.innerText = `${formatPrice(
            selectedPriceRange[1]
          )} - ${formatPrice(selectedPriceRange[0])}
          `;
          priceSliderButton.nativeElement.innerHTML +=
            '<i class="material-icons">keyboard_arrow_down</i>';
        }
      });
    });
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
        searchQuery
      ).slice(0, 5);

      this.citySuggestion =
        this.cityListService.getFirstsCitiesContainingSubstring(
          this.cityList,
          searchQuery,
          'city_name_he',
          4
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
          this.calculateArrayLength(this.areaSuggestion)
      );
    }
  }

  addLocationToSearchQuery(
    city: string,
    neighborhood: string,
    areaLocation: boolean
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

  ngAfterViewInit() {
    document.body.addEventListener('click', (event) => {
      const clickedElement = event.target as HTMLElement;
      if (
        clickedElement.id !== 'propertyRoomButton' &&
        clickedElement.id !== 'searchQuery'
      ) {
        if (
          !clickedElement.classList.contains('search-suggestion') &&
          !clickedElement.classList.contains('title-locationSuggestions') &&
          !clickedElement.classList.contains('comma') &&
          !clickedElement.classList.contains('valid') &&
          !clickedElement.classList.contains('title-locationSuggestion') &&
          !clickedElement.classList.contains('sub-search')
        ) {
          this.searchSuggestionsIsOpen = false;
        }
      }
    });
  }
  private cityListSubscription: any;
  private streetListSubscription: any;

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

  toggleMenu(
    type:
      | 'priceSlider'
      | 'propertyTypeMenu'
      | 'roomsAmountMenu'
      | 'additionalFiltersMenu'
      | 'tradeTypeMenu'
  ) {
    switch (type) {
      case 'priceSlider':
        this.toggleMenuDropdown(this.priceSlider);
        this.rotateAllArrows('PriceRangeArrow');
        this.hideAllMenus('PriceRangeMenu');
        this.roomsFilterIsOpen = false;
        break;
      case 'propertyTypeMenu':
        this.toggleMenuDropdown(this.propertyTypeMenu);
        this.propertyTypeFilterValue =
          this.searchService.propertyTypeFilterValue();
        this.rotateAllArrows('propertyTypeArrow');
        this.hideAllMenus('propertyTypeMenu');
        this.roomsFilterIsOpen = false;
        this.navigationService.searchFilterOpenClose();

        break;
      case 'roomsAmountMenu':
        const propertyRoomArrow = document.getElementById('propertyRoomArrow');
        this.render.removeClass(propertyRoomArrow, 'not-Rotate');
        this.toggleMenuDropdown(this.roomsAmountMenu);
        this.rotateAllArrows('roomsAmountMenu');
        this.hideAllMenus('propertyRoomMenu');
        break;
      case 'additionalFiltersMenu':
        this.hideAllMenus('additionalFiltersArrow');
        this.toggleMenuDropdown(this.additionalFiltersMenu);
        this.navigationService.searchFilterOpenClose();

        break;
      case 'tradeTypeMenu':
        this.toggleMenuDropdown(this.tradeTypeMenu);
        this.rotateAllArrows('tradeTypeArrow');
        this.hideAllMenus('tradeTypeMenu');
        this.roomsFilterIsOpen = false;
        break;
    }
  }

  toggleMenuDropdown(tradeTypeMenu: any): void {
    const menu = tradeTypeMenu.nativeElement.querySelector('.menu');
    if (menu) {
      menu.classList.toggle('hidden');
      this.roomNumberFilterValue = this.searchService.roomNumberFilterValue();
      this.priceRangeFilterValue = this.searchService.priceRangeFilterValue();
    }

    const arrow = tradeTypeMenu.nativeElement.querySelector('.material-icons');
    if (arrow) {
      arrow.classList.toggle('arrow-up');
    }
  }

  rotateAllArrows(id: string) {
    const arrows = document.querySelectorAll('.material-icons');

    arrows.forEach((arrow) => {
      if (arrow.classList.contains('arrow-up') && arrow.id !== id) {
        arrow.classList.remove('arrow-up');
      }
    });
  }

  hideAllMenus(id: string) {
    const menus = document.querySelectorAll('.menu');

    menus.forEach((menu) => {
      if (!menu.classList.contains('hidden') && menu.id !== id) {
        if (menu.id !== 'additionalFiltersMenu') {
          menu.classList.add('hidden');

          this.priceRangeFilterValue =
            this.searchService.priceRangeFilterValue();
        }
      }
    });
  }

  calculateArrayLength(array: any[]): number {
    if (!(array.length > 0)) {
      return 0;
    }
    return array.length;
  }

  applyFilter(option: 'מכירה' | 'השכרה') {
    this.selectedOption = option;
    this.advertisementTypebuttonText = option;
    this.title = option === 'מכירה' ? 'נדל"ן למכירה' : 'נדל"ן להשכרה';
    this.tradeTypeMenu.nativeElement
      .querySelector('.menu')
      .classList.add('hidden');
    if (option === 'מכירה') {
      this.searchService.forSale.set(true);
      this.searchService.forRent.set(false);
    } else if (option === 'השכרה') {
      this.searchService.forSale.set(false);
      this.searchService.forRent.set(true);
    }
    this.searchService.emitSelectedTradeType(option);
  }

  hideSearchMenu() {
    setTimeout(() => {
      if (
        this.hasSelectedStreet === false &&
        this.hasSelectedLocation === false
      ) {
        this.searchSuggestionsIsOpen = false;
      }
    }, 100);
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
        this.selectedStreetAndCitySearchTexts.street.valueOf()
      );
      this.searchService.emitSelectedFreecityText(
        this.selectedStreetAndCitySearchTexts.city.valueOf()
      );
    }
  }

  onSearch() {
    this.searchSuggestionsIsOpen = false;

    this.emitQuerySearch(this.hasSelectedLocation, this.hasSelectedStreet);
    const roomsAmountContainer =
      this.roomsAmountMenu.nativeElement.querySelector('.menu');
    if (roomsAmountContainer) {
      roomsAmountContainer.classList.add('hidden');
    }
    this.searchService.emitSelectedPriceRange(this.selectedPriceRange);
    this.searchService.emitSelectedPropertyTypes(this.selectedPropertyTypes);
    this.searchService.emitSelectedRoomsAmount(this.selectedRoomsAmount);
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
        priceRange[0]
      )} ₪ - ${this.formatNumberWithComma(priceRange[1])} ₪`;
    } else if (priceRange[1] === 20000) {
      newValue = `${this.formatNumberWithComma(
        priceRange[0]
      )} ₪ - ${this.formatNumberWithComma(priceRange[1])}+ ₪`;
    } else if (priceRange[0] < priceRange[1]) {
      newValue = `${this.formatNumberWithComma(
        priceRange[1]
      )} ₪ - ${this.formatNumberWithComma(priceRange[0])} ₪`;
    }
    this.searchService.priceRangeFilterValue.set(newValue);
    this.selectedPriceRange = priceRange;
  }

  onPropertyTypeSelected(propertyTypes: string[]) {
    const uniquePropertyTypes = [...new Set(propertyTypes)];
    let optionsNumber = uniquePropertyTypes.length;
    //hernan
    // console.log('optionsNumber', propertyTypes);
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
        `סוג הנכס (${optionsNumber - count}) `
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
        this.transformArrayTOPropertyTypesString(uniquePropertyTypes)
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
