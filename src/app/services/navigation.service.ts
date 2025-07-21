import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  nameOfComponentRendering = signal<string>('');

  IsMainHeaderISOpen = signal<boolean>(true);
  IsMainFooterISOpen = signal<boolean>(true);
  IsalternativeHeaderISOpen = signal<boolean>(false);
  IsEditAdvertisementISOpen = signal<boolean>(false);
  IsFavoriteAdvertisementOrLastsearchesIsOpen = signal<boolean>(false);
  IsUserAreaISOpen = signal<boolean>(false);
  IsSearchFilterOpen = signal<boolean>(false);
  IsAdpageOpen = signal<boolean>(false);
  isCreateNewAdIsOpen = signal<boolean>(false);
  isUserImagesIsOpen = signal<boolean>(false);

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

  setComponentNavigation(url: string) {
    console.log(url);
    if (url.includes('profile')) {
      this.nameOfComponentRendering.set('profile');
    } else if (url.includes('advertisement')) {
      this.nameOfComponentRendering.set('advertisement');
    } else if ((url = '/')) {
      this.nameOfComponentRendering.set('Main Page');
    } else if ((url = '/create-advertisement')) {
      this.nameOfComponentRendering.set('create-advertisement');
    } else if ((url = '/favorites')) {
      this.nameOfComponentRendering.set('favorites');
    } else if ((url = '/last-searches')) {
      this.nameOfComponentRendering.set('last-searches');
    } else if ((url = '/last-searches')) {
      this.nameOfComponentRendering.set('last-searches');
    }
  }
}
