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
import { isFakeTouchstartFromScreenReader } from '@angular/cdk/a11y';
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
  navigationService = inject(NavigationService);

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

  constructor(private render: Renderer2) {}

  clickEvent(event: Event) {
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
            }),
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
            }),
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
            }),
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
            }),
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
      ]) => {
        isFakeTouchstartFromScreenReader;
        if (this.searchService.needToMakeResetFilters()) {
          this.searchService.needToMakeResetFilters.set(false);

          const tradeTypeFilter = !this.searchService.forRent()
            ? 'מכירה'
            : 'השכרה';

          return advertisements.filter(
            (ad) => ad.tradeType === tradeTypeFilter,
          );
        }

        const filters = this.searchService.getFilters();
        let booleanFilters: { [key: string]: FilterValue } = Object.keys(
          filters,
        )
          .filter(
            (key: string) =>
              typeof (filters as any)[key] === 'boolean' ||
              typeof (filters as any)[key] === 'undefined',
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
          }),
        );
        ads = ads.filter(
          (ad) =>
            ad.builtSquareMeters >= aptSizeMin &&
            ad.builtSquareMeters <= aptSizeMax,
        );
        ads = ads.filter(
          (ad) => ad.floor >= floorsMin && ad.floor <= floorsMax,
        );

        if (this.searchService.assetTypeList()) {
          ads = ads.filter(
            (ad) =>
              ad.assetType.trim() === this.searchService.assetTypeList().trim(),
          );
        }

        if (this.searchService.minPrice() > 0) {
          ads = ads.filter((ad) => ad.price >= this.searchService.minPrice());
        }

        if (
          this.searchService.maxPrice() > 0 &&
          this.searchService.maxPrice() !== 20000
        ) {
          ads = ads.filter((ad) => ad.price <= this.searchService.maxPrice());
        }

        ads = ads.filter((ad) => ad.tradeType === selectedTradeType);

        if (this.searchService.locationList().length > 0) {
          const locations = this.searchService.locationList();

          ads = ads.filter((ad) =>
            locations.some(
              (loc) =>
                (ad.city === loc.city && loc.neighborhood === '') ||
                (ad.neighborhood === loc.neighborhood && loc.city === '') ||
                (ad.city === loc.city && ad.neighborhood === loc.neighborhood),
            ),
          );
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
            (ad) => ad.hasPrivateParking === filters.hasPrivateParking,
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
            (ad) => ad.airConditioning === filters.airConditioner,
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
            (ad) => ad.accessibleForDisabled === filters.accessibleForDisabled,
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

        if (this.searchService.minRooms() !== 0) {
          ads = ads.filter((ad) => {
            const rooms = parseFloat(ad.rooms);
            console.log(rooms);
            return !isNaN(rooms) && rooms >= this.searchService.minRooms();
          });
        }

        if (
          this.searchService.maxRooms() !== 0 &&
          this.searchService.maxRooms() !== 6
        ) {
          ads = ads.filter((ad) => {
            const rooms = parseFloat(ad.rooms);
            return !isNaN(rooms) && rooms <= this.searchService.maxRooms();
          });
        }

        return ads;
      },
    ),
  );

  isFavorite(advertisementId: number): boolean {
    return this.authSerivce.UserFavoriteAdvertisements.value.some(
      (ad) => ad.id === advertisementId,
    );
  }
}
