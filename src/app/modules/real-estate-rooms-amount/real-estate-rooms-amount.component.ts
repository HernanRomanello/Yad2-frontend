import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-real-estate-rooms-amount',
  templateUrl: './real-estate-rooms-amount.component.html',
  styleUrl: './real-estate-rooms-amount.component.css',
})
export class RealEstateRoomsAmountComponent {
  selectedRooms: string[] = [];
  rooms = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '+6'];
  // event emitter for selected
  // property type

  @Output() propertyTypeSelected = new EventEmitter<string[]>();

  emit(propertyRooms: string) {
    this.propertyTypeSelected.emit(this.selectedRooms);
  }
}
