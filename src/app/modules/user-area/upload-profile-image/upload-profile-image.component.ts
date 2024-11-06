import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload-profile-image',
  templateUrl: './upload-profile-image.component.html',
  styleUrl: './upload-profile-image.component.css',
})
export class UploadProfileImageComponent implements OnInit {
  @Output() modalVisibilityChange = new EventEmitter<boolean>();
  @Output() imageChange = new EventEmitter<File | null>();
  @Output() imageUrl = new EventEmitter<string>();
  @Input() DeleteImageModal: boolean = false;
  hasuploadedImage = false;
  profileImageUrl: string = '';

  closeModal() {
    this.modalVisibilityChange.emit(false);
  }

  ngOnInit() {}

  constructor() {
    document.body.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target && target.id !== 'edit-img') {
        const backgroundColor = window.getComputedStyle(target).backgroundColor;
        if (
          backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          backgroundColor !== 'rgb(255, 255, 255)' &&
          target.id !== 'delete-img'
        ) {
          this.closeModal();
        }
      }
    });
  }

  deleteProfileImage() {
    this.imageChange.emit(null);
    this.imageUrl.emit('');
    this.hasuploadedImage = false;
    this.profileImageUrl = '';
  }

  openImageUpload() {
    const imageInput = document.getElementById('file') as HTMLInputElement;
    if (imageInput) {
      imageInput.click();
    }
  }

  uploadProfileImage(file: Event) {
    const target = file.target as HTMLInputElement;
    const image = target.files ? target.files[0] : null;

    if (image) {
      const imageURL = URL.createObjectURL(image);
      this.imageChange.emit(image);
      this.imageUrl.emit(imageURL);
      this.hasuploadedImage = true;
      this.profileImageUrl = imageURL;
    }
  }
}
