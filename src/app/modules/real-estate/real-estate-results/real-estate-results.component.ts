import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { AdvertisementService } from '../../../services/advertisement.service';
import { AdvertisementsModel } from '../../../shared/models/AdvertisementsModel';
import { AuthService } from '../../../services/user/auth.service';
import { combineLatest, map } from 'rxjs';
import { SearchService } from '../../../services/search.service';
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
  searchService = inject(SearchService);
  authSerivce = inject(AuthService);

  hoverIndex: number = -1;

  // input selected property types

  $apartments = combineLatest([
    this.advertisementService.Advertisements,
    this.searchService.selectedPropertyTypes,
    this.searchService.selectedPriceRange,
    this.searchService.selectedTradeType,
    this.searchService.selectedRoomsAmount,
  ]).pipe(
    map(
      ([
        advertisements,
        selectedPropertyTypes,
        selectedPriceRange,
        selectedTradeType,
        selectedRoomsAmount,
      ]) => {
        console.log(selectedPriceRange);
        // all advertisements
        let ads = advertisements;
        // filter by property type
        if (selectedPropertyTypes.length > 0) {
          ads = ads.filter((ad) =>
            selectedPropertyTypes.includes(ad.assetType)
          );
        }
        // filter by price
        ads = ads.filter(
          (ad) =>
            ad.price >= selectedPriceRange[0] &&
            ad.price <= selectedPriceRange[1]
        );

        // filter by num rooms
        if (selectedRoomsAmount.length > 0) {
          ads = ads.filter((ad) => selectedRoomsAmount.includes(ad.rooms));
        }

        // fitler by search type
        ads = ads.filter((ad) => ad.tradeType === selectedTradeType);
        return ads;
      }
    )
  );
  isFavorite(advertisementId: number): boolean {
    return this.authSerivce.UserFavoriteAdvertisements.value.some(
      (ad) => ad.id === advertisementId
    );
  }
}
