import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/user/auth.service';
import { AdvertisementService } from '../../../services/advertisement.service';

@Component({
  selector: 'app-user-advertisement',
  templateUrl: './user-advertisement.component.html',
  styleUrl: './user-advertisement.component.css',
})
export class UserAdvertisementComponent implements OnInit {
  ngOnInit(): void {
    this.authService.UserAdvertisements.subscribe((ads) => {
      ads.forEach((value, index) => {
        this.currentSlides[index] = 0;
      });
    });
  }
  authService = inject(AuthService);
  advertisementService = inject(AdvertisementService);
  assetTypes: string[] = [];
  currentSlides: { [adIndex: number]: number } = {};
  userAdvertisements = this.authService.UserAdvertisements;

  setAssetType(option: any) {}

  selectOption(option: any, text: string) {}

  toggleDropdown(text: string) {}

  currentSlide = 0;

  goToSlide(increment: boolean, decrement: boolean, totalSlides: number) {
    if (increment) {
      this.currentSlide++;
      if (this.currentSlide + 1 >= totalSlides) {
        this.currentSlide = totalSlides - 1;
      }
    } else if (decrement) {
      this.currentSlide--;
      if (this.currentSlide < 0) {
        this.currentSlide = 0;
      }
    }
  }
}
