import {
  Component,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from '../../../services/user/auth.service';
import { AdvertisementService } from '../../../services/advertisement.service';

@Component({
  selector: 'app-user-advertisement',
  templateUrl: './user-advertisement.component.html',
  styleUrl: './user-advertisement.component.css',
})
export class UserAdvertisementComponent implements OnInit {
  authService = inject(AuthService);
  advertisementService = inject(AdvertisementService);
  assetTypes: string[] = [];
  firstPromotionSliderIsVisible = true;
  currentSlidesData: {
    [key: number]: { adIndex: number; id: number; isVisible: boolean };
  } = {};
  userAdvertisements = this.authService.UserAdvertisements;

  ngOnInit(): void {
    this.authService.UserAdvertisements.subscribe((ads) => {
      ads.forEach((value, index) => {
        this.currentSlidesData[index] = {
          adIndex: 0,
          id: value.id,
          isVisible: false,
        };
      });
    });
  }

  changeColor(condition: boolean, color1: string, color2: string): string {
    if (condition) {
      return color1;
    } else {
      return color2;
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

  findIfIsVisibleById(id: number): boolean {
    for (const key in this.currentSlidesData) {
      if (this.currentSlidesData[key].id === id) {
        return this.currentSlidesData[key].isVisible;
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

  showArrow(id: number, isVisible: boolean) {
    for (const key in this.currentSlidesData) {
      if (this.currentSlidesData[key].id === id) {
        this.currentSlidesData[key].isVisible = isVisible;
        console.log(this.currentSlidesData);
      }
    }
  }
}
