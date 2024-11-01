import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-profile-image',
  templateUrl: './upload-profile-image.component.html',
  styleUrl: './upload-profile-image.component.css',
})
export class UploadProfileImageComponent {
  @Output() modalVisibilityChange = new EventEmitter<boolean>();

  closeModal() {
    this.modalVisibilityChange.emit(false);
  }

  clickInsideModal(event: Event) {
    event.stopPropagation();
  }
  constructor() {
    document.body.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.id !== 'exit-btn') {
        alert('You clicked outside the modal');
      }
    });
  }
}
