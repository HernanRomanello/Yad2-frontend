import { Component, EventEmitter, Output, inject } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { PropertyFilters } from '../../shared/models/Filters';
import { NavigationService } from '../../services/navigation.service';
import { min } from 'moment';

@Component({
  selector: 'app-real-estate-additional-filters',
  templateUrl: './real-estate-additional-filters.component.html',
  styleUrl: './real-estate-additional-filters.component.css',
})
export class RealEstateAdditionalFiltersComponent {
  tradeType: 'השכרה' | 'מכירה' = 'מכירה';
  searchService = inject(SearchService);
  filters_ = {
    propertyFeatures: [
      'חניה',
      'מעלית',
      'ממ״ד',
      'מרפסת',
      'מיזוג',
      'מחסן',
      'משופצת',
      'גישה לנכים',
      'סורגים',
      'מרוהטת',
      'בבלעדיות',
      'חיות מחמד',
      'לשותפים',
    ],
  };
  propertyFeaturesHebrewToProperty: { [key: string]: keyof PropertyFilters } = {
    חניה: 'hasPrivateParking',
    מעלית: 'elevator',
    'ממ״ד': 'safeRoom',
    מרפסת: 'hasBolcony',
    מיזוג: 'airConditioner',
    מחסן: 'storageRoom',
    משופצת: 'renovated',
    'גישה לנכים': 'accessibleForDisabled',
    סורגים: 'windowBars',
    מרוהטת: 'furnished',
    בבלעדיות: 'exclusivity',
    'חיות מחמד': 'petsAllowed',
    לשותפים: 'forRoommates',
  } as const;
  selectedPropertyTypes: string[] = [];

  aptSizeRange: [number, number] = [0, 500];
  floorsRange: [string, string] = ['0', '18'];

  onPriceRangeSelected(priceRange: [number, number]) {
    const min = Math.min(priceRange[0], priceRange[1]);
    const max = Math.max(priceRange[0], priceRange[1]);
    this.searchService.minPrice.set(min);
    this.searchService.maxPrice.set(max);
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

  onSearch() {
    this.searchService.emitSelectedPropertyTypes(this.selectedPropertyTypes);
    this.searchService.emitSelectedPriceRange([
      this.searchService.minPrice(),
      this.searchService.maxPrice(),
    ]);

    this.searchService.setFilters(this.filters);
    this.close();
  }

  onRoomsAmountSelected(roomsAmount: string[]) {
    const minRooms = Math.min(...roomsAmount.map((room) => parseFloat(room)));
    const maxRooms = Math.max(...roomsAmount.map((room) => parseFloat(room)));

    this.searchService.minRooms.set(minRooms);
    this.searchService.maxRooms.set(maxRooms);
  }

  selectTradeType(option: string) {
    if (option === 'מכירה') {
      this.searchService.forSale.set(true);
      this.searchService.forRent.set(false);
      this.tradeType = 'מכירה';
      this.searchService.emitSelectedTradeType('מכירה');
    } else if (option === 'השכרה') {
      this.searchService.forSale.set(false);
      this.searchService.forRent.set(true);
      this.tradeType = 'השכרה';
      this.searchService.emitSelectedTradeType('השכרה');
    }
    this.searchService.needToMakeResetFilters.set(true);
  }

  filters: any = {
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
    isNewFromBuilder: undefined,
    isNew: undefined,
    isRenovated: undefined,
    isWellMaintained: undefined,
    needsRenovation: undefined,
  };

  @Output() applyFilters = new EventEmitter<any>();

  @Output() closeMenu = new EventEmitter<any>();

  constructor(private navigationService: NavigationService) {}

  close() {
    this.navigationService.searchFilterOpenClose(false);
    this.closeMenu.emit();
  }

  selectSvgURLByFilter(filter: string) {
    switch (filter) {
      case 'חניה':
        return 'assets/images/parking-svgrepo-com.svg';
      case 'מעלית':
        return 'assets/images/elevator-svgrepo-com.svg';
      case 'ממ״ד':
        return 'assets/images/secure-shield-password-protect-safe-svgrepo-com.svg';
      case 'מרפסת':
        return 'assets/images/icons_565162.svg';
      case 'מיזוג':
        return 'assets/images/air-conditioner-svgrepo-com.svg';
      case 'מחסן':
        return 'assets/images/box-svgrepo-com.svg';
      case 'משופצת':
        return 'assets/images/paint-roller-solid-svgrepo-com.svg';
      case 'גישה לנכים':
        return 'assets/images/disability-svgrepo-com.svg';
      case 'סורגים':
        return 'assets/images/square-split-2x2-svgrepo-com.svg';
      case 'מרוהטת':
        return 'assets/images/drawers-end-table-svgrepo-com.svg';
      case 'בבלעדיות':
        return 'assets/images/diamond-svgrepo-com.svg';
      case 'חיות מחמד':
        return 'assets/images/dog-svgrepo-com.svg';
      case 'לשותפים':
        return 'assets/images/users-svgrepo-com.svg';

      default:
        return '';
    }
  }

  resetFilters() {
    this.filters = {
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
      isNewFromBuilder: undefined,
      isNew: undefined,
      isRenovated: undefined,
      isWellMaintained: undefined,
      needsRenovation: undefined,
    };
    this.searchService.setFilters(this.filters);
  }

  onAptSizeSelected(size: any) {
    this.aptSizeRange = size;
    let minAptSizeRange = size[0] > size[1] ? size[1] : size[0];
    let maxAptSizeRange = size[0] > size[1] ? size[0] : size[1];
    if (size[0] !== 0) {
      this.searchService.minSquareSize.set(minAptSizeRange);
    }
    if (size[1] !== 500) {
      this.searchService.maxSqaureSize.set(maxAptSizeRange);
    }
  }
  onFloorsSelected(floors: any) {
    this.floorsRange = floors;
  }
}
