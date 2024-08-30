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
  currentSlidesData: { [key: number]: { adIndex: number; id: number } } = {};
  userAdvertisements = this.authService.UserAdvertisements;

  ngOnInit(): void {
    this.authService.UserAdvertisements.subscribe((ads) => {
      ads.forEach((value, index) => {
        if (index > 2) {
          this.currentSlidesData[index] = { adIndex: 0, id: value.id };
        } else {
          this.currentSlidesData[index] = { adIndex: 2, id: value.id };
        }
      });
    });
    console.log('Current Slides Data:', this.currentSlidesData); // Verify the data

    console.log('index   ' + this.findAdIndexById(20));
  }

  setAssetType(option: any) {}

  selectOption(option: any, text: string) {}

  toggleDropdown(text: string) {}

  findAdIndexById(id: number): number {
    for (const key in this.currentSlidesData) {
      if (this.currentSlidesData[key].id === id) {
        return this.currentSlidesData[key].adIndex; // Return the adIndex of the matched object
      }
    }
    return -1; // Return -1 if the id is not found
  }

  goToSlide(increment: boolean, decrement: boolean, totalSlides: number) {
    // if (increment) {
    //   this.currentSlide++;
    //   if (this.currentSlide + 1 >= totalSlides) {
    //     this.currentSlide = totalSlides - 1;
    //   }
    // } else if (decrement) {
    //   this.currentSlide--;
    //   if (this.currentSlide < 0) {
    //     this.currentSlide = 0;
    //   }
    // }
  }
}
