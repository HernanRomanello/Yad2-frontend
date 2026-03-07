import { Component, OnDestroy, inject } from '@angular/core';
import { SearchService } from '../../../services/search.service';

import { Subscription } from 'rxjs';
import { NavigationService } from '../../../services/navigation.service';
import { allowedClasses, allowedClassesForSearchInput } from './dataUtility';
@Component({
  selector: 'app-real-estate-search',
  templateUrl: './real-estate-search.component.html',
  styleUrl: './real-estate-search.component.css',
})
export class RealEstateSearchComponent implements OnDestroy {
  clickedIndex: number[] = [-1, -1, -1];
  propertyTypeFilterValue: string = 'סוג הנכס';
  priceRangeFilterValue: string = 'מחיר';
  roomNumberFilterValue: string = 'חדרים';
  searchService = inject(SearchService);
  searchInputSubscription!: Subscription;
  selectedPropertyTypes: string[] = [];
  selectedPriceRange: [number, number] = [-1, 20000];
  selectedRoomsAmount: string[] = [];
  selectedOption: string | null = null;
  advertisementTypeButtonText: string = 'מכירה';
  title = 'נדל"ן למכירה';
  sortButtonThatAreOpen = <[string, boolean]>['', false];
  private cityListSubscription: any;
  private streetListSubscription: any;
  roomsFilterIsOpen: boolean = false;

  onCloseAdditionalFiltersMenu(event: any) {
    this.toggleMenu('');
  }

  constructor(private navigationService: NavigationService) {}

  clickEvent(event: MouseEvent) {
    console.log(this.sortButtonThatAreOpen);
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
        this.searchService.searchSuggestionsIsOpen.set(false);
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

  updateButtonsLabels() {
    this.priceRangeFilterValue = this.searchService.priceRangeFilterValue();
    this.propertyTypeFilterValue = this.searchService.propertyTypeFilterValue();
    this.priceRangeFilterValue = this.searchService.priceRangeFilterValue();
    this.roomNumberFilterValue = this.searchService.roomNumberFilterValue();
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

  hideMatIcon(index: number): boolean {
    const hideIcon: boolean =
      this.sortButtonThatAreOpen[0] === 'propertyTypeMenu' ||
      this.sortButtonThatAreOpen[0] === 'additionalFiltersMenu';
    if (index === 0 && hideIcon && this.sortButtonThatAreOpen[1]) {
      return false;
    }
    return true;
  }

  toggleMenu(type: string) {
    const [currentType, currentState] = this.sortButtonThatAreOpen;
    if (currentType === type) {
      this.sortButtonThatAreOpen = [type, !currentState];
    } else {
      this.sortButtonThatAreOpen = [type, true];
    }
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

  applyFilter(option: 'מכירה' | 'השכרה') {
    this.searchService.needToMakeResetFilters.set(true);
    this.selectedOption = option;
    this.advertisementTypeButtonText = option;
    this.title = option === 'מכירה' ? 'נדל"ן למכירה' : 'נדל"ן להשכרה';

    if (option === 'מכירה') {
      this.searchService.forSale.set(true);
      this.searchService.forRent.set(false);
    } else if (option === 'השכרה') {
      this.searchService.forSale.set(false);
      this.searchService.forRent.set(true);
    }
    this.searchService.emitSelectedTradeType(option);
  }

  addSpaceAfterComma(text: string) {
    const commaIndex = text.indexOf(',');
    if (commaIndex === text.length - 1 || commaIndex === 0) {
      return text.replace(/,/g, '');
    }

    return text.replace(/,/g, ', ');
  }

  emitQuerySearch() {
    if (this.searchService.locationList().length > 0) {
      this.searchService.emitLocation(this.searchService.locationList());
    }
  }

  onSearch() {
    this.emitQuerySearch();

    this.searchService.emitSelectedPriceRange(this.selectedPriceRange);
    this.searchService.emitSelectedPropertyTypes(this.selectedPropertyTypes);
    this.searchService.emitSelectedRoomsAmount(this.selectedRoomsAmount);
    this.toggleMenu('');
  }

  onPriceRangeSelected(priceRange: [number, number]) {
    let newValue = 'מחיר';
    if (priceRange[0] < priceRange[1] && priceRange[1] !== 20000) {
      newValue = `${this.searchService.formatNumberWithComma(
        priceRange[0],
      )} ₪ - ${this.searchService.formatNumberWithComma(priceRange[1])} ₪`;
    } else if (priceRange[1] === 20000) {
      newValue = `${this.searchService.formatNumberWithComma(
        priceRange[0],
      )} ₪ - ${this.searchService.formatNumberWithComma(priceRange[1])}+ ₪`;
    } else if (priceRange[0] < priceRange[1]) {
      newValue = `${this.searchService.formatNumberWithComma(
        priceRange[1],
      )} ₪ - ${this.searchService.formatNumberWithComma(priceRange[0])} ₪`;
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
        this.searchService.transformArrayTOPropertyTypesString(
          uniquePropertyTypes,
        ),
      );
    }
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
