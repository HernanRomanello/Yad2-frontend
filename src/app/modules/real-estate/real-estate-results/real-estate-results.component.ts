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
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private render: Renderer2,
    private route: ActivatedRoute,
  ) {}

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
    this.searchService.filtersChanged,
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

        let ads = advertisements;

        ads = ads.filter((ad) =>
          Object.keys(booleanFilters).every((key) => {
            if (booleanFilters[key]) {
              // The UI retains its legacy names; these are distinct API fields.
              const field = key === 'pirceDiscount' ? 'priceDiscount'
                : key === 'airConditioner' ? 'airConditioning' : key;
              return (ad as any)[field] === true;
            }
            return true;
          }),
        );

        const [minFloor, maxFloor] = filters.floorsRange;
        const [minArea, maxArea] = filters.aptSizeRange;
        ads = ads.filter(ad =>
          (minFloor === '' || ad.floor >= Number(minFloor)) &&
          (maxFloor === '' || ad.floor <= Number(maxFloor)) &&
          ad.totalSquareMeters >= minArea && ad.totalSquareMeters <= maxArea);

        const propertyTypes = selectedPropertyTypes
          .filter(type => type !== 'דירות_הכל' && type !== 'בתים_הכל')
          .map(type => type.trim());
        if (propertyTypes.length > 0) {
          ads = ads.filter(ad => propertyTypes.includes(ad.assetType.trim()));
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
        if (this.searchService.minRooms() !== 0) {
          ads = ads.filter((ad) => {
            const rooms = parseFloat(ad.rooms);
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
