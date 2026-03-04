import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

const mobileButtonCss = {
  cursor: 'pointer',
  border: '1px solid #cccccc',
  'border-radius': '50%',
  height: '42px',
  width: '42px',
  background: 'none',
};

const mobileContainerSelected = {
  'background-color': 'rgb(255,250,245)',
  border: '1px solid #FF7137',
  display: 'flex',
  padding: '2px 16px',
  direction: 'rtl',
  overflow: 'hidden',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  'border-radius': '16px',
};

@Component({
  selector: 'app-rooms-filter-mobile',
  templateUrl: './rooms-filter-mobile.component.html',
  styleUrl: './rooms-filter-mobile.component.css',
})
export class RoomsFilterMobileComponent {
  selectedRooms: string[] = [];
  rooms = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '+6'];

  selectedRoom_1: string | undefined;
  selectedRoom_2: string | undefined;

  @ViewChild('Mobilebar') Mobilebar!: ElementRef;
  @Output() propertyRoomSelected = new EventEmitter<string[]>();

  emit() {
    let index1 = this.selectedRoom_1
      ? this.rooms.indexOf(this.selectedRoom_1)
      : -1;
    let index2 = this.selectedRoom_2
      ? this.rooms.indexOf(this.selectedRoom_2)
      : -1;

    if (this.selectedRoom_1 && this.selectedRoom_2 === undefined) {
      this.propertyRoomSelected.emit([this.rooms[index1]]);
    }

    if (this.selectedRoom_1 && this.selectedRoom_2) {
      let selected =
        index1 <= index2
          ? this.rooms.slice(index1, index2 + 1)
          : this.rooms.slice(index2, index1 + 1);
      this.propertyRoomSelected.emit(selected);
    }
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
    this.emit();
  }

  updateBarStyle() {
    if (
      (this.selectedRoom_1 && !this.selectedRoom_2) ||
      (this.selectedRoom_1 === this.selectedRoom_2 && this.selectedRoom_1)
    ) {
      this.Mobilebar.nativeElement.innerHTML = '';

      for (let i = 0; i < this.rooms.length; i++) {
        let div = document.createElement('button');
        div.classList.add('room-btn');
        div.id = `mobile-btn-${this.rooms[i]}`;
        div.innerText = this.rooms[i];
        Object.assign(div.style, mobileButtonCss);
        div.addEventListener('click', () => this.onSelectRoom(this.rooms[i]));
        this.Mobilebar.nativeElement.appendChild(div);
      }
      const button = document.getElementById(
        `mobile-btn-${this.selectedRoom_1}`,
      );

      if (button) {
        button.style.border = '1px solid #FF7137';
      }
      this.selectedRoom_2 = undefined;
    }

    if (this.selectedRoom_1 && this.selectedRoom_2) {
      this.Mobilebar.nativeElement.innerHTML = '';
      let index1 = this.rooms.indexOf(this.selectedRoom_1);
      let index2 = this.rooms.indexOf(this.selectedRoom_2);
      let start = Math.min(index1, index2);
      let end = Math.max(index1, index2);

      for (let i = 0; i < start; i++) {
        let div = document.createElement('button');
        div.classList.add('room-btn');
        div.id = `mobile-btn-${this.rooms[i]}`;
        div.innerText = this.rooms[i];
        Object.assign(div.style, mobileButtonCss);
        div.addEventListener('click', () => this.onSelectRoom(this.rooms[i]));
        this.Mobilebar.nativeElement.appendChild(div);
      }
      let containerSpecial = document.createElement('div');
      Object.assign(containerSpecial.style, mobileContainerSelected);
      for (let i = start; i <= end; i++) {
        let div = document.createElement('button');
        div.classList.add('room-btn');
        div.id = `mobile-btn-${this.rooms[i]}`;
        div.addEventListener('click', () => this.onSelectRoom(this.rooms[i]));
        div.innerText = this.rooms[i];
        containerSpecial.appendChild(div);
        Object.assign(div.style, mobileButtonCss);
        const dif = end - start;

        if (dif === 10) {
          Object.assign(div.style, { width: `${dif * 4.2}vw` });
        } else if (dif > 7) {
          Object.assign(div.style, { width: `${dif * 5}vw` });
        }

        div.style.border = 'none';
      }
      this.Mobilebar.nativeElement.appendChild(containerSpecial);

      for (let i = end + 1; i < this.rooms.length; i++) {
        let div = document.createElement('button');
        div.classList.add('room-btn');
        div.addEventListener('click', () => this.onSelectRoom(this.rooms[i]));
        div.id = `mobile-btn-${this.rooms[i]}`;
        div.innerText = this.rooms[i];
        Object.assign(div.style, mobileButtonCss);

        this.Mobilebar.nativeElement.appendChild(div);
      }
    }
  }
}
