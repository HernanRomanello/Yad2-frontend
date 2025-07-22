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
  IsAlternativeHeaderISOpen = signal<boolean>(false);
  IsEditAdvertisementISOpen = signal<boolean>(false);

  IsFavoriteAdvertisementOrLastsearchesIsOpen = signal<boolean>(false);
  IsUserAreaISOpen = signal<boolean>(false);
  IsSearchFilterOpen = signal<boolean>(false);
  IsAdpageOpen = signal<boolean>(false);
  isCreateNewAdIsOpen = signal<boolean>(false);
  isUserImagesIsOpen = signal<boolean>(false);

  // IsHeaderAndFooterOpen(IsHeaderhide: boolean, IsFooterhide: boolean) {
  //   this.IsMainHeaderISOpen = signal(IsHeaderhide);
  //   this.IsMainFooterISOpen = signal(IsFooterhide);
  // }

  searchFilterOpenClose() {
    if (this.IsSearchFilterOpen().valueOf() === true) {
      this.IsSearchFilterOpen = signal(false);
    } else {
      this.IsSearchFilterOpen = signal(true);
    }
  }

  // isEditAdvertisementISOpen(IsOpen: boolean) {
  //   this.IsEditAdvertisementISOpen = signal(IsOpen);
  // }

  // isalternativeHeaderISOpen(IsOpen: boolean) {
  //   this.IsAlternativeHeaderISOpen = signal(IsOpen);
  // }

  // isUserAreaOpen(isOpen: boolean) {
  //   this.IsUserAreaISOpen = signal(isOpen);
  //   if (isOpen) {
  //     this.IsFavoriteAdvertisementOrLastsearchesIsOpen = signal(false);
  //   }
  // }

  // isFavoriteAdvertisementOrLastsearchesIsOpen(isOpen: boolean) {
  //   this.IsFavoriteAdvertisementOrLastsearchesIsOpen = signal(isOpen);
  //   if (isOpen) {
  //     this.IsUserAreaISOpen = signal(false);
  //   }
  // }

  navigateInNewWindow(route: string, queryParams?: any) {
    const urlTree = this.router.createUrlTree([route], { queryParams });
    const url = this.router.serializeUrl(urlTree);

    window.open(url, '_blank');
  }

  setComponentNavigation(url: string) {
    if (url.includes('profile')) {
      this.nameOfComponentRendering.set('profile');
    } else if (url.includes('/favorites')) {
      console.log(url);
      this.nameOfComponentRendering.set('favorites');
    } else if (url.includes('/last-searches')) {
      this.nameOfComponentRendering.set('last-searches');
    } else if (url.includes('edit-advertisement')) {
      this.nameOfComponentRendering.set('edit-advertisement');
    } else if (url.includes('/create-advertisement')) {
      this.nameOfComponentRendering.set('create-advertisement');
    } else if (url.includes('advertisement')) {
      this.nameOfComponentRendering.set('advertisement');
    } else if (url.includes('user-images')) {
      this.nameOfComponentRendering.set('user-images');
    } else if (url.includes('/')) {
      this.nameOfComponentRendering.set('MainPage');
    }
  }

  isNotPages(pages: string[]): boolean {
    return !pages.includes(this.nameOfComponentRendering());
  }
  isPages(pages: string[]): boolean {
    return pages.includes(this.nameOfComponentRendering());
  }
}
