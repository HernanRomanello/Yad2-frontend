import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/user/auth.service';
import { AdvertisementService } from '../../../services/advertisement.service';

@Component({
  selector: 'app-user-advertisement',
  templateUrl: './user-advertisement.component.html',
  styleUrl: './user-advertisement.component.css',
})
export class UserAdvertisementComponent {
  authService = inject(AuthService);
  advertisementService = inject(AdvertisementService);
  assetTypes: string[] = [];

  setAssetType(option: any) {}

  selectOption(option: any, text: string) {}

  toggleDropdown(text: string) {}

  currentSlide = 0;

  goToSlide(
    currentIndex: number,
    increment: boolean,
    decrement: boolean,
    totalSlides: number
  ) {
    if (increment) {
      currentIndex++;
    } else if (decrement) {
      currentIndex--;
    }

    if (currentIndex < 0) {
      currentIndex = 0;
    }

    if (currentIndex > totalSlides) {
      // currentIndex = totalSlides;
    }

    this.currentSlide = currentIndex;
  }
}
