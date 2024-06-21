import { Component, EventEmitter, Output, inject } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { PropertyFilters } from '../../shared/models/Filters';

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

  assetState = ['חדש מקבלן', 'חדש', 'משופץ', 'במצב שמור', 'דרוש שיפוץ'];
  aptSizeRange: [number, number] = [0, 0];
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
  };

  @Output() closeMenu = new EventEmitter<any>();

  close() {
    this.closeMenu.emit();
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
    };
    this.searchService.setFilters({
      ...this.filters,
      aptSizeRange: [0, 20000],
      floorsRange: ['0', '18'],
    });
  }

  onAptSizeSelected(size: any) {
    console.log('APT SIZE', size);
    // console.log(event);
    this.aptSizeRange = size;
  }
  onFloorsSelected(floors: any) {
    console.log('FLOORS', floors);
    // console.log(event);
    this.floorsRange = floors;
  }

  applyFilters() {
    let filters = {
      ...this.filters,
      aptSizeRange: this.aptSizeRange,
      floorsRange: this.floorsRange,
    };
    this.searchService.setFilters(filters);
    this.close();
    // console.log(this.filters);
    // Implement filter logic here
  }
}
