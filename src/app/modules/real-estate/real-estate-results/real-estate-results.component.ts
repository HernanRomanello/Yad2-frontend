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
import { FilterValue } from '../../../shared/models/Filters';
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
  sortType: string[] = ['date', 'price-asc', 'price-desc', 'location'];

  hoverIndex: number = -1;

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
        const filters = this.searchService.getFilters();
        let booleanFilters: { [key: string]: FilterValue } = Object.keys(
          filters
        )
          .filter(
            (key: string) =>
              typeof (filters as any)[key] === 'boolean' ||
              typeof (filters as any)[key] === 'undefined'
          )
          .reduce((acc: any, key: string) => {
            acc[key] = (filters as any)[key];
            return acc;
          }, {});
        let [aptSizeMin, aptSizeMax] = filters.aptSizeRange;
        let [floorsMin, floorsMax] = filters.floorsRange.map((n) => {
          if (n === 'מרתף') return -1;
          if (n === 'קרקע') return 0;
          return parseInt(n);
        });

        console.log(selectedPriceRange);
        let ads = advertisements;

        console.log(booleanFilters);
        ads = ads.filter((ad) =>
          Object.keys(booleanFilters).every((key) => {
            if (booleanFilters[key]) {
              return (ad as any)[key] === booleanFilters[key];
            }
            return true;
          })
        );
        ads = ads.filter(
          (ad) =>
            ad.builtSquareMeters >= aptSizeMin &&
            ad.builtSquareMeters <= aptSizeMax
        );
        console.log(floorsMin, floorsMax);
        ads = ads.filter(
          (ad) => ad.floor >= floorsMin && ad.floor <= floorsMax
        );

        if (selectedPropertyTypes.length > 0) {
          ads = ads.filter((ad) =>
            selectedPropertyTypes.includes(ad.assetType)
          );
        }
        if (selectedPriceRange[0] !== 0 || selectedPriceRange[1] !== 20000) {
          ads = ads.filter(
            (ad) =>
              ad.price >= selectedPriceRange[0] &&
              ad.price <= selectedPriceRange[1]
          );
        }
        if (selectedRoomsAmount.length > 0) {
          ads = ads.filter((ad) => selectedRoomsAmount.includes(ad.rooms));
        }

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
