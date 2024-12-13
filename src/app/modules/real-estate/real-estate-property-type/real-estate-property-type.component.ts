import { Component, EventEmitter, Output } from '@angular/core';
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

      var id = propertyType === 'דירות_הכל' ? 'all-apartments' : 'all-houses';
      var allApartmentsElements = document.getElementById(id);

      var countCheckedApartments = 0;
      for (let i = 0; i <= apartments.length; i++) {
        if (this.selectedPropertyTypes.includes(apartments[i])) {
          countCheckedApartments++;
        }
      }
      if (countCheckedApartments === apartments.length) {
        for (let i = 0; i <= apartments.length; i++) {
          for (let j = 0; j <= this.selectedPropertyTypes.length; j++) {
            if (apartments[i] === this.selectedPropertyTypes[j]) {
              this.selectedPropertyTypes = this.selectedPropertyTypes.filter(
                (type) => type !== apartments[i]
              );
            }
          }
        }
        if (allApartmentsElements) {
          allApartmentsElements.classList.remove('selected');
          this.searchService.propertyTypeFilterValue.set('סוג הנכס');
        }
        return;
      } else {
        var countCheckedApartments = 0;
      }

      this.selectedPropertyTypes.push(propertyType);
      if (allApartmentsElements) {
        allApartmentsElements.classList.toggle('selected');
      }

      this.selectedPropertyTypes = [
        ...apartments,
        ...this.selectedPropertyTypes,
      ];
    } else if (this.isSelected(propertyType)) {
      this.selectedPropertyTypes = this.selectedPropertyTypes.filter(
        (type) => type !== propertyType
      );
    } else {
      this.selectedPropertyTypes.push(propertyType);
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
