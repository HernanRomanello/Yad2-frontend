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
  filters = {
    withImage: false,
    onlyCommunities: false,
    withPrice: false,
    priceDropped: false,
    newProperty: false,
    publisher: '',
    parking: false,
    elevator: false,
    mamad: false,
    balcony: false,
    airConditioning: false,
    storage: false,
    renovated: false,
    accessible: false,
    bars: false,
    furnished: false,
    exclusive: false,
    newFromContractor: false,
    new: false,
    renovated5Years: false,
    wellMaintained: false,
    needsRenovation: false,
    basement: false,
    floorMin: null,
    floorMax: null,
    sizeMin: null,
    sizeMax: null,
    entryDate: '',
    immediateEntry: false,
    freeSearch: '',
  };

  resetFilters() {
    this.filters = {
      withImage: false,
      onlyCommunities: false,
      withPrice: false,
      priceDropped: false,
      newProperty: false,
      publisher: '',
      parking: false,
      elevator: false,
      mamad: false,
      balcony: false,
      airConditioning: false,
      storage: false,
      renovated: false,
      accessible: false,
      bars: false,
      furnished: false,
      exclusive: false,
      newFromContractor: false,
      new: false,
      renovated5Years: false,
      wellMaintained: false,
      needsRenovation: false,
      basement: false,
      floorMin: null,
      floorMax: null,
      sizeMin: null,
      sizeMax: null,
      entryDate: '',
      immediateEntry: false,
      freeSearch: '',
    };
  }

  applyFilters() {
    console.log(this.filters);
    // Implement filter logic here
  }
}
