import { Injectable } from '@angular/core';
import { title } from 'node:process';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  adds = [
    {
      title: 'רנט איט מוריה אטריום',
      pic: 'assets/images/ad2.jpg',
      city: 'מודעין מכבים רעות',
      program: 'שכירות ארוכת טווח',
    },

    {
      title: 'אשטרום תל אביב',
      pic: 'assets/images/ad1.jpg',
      city: 'תל אביב יפו',
      program: 'מהפכת השכירות בתל אביב',
    },
    {
      title: 'מורשת טל',
      pic: 'assets/images/ad3.jpg',
      city: 'מודעין מכבים רעות',
      program: 'מבצע חד-פעמי לפנטהואוזים!',
    },
  ];
  selectedPropertyTypes: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);

  selectedPriceRange: BehaviorSubject<[number, number]> = new BehaviorSubject([
    -100000000, 100000000,
  ]);

  selectedTradeType: BehaviorSubject<'מכירה' | 'השכרה'> = new BehaviorSubject(
    'מכירה' as 'מכירה' | 'השכרה'
  );

  selectedRoomsAmount: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  constructor() {}

  emitSelectedTradeType(searchType: 'מכירה' | 'השכרה') {
    this.selectedTradeType.next(searchType);
  }
  emitSelectedPropertyTypes(propertyTypes: string[]) {
    this.selectedPropertyTypes.next(propertyTypes);
  }
  emitSelectedPriceRange(priceRange: [number, number]) {
    this.selectedPriceRange.next(priceRange);
  }

  emitSelectedRoomsAmount(roomsAmount: string[]) {
    this.selectedRoomsAmount.next(roomsAmount);
  }
}
