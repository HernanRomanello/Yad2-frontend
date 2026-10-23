import { Component, EventEmitter, Output, Input, OnChanges, WritableSignal, inject } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { PropertyFilters, emptyPropertyFilters } from '../../shared/models/Filters';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-real-estate-additional-filters',
  // Nested mobile controls share the dialog draft, not the applied search state.
  providers: [SearchService],
  templateUrl: './real-estate-additional-filters.component.html',
  styleUrl: './real-estate-additional-filters.component.css',
})
export class RealEstateAdditionalFiltersComponent implements OnChanges {
  @Input() active = false;
  private readonly appliedSearch = inject(SearchService, { skipSelf: true });
  private readonly draftSignals = ['minPrice', 'maxPrice', 'minRooms', 'maxRooms', 'assetTypeList',
    'propertyTypeFilterValue', 'forSale', 'forRent', 'locationList', 'city', 'neighborhood'] as const;
  ngOnChanges() {
    if (!this.active) return;
    this.filters = this.appliedSearch.getFilters();
    this.tradeType = this.appliedSearch.selectedTradeType.value;
    this.selectedPropertyTypes = [...this.appliedSearch.selectedPropertyTypes.value];
    this.copySignals(this.appliedSearch, this.searchService);
  }
  private copySignals(from: SearchService, to: SearchService) {
    for (const key of this.draftSignals) {
      (to[key] as WritableSignal<unknown>).set(structuredClone(from[key]()));
    }
  }

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
  propertyFeaturesHebrewToProperty: { [key: string]: Exclude<keyof PropertyFilters, 'floorsRange' | 'aptSizeRange'> } = {
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
      if (uniquePropertyTypes.includes('דירות_הכל')) {
        optionsNumber--;
      }
      if (uniquePropertyTypes.includes('בתים_הכל')) {
        optionsNumber--;
      }
      this.searchService.propertyTypeFilterValue.set(
        `סוג הנכס (${optionsNumber}) `,
      );
    }

    if (optionsNumber === 11 && propertyTypes.includes('דירות_הכל')) {
      this.searchService.propertyTypeFilterValue.set('דירות');
    }
    if (optionsNumber === 4 && propertyTypes.includes('בתים_הכל')) {
      this.searchService.propertyTypeFilterValue.set('בתים');
    }

    this.selectedPropertyTypes = uniquePropertyTypes;

    this.searchService.assetTypeList.set(
      this.searchService.transformArrayTOPropertyTypesString(
        uniquePropertyTypes,
      ),
    );
  }

  onSearch() {
    this.copySignals(this.searchService, this.appliedSearch);
    this.appliedSearch.needToMakeResetFilters.set(false);
    this.appliedSearch.setFilters(this.filters);
    this.appliedSearch.emitSelectedTradeType(this.tradeType);
    this.appliedSearch.emitSelectedPropertyTypes(this.selectedPropertyTypes);
    this.appliedSearch.emitSelectedPriceRange([this.searchService.minPrice(), this.searchService.maxPrice()]);
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

    } else if (option === 'השכרה') {
      this.searchService.forSale.set(false);
      this.searchService.forRent.set(true);
      this.tradeType = 'השכרה';

    }

  }

  filters: PropertyFilters = emptyPropertyFilters();

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
    this.filters = emptyPropertyFilters();
    this.appliedSearch.setFilters(this.filters);
  }
  onAptSizeSelected(size: [number, number]) { this.filters.aptSizeRange = [...size]; }
  onFloorsSelected(floors: [string, string]) { this.filters.floorsRange = [...floors]; }
}
