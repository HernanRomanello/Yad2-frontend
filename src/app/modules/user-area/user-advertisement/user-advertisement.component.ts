import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/user/auth.service';
import { AdvertisementService } from '../../../services/advertisement.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-user-advertisement',
  templateUrl: './user-advertisement.component.html',
  styleUrl: './user-advertisement.component.css',
})
export class UserAdvertisementComponent implements OnInit {
  authService = inject(AuthService);
  navigationService = inject(NavigationService);
  advertisementService = inject(AdvertisementService);
  assetTypes: string[] = [];
  userAdvertisements = this.authService.UserAdvertisements;
  currentSlidesData: {
    [key: number]: { adIndex: number; id: number; isVisible: boolean };
  } = {};
  currentSlidesPromotionAd: {
    [key: number]: { adIndex: number; id: number; isVisible: boolean };
  } = {};
  currentSlidesPromotionIndex: {
    [key: number]: {
      adIndex: number;
      id: number;
      currentPromotionSliderColor: string;
      secondPromotionSliderColor: string;
      isFirstSliderIsVisible: boolean;
    };
  } = {};

  ngOnInit(): void {
    this.authService.UserAdvertisements.subscribe((ads) => {
      ads.forEach((value, index) => {
        this.currentSlidesData[index] = {
          adIndex: 0,
          id: value.id,
          isVisible: false,
        };
        this.currentSlidesPromotionAd[index] = {
          adIndex: 0,
          id: value.id,
          isVisible: false,
        };
        this.currentSlidesPromotionIndex[index] = {
          adIndex: 0,
          id: value.id,
          currentPromotionSliderColor: '#cccccc',
          secondPromotionSliderColor: '#363636',
          isFirstSliderIsVisible: true,
        };
      });
    });
  }

  findIfTheFirstSlideIsVisibleById(advertisementId: number): boolean {
    for (const key in this.currentSlidesPromotionIndex) {
      if (this.currentSlidesPromotionIndex.hasOwnProperty(key)) {
        const slide = this.currentSlidesPromotionIndex[key];
        if (slide.id == advertisementId) {
          return slide.isFirstSliderIsVisible;
        }
      }
    }
    return true;
  }

  transformDateToString(date: Date | string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();

    return `${day}.${month}.${year}`;
  }

  changeColor(currentIndex: number, advertisementId: number): string {
    if (currentIndex == 0) {
      for (const key in this.currentSlidesPromotionIndex) {
        if (this.currentSlidesPromotionIndex.hasOwnProperty(key)) {
          const slide = this.currentSlidesPromotionIndex[key];
          if (slide.id == advertisementId) {
            return slide.currentPromotionSliderColor;
          }
        }
      }
    }

    if (currentIndex == 1) {
      for (const key in this.currentSlidesPromotionIndex) {
        if (this.currentSlidesPromotionIndex.hasOwnProperty(key)) {
          const slide = this.currentSlidesPromotionIndex[key];
          if (slide.id == advertisementId) {
            return slide.secondPromotionSliderColor;
          }
        }
      }
    }
    return '';
  }

  setColors(adID: number, newcolor: string, arrow: string) {
    for (const key in this.currentSlidesPromotionIndex) {
      if (this.currentSlidesPromotionIndex.hasOwnProperty(key)) {
        const slide = this.currentSlidesPromotionIndex[key];
        if (slide.id == adID) {
          if (arrow === 'rightArrow') {
            slide.secondPromotionSliderColor = '#363636';
            slide.currentPromotionSliderColor = '#cccccc';
            slide.isFirstSliderIsVisible = true;
          } else if (arrow === 'leftArrow') {
            slide.secondPromotionSliderColor = '#cccccc';
            slide.currentPromotionSliderColor = '#363636';
            slide.isFirstSliderIsVisible = false;
          }
        }
      }
    }
  }

  setAssetType(option: any) {}

  selectOption(option: any, text: string) {}

  toggleDropdown(text: string) {}

  findAdIndexById(id: number): number {
    for (const key in this.currentSlidesData) {
      if (this.currentSlidesData[key].id === id) {
        return this.currentSlidesData[key].adIndex;
      }
    }
    return -1;
  }
  aggregateZerosToIDNumber(id: number): string {
    var ID = id.toString();
    var newID = '';
    for (var i = 0; i < 8 - ID.length; i++) {
      newID += '0';
    }
    newID += ID;

    return newID;
  }

  findIfIsVisibleById(id: number, arrows: any): boolean {
    for (const key in arrows) {
      if (arrows[key].id === id) {
        return arrows[key].isVisible;
      }
    }
    return false;
  }

  goToSlide(
    increment: boolean,
    decrement: boolean,
    totalSlides: number,
    id: number
  ) {
    const ImageNumber = this.findAdIndexById(id);
    for (const key in this.currentSlidesData) {
      if (this.currentSlidesData[key].id === id) {
        if (increment) {
          this.currentSlidesData[key].adIndex++;
          if (ImageNumber + 1 >= totalSlides) {
            this.currentSlidesData[key].adIndex = totalSlides - 1;
          }
        } else if (decrement) {
          this.currentSlidesData[key].adIndex--;
          if (ImageNumber <= 0) {
            this.currentSlidesData[key].adIndex = 0;
          }
        }
      }
    }
  }

  showArrow(id: number, imgArrowsIsVisible: boolean, arrows: any) {
    for (const key in arrows) {
      if (arrows[key].id === id) {
        arrows[key].isVisible = imgArrowsIsVisible;
      }
    }
  }
}
