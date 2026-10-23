import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-real-estate-property-type',
  templateUrl: './real-estate-property-type.component.html',
  styleUrl: './real-estate-property-type.component.css',
})
export class RealEstatePropertyTypeComponent {
  public propertyTypes = {
    apartment: [
      'דירה',
      'דירת גן',
      'גג/ פנטהאוז',
      'דופלקס',
      'תיירות ונופש',
      'מרתף/ פרטר',
      'טריפלקס',
      'יחידת דיור',
      'החלפת דירות',
      'סאבלט',
      'סטודיו/ לופט',
    ] as const,
    house: [
      'בית פרטי/ קוטג',
      'דו משפחתי',
      'משק חקלאי/ נחלה',
      'משק עזר',
    ] as const,
    other: [
      'מגרשים',
      'דיור מוגן',
      'בניין מגורים',
      'מחסן',
      'חניה',
      "קב' רכישה/ זכות לנכס",
      'כללי',
    ] as const,
  } as const;

  allApartmentTypesChecked = false;

  selectedPropertyTypes: string[] = [];

  constructor(private searchService: SearchService) {}

  @Output() propertyTypeSelected = new EventEmitter<string[]>();

  emit(propertyType: string) {
    if (propertyType === 'דירות_הכל' || propertyType === 'בתים_הכל') {
      this.allApartmentTypesChecked = !this.allApartmentTypesChecked;

      var apartments =
        propertyType === 'דירות_הכל'
          ? this.propertyTypes.apartment
          : this.propertyTypes.house;

      const groupSelected = apartments.every(type => this.selectedPropertyTypes.includes(type));
      if (groupSelected) {
        this.selectedPropertyTypes = this.selectedPropertyTypes.filter(
          type => type !== propertyType && !apartments.some(groupType => groupType === type),
        );
      } else {
        this.selectedPropertyTypes = [...new Set([
          ...apartments, ...this.selectedPropertyTypes, propertyType,
        ])];
      }
    } else if (this.isSelected(propertyType)) {
      this.selectedPropertyTypes = this.selectedPropertyTypes.filter(
        (type) => type !== propertyType
      );
    } else {
      this.selectedPropertyTypes.push(propertyType);
    }
    // A group marker is valid only while every member of that group is selected.
    for (const [marker, types] of [
      ['דירות_הכל', this.propertyTypes.apartment],
      ['בתים_הכל', this.propertyTypes.house],
    ] as const) {
      if (!types.every(type => this.selectedPropertyTypes.includes(type))) {
        this.selectedPropertyTypes = this.selectedPropertyTypes.filter(type => type !== marker);
      }
    }
    this.checkeIfAllApartmentsSelected('all-apartments', 'apartment');
    this.checkeIfAllApartmentsSelected('all-houses', 'house');
    this.propertyTypeSelected.emit(this.selectedPropertyTypes);
  }

  isSelected(propertyType: string) {
    return this.selectedPropertyTypes.includes(propertyType);
  }

  className(propertyType: string) {
    return this.isSelected(propertyType) ? 'selected' : '';
  }

  checkeIfAllApartmentsSelected(id: string, Class: string): void {
    var countCheckedApartments = 0;
    var apartments =
      Class === 'apartment'
        ? this.propertyTypes.apartment
        : this.propertyTypes.house;
    for (let i = 0; i <= apartments.length; i++) {
      if (this.selectedPropertyTypes.includes(apartments[i])) {
        countCheckedApartments++;
      }
    }
    var allApartmentsElements = document.getElementById(id);
    if (countCheckedApartments === apartments.length) {
      if (allApartmentsElements) {
        allApartmentsElements.classList.add('selected');
        countCheckedApartments = 0;
      }
    } else {
      if (allApartmentsElements) {
        allApartmentsElements.classList.remove('selected');
      }
    }
  }
}
