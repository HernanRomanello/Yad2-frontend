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

  constructor() {
    document.body.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target && target.id !== 'edit-img') {
        const backgroundColor = window.getComputedStyle(target).backgroundColor;
        if (
          backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          backgroundColor !== 'rgb(255, 255, 255)'
        ) {
          this.closeModal();
        }
      }
    });
  }

  uploadProfileImage() {
    const imageInput = document.getElementById('file') as HTMLInputElement;
    if (imageInput) {
      imageInput.click();
    }
  }
}
