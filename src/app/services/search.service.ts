import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  selectedPropertyTypes: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  constructor() {}

  emitSelectedPropertyTypes(propertyTypes: string[]) {
    this.selectedPropertyTypes.next(propertyTypes);
  }
}
