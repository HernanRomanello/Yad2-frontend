import { Component } from '@angular/core';

@Component({
  selector: 'app-real-estate-additional-filters',
  templateUrl: './real-estate-additional-filters.component.html',
  styleUrl: './real-estate-additional-filters.component.css',
})
export class RealEstateAdditionalFiltersComponent {
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

  assetState = ['חדש מקבלן', 'חדש', 'משופץ', 'במצב שמור', 'דרוש שיפוץ'];

  filters = {
    hasImage: false,
    moshavOrKibutz: false,
    hasPrice: false,
    pirceDiscount: false,
    publisherIsMiddleMan: false,
    publisherIsContractor: false,
    hasPrivateParking: false,
    elevator: false,
    safeRoom: false,
    hasBolcony: false,
    airConditioner: false,
    storageRoom: false,
    renovated: false,
    accessibleForDisabled: false,
    windowBars: false,
    furnished: false,
    exclusivity: false,
    petsAllowed: false,
    forRoommates: false,
  };

  resetFilters() {
    this.filters = {
      hasImage: false,
      moshavOrKibutz: false,
      hasPrice: false,
      pirceDiscount: false,
      publisherIsMiddleMan: false,
      publisherIsContractor: false,
      hasPrivateParking: false,
      elevator: false,
      safeRoom: false,
      hasBolcony: false,
      airConditioner: false,
      storageRoom: false,
      renovated: false,
      accessibleForDisabled: false,
      windowBars: false,
      furnished: false,
      exclusivity: false,
      petsAllowed: false,
      forRoommates: false,
    };
  }

  applyFilters() {
    console.log(this.filters);
    // Implement filter logic here
  }
}
