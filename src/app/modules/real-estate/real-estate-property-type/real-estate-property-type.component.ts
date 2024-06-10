import { Component, EventEmitter, Output } from '@angular/core';

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
  // event emitter for selected
  // property type

  @Output() propertyTypeSelected = new EventEmitter<string[]>();

  emit(propertyType: string) {
    if (propertyType === 'דירות_הכל' || propertyType === 'בתים_הכל') {
      this.allApartmentTypesChecked = !this.allApartmentTypesChecked;
      var apartments =
        propertyType === 'דירות_הכל'
          ? this.propertyTypes.apartment
          : this.propertyTypes.house;

      var id = propertyType === 'דירות_הכל' ? 'all-apartments' : 'all-houses';

      var countCheckedApartments = 0;
      for (let i = 0; i <= apartments.length; i++) {
        if (this.selectedPropertyTypes.includes(apartments[i])) {
          countCheckedApartments++;
        }
      }
      if (countCheckedApartments === apartments.length) {
        alert('all checked');
        for (let i = 0; i <= apartments.length; i++) {
          for (let j = 0; j <= this.selectedPropertyTypes.length; j++) {
            if (apartments[i] === this.selectedPropertyTypes[j]) {
              this.selectedPropertyTypes = this.selectedPropertyTypes.filter(
                (type) => type !== apartments[i]
              );
            }
          }
        }
        var allApartmentsElements = document.getElementById(id);
        if (allApartmentsElements) {
          allApartmentsElements.classList.remove('selected');
        }
        return;
      } else {
        var countCheckedApartments = 0;
      }

      this.selectedPropertyTypes.push(propertyType);

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

    this.propertyTypeSelected.emit(this.selectedPropertyTypes);
  }

  isSelected(propertyType: string) {
    return this.selectedPropertyTypes.includes(propertyType);
  }

  className(propertyType: string) {
    return this.isSelected(propertyType) ? 'selected' : '';
  }
}
