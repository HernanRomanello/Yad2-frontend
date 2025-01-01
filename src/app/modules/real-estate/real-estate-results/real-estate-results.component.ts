import {
  Component,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AdvertisementService } from '../../../services/advertisement.service';
import { AdvertisementsModel } from '../../../shared/models/AdvertisementsModel';
import { AuthService } from '../../../services/user/auth.service';
import { BehaviorSubject, combineLatest, map, of } from 'rxjs';
import { SearchService } from '../../../services/search.service';
import { FilterValue } from '../../../shared/models/Filters';
import { NavigationService } from '../../../services/navigation.service';
@Component({
  selector: 'app-real-estate-results',
  templateUrl: './real-estate-results.component.html',
  styleUrls: ['./real-estate-results.component.css'],
})
export class RealEstateResultsComponent implements OnInit {
  advertisementService = inject(AdvertisementService);
  searchService = inject(SearchService);
  authSerivce = inject(AuthService);

  $sortedApartments: BehaviorSubject<AdvertisementsModel[]> =
    new BehaviorSubject<AdvertisementsModel[]>([]);
  apartmentsAmount: number = 0;
  sortType: string[] = [
    'תאריך',
    'מחיר - מהזול ליקר',
    'מחיר - מהיקר לזול',
    'קרוב אלי',
  ];
  sortTypeChecked: boolean[] = [true, false, false, false];
  sortTypeChosen: string = 'תאריך';
  isSortDropdownOpen: boolean = false;
  @ViewChild('sortDropdown', { static: false })
  sortDropdown!: ElementRef;
  IsSearchFilterOpen = false;

  hoverIndex: number = -1;

  constructor(
    private render: Renderer2,
    public navigationService: NavigationService
  ) {
    document.body.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (
        !target.classList.contains('result') &&
        !target.classList.contains('date') &&
        !target.classList.contains('material-icons') &&
        !target.classList.contains('search-button')
      ) {
        if (this.isSortDropdownOpen.valueOf() === true) {
          this.SortDropdownOpen();
        }
      }
    });
  }
  ngOnInit(): void {
    this.sortByFilter('תאריך');
  }

  sortByFilter(sortTypeChosen: string): void {
    switch (sortTypeChosen) {
      case 'מחיר - מהזול ליקר':
        this.$apartments
          .pipe(
            map((apartments) => {
              return [...apartments].sort((a, b) => a.price - b.price);
            })
          )
          .subscribe((sortedApartments) => {
            this.$sortedApartments.next(sortedApartments) as any;
          });

        break;
      case 'מחיר - מהיקר לזול':
        this.$apartments
          .pipe(
            map((apartments) => {
              return apartments.sort((a, b) => b.price - a.price) as any;
            })
          )
          .subscribe((sortedApartments) => {
            this.$sortedApartments.next(sortedApartments);
          });
        break;
      case 'קרוב אלי':
        this.$apartments
          .pipe(
            map((apartments) => {
              return [...apartments].sort((a, b) => a.id - b.id);
            })
          )
          .subscribe((sortedApartments) => {
            this.$sortedApartments.next(sortedApartments) as any;
          });

        break;
      case 'תאריך':
        this.$apartments
          .pipe(
            map((apartments) => {
              return apartments.sort((a, b) => b.id - a.id) as any;
            })
          )
          .subscribe((sortedApartments) => {
            this.$sortedApartments.next(sortedApartments);
          });

        break;
    }
  }

  SortDropdownOpen(): void {
    this.isSortDropdownOpen = !this.isSortDropdownOpen;
    if (this.isSortDropdownOpen) {
      this.render.addClass(this.sortDropdown.nativeElement, 'rotate');
    } else {
      this.render.removeClass(this.sortDropdown.nativeElement, 'rotate');
    }
  }

  sortResults(sortType: string): void {
    this.sortType.forEach((type, index) => {
      if (type === sortType) {
        this.sortTypeChecked[index] = true;
        this.sortTypeChosen = sortType;
      } else {
        this.sortTypeChecked[index] = false;
      }
    });
    this.sortByFilter(sortType);
  }

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

        let ads = advertisements;

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
        ads = ads.filter(
          (ad) => ad.floor >= floorsMin && ad.floor <= floorsMax
        );

        if (selectedPropertyTypes.length > 0) {
          ads = ads.filter((ad) =>
            selectedPropertyTypes.includes(ad.assetType)
          );
        }

        if (selectedPriceRange[0] >= 0 || selectedPriceRange[1] !== 20000) {
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
        if (this.searchService.selectedCityText.value !== '') {
          ads = ads.filter(
            (ad) =>
              ad.city === this.searchService.selectedCityText.value &&
              ad.street === this.searchService.selectedStreetText.value
          );
        } else if (this.searchService.locationSubject.value.length > 0) {
          of(ads)
            .pipe(
              map((adList) => {
                return adList.reduce((acc, ad) => {
                  this.searchService.locationSubject.value.forEach((loc) => {
                    if (ad.city === loc.city && loc.neighborhood === '') {
                      acc.push(ad);
                    } else if (
                      ad.neighborhood === loc.neighborhood &&
                      loc.city === ''
                    ) {
                      acc.push(ad);
                    } else if (
                      ad.city === loc.city &&
                      ad.neighborhood === loc.neighborhood
                    ) {
                      acc.push(ad);
                    }
                  });
                  return acc;
                }, [] as any[]);
              })
            )
            .subscribe((filteredAds) => {
              ads = filteredAds;
            });
        }

        this.apartmentsAmount = ads.length;
        if (filters.hasImage) {
          ads = ads.filter((ad) => ad.hasImage === filters.hasImage);
        }
        if (filters.hasPrice) {
          ads = ads.filter((ad) => ad.hasPrice === filters.hasPrice);
        }
        if (filters.hasPrivateParking) {
          ads = ads.filter(
            (ad) => ad.hasPrivateParking === filters.hasPrivateParking
          );
        }
        if (filters.safeRoom) {
          ads = ads.filter((ad) => ad.safeRoom === filters.safeRoom);
        }
        if (filters.hasBolcony) {
          ads = ads.filter((ad) => ad.hasBolcony === filters.hasBolcony);
        }
        if (filters.airConditioner) {
          ads = ads.filter(
            (ad) => ad.airConditioning === filters.airConditioner
          );
        }
        if (filters.storageRoom) {
          ads = ads.filter((ad) => ad.storageRoom === filters.storageRoom);
        }
        if (filters.renovated) {
          ads = ads.filter((ad) => ad.renovated === filters.renovated);
        }
        if (filters.accessibleForDisabled) {
          ads = ads.filter(
            (ad) => ad.accessibleForDisabled === filters.accessibleForDisabled
          );
        }
        if (filters.windowBars) {
          ads = ads.filter((ad) => ad.windowBars === filters.windowBars);
        }
        if (filters.furnished) {
          ads = ads.filter((ad) => ad.furnished === filters.furnished);
        }
        if (filters.petsAllowed) {
          ads = ads.filter((ad) => ad.petsAllowed === filters.petsAllowed);
        }
        if (filters.petsAllowed) {
          ads = ads.filter((ad) => ad.forRoommates === filters.forRoommates);
        }
        // ads = ads.filter((ad) => {
        //   ad.totalSquareMeters >= filters.aptSizeRange[0] &&
        //     ad.totalSquareMeters <= filters.aptSizeRange[1];
        // });
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
