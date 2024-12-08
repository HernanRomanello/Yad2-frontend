import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  IsMainHeaderISOpen = signal<boolean>(true);
  IsMainFooterISOpen = signal<boolean>(true);
  IsalternativeHeaderISOpen = signal<boolean>(false);
  IsEditAdvertisementISOpen = signal<boolean>(false);
  IsFavoriteAdvertisementOrLastsearchesIsOpen = signal<boolean>(false);
  IsUserAreaISOpen = signal<boolean>(false);
  IsSearchFilterOpen = signal<boolean>(false);
  IsAdpageOpen = signal<boolean>(false);

  IsHeaderAndFooterOpen(IsHeaderhide: boolean, IsFooterhide: boolean) {
    this.IsMainHeaderISOpen = signal(IsHeaderhide);
    this.IsMainFooterISOpen = signal(IsFooterhide);
  }

  searchFilterOpenClose() {
    if (this.IsSearchFilterOpen().valueOf() === true) {
      this.IsSearchFilterOpen = signal(false);
    } else {
      this.IsSearchFilterOpen = signal(true);
    }
  }

  isEditAdvertisementISOpen(IsOpen: boolean) {
    this.IsEditAdvertisementISOpen = signal(IsOpen);
  }

  isalternativeHeaderISOpen(IsOpen: boolean) {
    this.IsalternativeHeaderISOpen = signal(IsOpen);
  }

  isUserAreaOpen(isOpen: boolean) {
    this.IsUserAreaISOpen = signal(isOpen);
    if (isOpen) {
      this.IsFavoriteAdvertisementOrLastsearchesIsOpen = signal(false);
    }
  }

  isFavoriteAdvertisementOrLastsearchesIsOpen(isOpen: boolean) {
    this.IsFavoriteAdvertisementOrLastsearchesIsOpen = signal(isOpen);
    if (isOpen) {
      this.IsUserAreaISOpen = signal(false);
    }
  }

  navigateInNewWindow(route: string, queryParams?: any) {
    const urlTree = this.router.createUrlTree([route], { queryParams });
    const url = this.router.serializeUrl(urlTree);

    window.open(url, '_blank');
  }
}
