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

  selectedRoom_1: string | undefined;
  selectedRoom_2: string | undefined;

  @Output() propertyRoomSelected = new EventEmitter<string[]>();

  emit(propertyRooms: string) {
    this.propertyRoomSelected.emit(this.selectedRooms);
  }

  onSelectRoom(room: string) {
    if (this.selectedRoom_2) {
      this.selectedRoom_2 = undefined;
      this.selectedRoom_1 = room;
    } else if (this.selectedRoom_1) {
      this.selectedRoom_2 = room;
    } else {
      this.selectedRoom_1 = room;
    }

    this.updateBarStyle();
  }

  updateBarStyle() {
    if (this.selectedRoom_1 && this.selectedRoom_2) {
      const index_1 = this.rooms.indexOf(this.selectedRoom_1 as string);
      const index_2 = this.rooms.indexOf(this.selectedRoom_2 as string);
      let half = (index_1 + index_2) / 2;
      for (
        let i = Math.min(index_1, index_2);
        i <= Math.max(index_1, index_2);
        i++
      ) {
        const el = document.getElementById(`btn-${this.rooms[i]}`);
        if (!el) continue;
        el.style.borderLeft = 'none';
        el.style.borderRight = 'none';
        el.style.borderRadius = '0';
        el.style.borderColor = 'rgb(255,113,0)';
        el.style.borderTop = '1px solid rgb(255,113,0)';
        el.style.borderBottom = '1px solid rgb(255,113,0)';
        el.style.background = 'rgb(255,250,245)';
        if (i > half) {
          el.style.transform = 'translateX(5px)';
        } else {
          el.style.transform = 'translateX(-5px)';
        }
        //  this.selectedRooms.push(this.rooms[i]);
      }
      const el_1 = document.getElementById(`btn-${this.selectedRoom_1}`);
      const el_2 = document.getElementById(`btn-${this.selectedRoom_2}`);
      if (el_1 && el_2) {
        // remove non number
        let removed = this.selectedRoom_1?.replace(/[^0-9]/g, '');
        let removed_2 = this.selectedRoom_2?.replace(/[^0-9]/g, '');

        let asNum1 = parseFloat(removed as string);
        let asNum2 = parseFloat(removed_2 as string);
        if (asNum1 < asNum2) {
          el_2.style.borderLeft = '1px solid rgb(255,113,0)';
          el_2.style.borderRight = 'none';

          el_1.style.borderRight = '1px solid rgb(255,113,0)';
          el_1.style.borderLeft = 'none';

          // radius
          el_2.style.borderTopLeftRadius = '100%';
          el_2.style.borderBottomLeftRadius = '100%';

          el_1.style.borderTopRightRadius = '100%';
          el_1.style.borderBottomRightRadius = '100%';
        } else {
          el_2.style.borderLeft = 'none';
          el_2.style.borderRight = '1px solid rgb(255,113,0)';

          el_1.style.borderRight = 'none';
          el_1.style.borderLeft = '1px solid rgb(255,113,0)';

          // radius
          el_1.style.borderTopLeftRadius = '100%';
          el_1.style.borderBottomLeftRadius = '100%';

          el_2.style.borderTopRightRadius = '100%';
          el_2.style.borderBottomRightRadius = '100%';
        }
      }
    }
  }
}
