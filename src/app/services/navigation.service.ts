import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}
  // IsMainHeaderISOpen = new BehaviorSubject<boolean>(true);
  // IsMainFooterISOpen = new BehaviorSubject<boolean>(true);
  // IsalternativeHeaderISOpen = new BehaviorSubject<boolean>(false);
  // ISEditAdvertisementISOpen = new BehaviorSubject<boolean>(false);
  // IsFavoritesAdvertisementIsOpen = new BehaviorSubject<boolean>(false);
  // IsUserAreaISOpen = new BehaviorSubject<boolean>(false);
  IsMainHeaderISOpen = signal<boolean>(true);
  IsMainFooterISOpen = signal<boolean>(true);
  IsalternativeHeaderISOpen = signal<boolean>(false);
  ISEditAdvertisementISOpen = signal<boolean>(false);
  IsFavoritesAdvertisementIsOpen = signal<boolean>(false);
  IsUserAreaISOpen = signal<boolean>(false);

  IsHeaderAndFooterOpen(IsHeaderhide: boolean, IsFooterhide: boolean) {
    this.IsMainHeaderISOpen = signal(IsHeaderhide);
    this.IsMainFooterISOpen = signal(IsFooterhide);
  }

  isalternativeHeaderISOpen(IsOpen: boolean) {
    this.IsalternativeHeaderISOpen = signal(IsOpen);
  }

  isUserAreaOpen(isOpen: boolean) {
    this.IsUserAreaISOpen = signal(isOpen);
    if (isOpen) {
      this.IsFavoritesAdvertisementIsOpen = signal(false);
    }
  }

  isFavoritesAdIsOpen(isOpen: boolean) {
    this.IsFavoritesAdvertisementIsOpen = signal(isOpen);
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
