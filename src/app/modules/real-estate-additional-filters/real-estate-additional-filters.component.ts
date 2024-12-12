import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
  inject,
} from '@angular/core';
import { SearchService } from '../../services/search.service';
import { PropertyFilters } from '../../shared/models/Filters';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-real-estate-additional-filters',
  templateUrl: './real-estate-additional-filters.component.html',
  styleUrl: './real-estate-additional-filters.component.css',
})
export class RealEstateAdditionalFiltersComponent {
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

  aptSizeRange: [number, number] = [0, 500];
  floorsRange: [string, string] = ['0', '18'];

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

  constructor(
    private navigationService: NavigationService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.addClickListener();
  }

  private addClickListener(): void {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (this.elementRef.nativeElement.contains(target)) {
        if (target.id !== 'x-icon' && target.id !== 'ok-btn') {
          this.navigationService.IsSearchFilterOpen.set(true);
        }
      }
    });
  }

  close() {
    this.navigationService.searchFilterOpenClose();
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
