import { Component, inject } from '@angular/core';
import { AdvertisementService } from '../../../services/advertisement.service';
import { AdvertisementsModel } from '../../../shared/models/AdvertisementsModel';
import { AuthService } from '../../../services/user/auth.service';

@Component({
  selector: 'app-real-estate-results',
  templateUrl: './real-estate-results.component.html',
  styleUrls: [
    './real-estate-results.component.css',
    // '../../user-area/user-advertisement/user-advertisement.component.css',
  ],
})
export class RealEstateResultsComponent {
  advertisementService = inject(AdvertisementService);
  authSerivce = inject(AuthService);

  hoverIndex: number = -1;

  isFavorite(advertisementId: number): boolean {
    return this.authSerivce.UserFavoriteAdvertisements.value.some(
      (ad) => ad.id === advertisementId
    );
  }
}
