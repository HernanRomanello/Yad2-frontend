import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  nameOfComponentRendering = signal<string>('');
  IsSearchFilterOpen = signal<boolean>(false);

  searchFilterOpenClose(open: boolean) {
    this.IsSearchFilterOpen = signal(open);
  }

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
