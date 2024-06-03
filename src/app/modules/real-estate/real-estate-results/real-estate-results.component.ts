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
import { CustomCurrencyPipe } from '../../../pipes/custom-currency.pipe';
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
  ]).pipe(
    map(([advertisements, selectedPropertyTypes]) => {
      if (selectedPropertyTypes.length === 0) return advertisements;
      return advertisements.filter((ad) =>
        selectedPropertyTypes.includes(ad.assetType)
      );
    })
  );
  isFavorite(advertisementId: number): boolean {
    return this.authSerivce.UserFavoriteAdvertisements.value.some(
      (ad) => ad.id === advertisementId
    );
  }
}
