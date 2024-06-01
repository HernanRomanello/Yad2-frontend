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

  selectedPropertyTypes: string[] = [];
  // event emitter for selected
  // property type

  @Output() propertyTypeSelected = new EventEmitter<string[]>();

  emit(propertyType: string) {
    if (propertyType === 'דירות_הכל') {
      for (let i = 0; i < this.propertyTypes.apartment.length; i++) {
        if (
          this.selectedPropertyTypes.includes(this.propertyTypes.apartment[i])
        ) {
          this.selectedPropertyTypes = this.selectedPropertyTypes.filter(
            (type) => type !== this.propertyTypes.apartment[i]
          );
        }
      }
      this.selectedPropertyTypes = [
        ...this.propertyTypes.apartment,
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
