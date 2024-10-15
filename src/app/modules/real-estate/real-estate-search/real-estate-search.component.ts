import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
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
import { debounceTime, fromEvent, map, Subscription } from 'rxjs';
@Component({
  selector: 'app-real-estate-search',
  templateUrl: './real-estate-search.component.html',
  styleUrl: './real-estate-search.component.css',
})
export class RealEstateSearchComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  searchService = inject(SearchService);
  cityList: City[] = [];
  streetList: Street[] = [];
  cityListService = inject(CityListService);
  neighborhoodSuggestion: Street[] = [];
  areaSuggestion: City[] = [];
  citySuggestion: City[] = [];
  streetSuggestion: Street[] = [];
  searchInputSubscription!: Subscription;
  subSearchInput = '';

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

  constructor() {
    afterNextRender(() => {
      document.body.addEventListener('click', (event) => {
        const clickedElement = event.target as HTMLElement;
        if (
          !clickedElement.classList.contains('search-button') &&
          !clickedElement.classList.contains('rooms-select') &&
          !clickedElement.classList.contains('room-btn')
        ) {
          const roomsAmountContainer =
            document.getElementById('propertyRoomButton');
          roomsAmountContainer?.click();
          this.hideAllMenus('');
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

        if (!isSliderHidden && this.selectedPriceRange[0] !== -1) {
          changeButtonInnerHtml(
            this.priceSliderButton,
            this.selectedPriceRange
          );
        }

        this.propertyTypeMenu.nativeElement
          .querySelector('.menu')
          .classList.add('hidden');
        this.priceSlider.nativeElement
          .querySelector('.menu')
          .classList.add('hidden');
        this.rotateAllArrows('tradeTypeArrow');

        if (!clickedElement.classList.contains('search-button')) {
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

  addLocationToSearchQuery(city: string, neighborhood: string) {
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
    this.locationList.push(location);
    this.searchService.emitLocation(this.locationList);

    this.subSearchInput = '';
  }

  ngAfterViewInit() {
    this.searchInputSubscription = fromEvent(
      this.searchInputLocation.nativeElement,
      'input'
    )
      .pipe(
        debounceTime(300),
        map((event: any) => event.target.value)
      )
      .subscribe((searchQuery) => {
        this.historyLocationSearchIsOpen =
          searchQuery.length > 0 ? false : true;
        if (this.historyLocationSearchIsOpen) {
          this.searchInput = '';
          return;
        }
        if (searchQuery.length > 1) {
          this.showSuggestionBox(searchQuery);
        }
      });
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
        this.rotateAllArrows('propertyTypeArrow');
        this.hideAllMenus('propertyTypeMenu');
        this.roomsFilterIsOpen = false;

        break;
      case 'roomsAmountMenu':
        this.toggleMenuDropdown(this.roomsAmountMenu);
        this.rotateAllArrows('propertyRoomArrow');
        this.hideAllMenus('propertyRoomMenu');
        break;
      case 'additionalFiltersMenu':
        this.hideAllMenus('additionalFiltersArrow');
        this.toggleMenuDropdown(this.additionalFiltersMenu);
        this.roomsFilterIsOpen = false;

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

  emitQuerySearch(SearchByCities: boolean, SearchByStreet: boolean) {
    if (SearchByCities) {
      // this.searchService.emitSelectedFreecityText(
      //   this.selectedStreetAndCitySearchTexts.city.valueOf()
      // );
    }
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
    const roomsAmountContainer =
      this.roomsAmountMenu.nativeElement.querySelector('.menu');
    if (roomsAmountContainer) {
      roomsAmountContainer.classList.add('hidden');
    }
    this.searchService.emitSelectedPriceRange(this.selectedPriceRange);
    this.searchService.emitSelectedPropertyTypes(this.selectedPropertyTypes);
    this.searchService.emitSelectedRoomsAmount(this.selectedRoomsAmount);
  }

  onPriceRangeSelected(priceRange: [number, number]) {
    this.selectedPriceRange = priceRange;
  }

  onPropertyTypeSelected(propertyTypes: string[]) {
    this.selectedPropertyTypes = propertyTypes;
  }

  onRoomsAmountSelected(roomsAmount: string[]) {
    this.selectedRoomsAmount = roomsAmount;
  }

  isPriceRangeSelected() {
    return this.selectedPriceRange[0] !== -1;
  }
}
